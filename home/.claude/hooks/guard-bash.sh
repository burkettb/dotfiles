#!/usr/bin/env bash
# PreToolUse guard for Claude Code Bash calls. Reads the hook JSON on stdin and
# prints one decision JSON line on stdout. Five rules:
#   1. deny any command that touches a credential store or runs a key or token
#      dump, sandboxed or not
#   2. deny dangerouslyDisableSandbox on an excluded tool used in a compound call
#      (sandbox.excludedCommands only matches a standalone call, so the bypass is
#      the wrong fix; the right fix is to re-issue the tool alone)
#   3. force a prompt ("ask") for remote-server, cloud-account and history writes
#   4. force a prompt for GitHub writes that can land on main or change a repo
#      without a PR (agents act as Brandon's GitHub identity)
#   5. force a prompt for risky git pushes (default branch, force, delete, tags);
#      feature-branch pushes fall through
# Anything else falls through (exit 0, no output) to the normal permission flow.
# Without jq, or on input it can't parse, the hook asks instead of allowing.
# settings.json sets "onFailure": "block", so a crash or timeout blocks the call.
# Must run on macOS /bin/bash 3.2.
# Tests: tests/guard-bash.test.sh
# Dry run:
#   echo '{"tool_input":{"command":"git push origin main"}}' | ~/.claude/hooks/guard-bash.sh
set -uf
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

ask_raw() {
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}
command -v jq >/dev/null 2>&1 || ask_raw "guard-bash.sh can't find jq, so none of its rules ran on this command. Check it by hand; fix with brew install jq."

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2>/dev/null) ||
  ask_raw "guard-bash.sh couldn't parse the hook input, so none of its rules ran. Check this command by hand."
off=$(printf '%s' "$input" | jq -r '.tool_input.dangerouslyDisableSandbox // false' 2>/dev/null) || off=false
cwd=$(printf '%s' "$input" | jq -r '.cwd // ""' 2>/dev/null) || cwd=""
[ -n "$cmd" ] || exit 0

decide() {
  jq -cn --arg d "$1" --arg r "$2" \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:$d,permissionDecisionReason:$r}}'
  exit 0
}

# Matching copies of the command. Newlines become " ; " so each line is its own
# command. flat drops quotes, backslashes and braces, so "$HOME"/.aws, ${HOME}/.aws
# and ~/".aws" all read as $HOME/.aws. cmdpos also unwraps sh -c / eval bodies and
# blanks quoted strings that contain spaces (commit messages, search patterns), so
# a tool named in prose doesn't count as running it.
nl=$'\n'
one=${cmd//$nl/ ; }
flat=$(printf '%s' "$one" | tr -d "\"'\\\\{}")
cmdpos=$(printf '%s' "$one" | sed -E \
  -e "s/(^|[^[:alnum:]_-])(-c|eval)[[:space:]]+\"([^\"]*)\"/\1\2 ; \3 ;/g" \
  -e "s/(^|[^[:alnum:]_-])(-c|eval)[[:space:]]+'([^']*)'/\1\2 ; \3 ;/g" \
  -e "s/\"[^\"]*[[:space:]][^\"]*\"/_/g" \
  -e "s/'[^']*[[:space:]][^']*'/_/g" | tr -d "\"'\\\\{}")

# 1. credential stores and key operations.
#    Paths: every spelling of a home directory ($HOME, ~, ~user, /Users/x) becomes
#    ~, then each word is checked as a home path, or, when the call runs in or cds
#    into a home directory, as a path relative to it. ~/.ssh/config, known_hosts and
#    ~/.aws/config stay readable on purpose. A glob is denied when it could expand
#    to a protected path.
protected=".aws/credentials .aws/sso .aws/cli .ssh/id_ .gnupg .docker/config.json .netrc .git-credentials .npmrc .pypirc Library/Keychains .codex/auth.json .config/gh/hosts.yml .t3/userdata/secrets .local/share/atuin .kube .config/gcloud"
canon() { # canon <home-relative path>: sets c to the path with . and .. resolved
  local IFS=/ seg
  c=""
  for seg in $1; do
    case $seg in
      '' | .) ;;
      ..) case $c in */*) c=${c%/*} ;; *) c="" ;; esac ;;
      *) c=${c:+$c/}$seg ;;
    esac
  done
}
is_secret() { # is_secret <canonical home-relative path>
  local p=$1 pre q IFS=' '
  case $p in
    .aws/config | .ssh/config | .ssh/known_hosts | .ssh/known_hosts.old) return 1 ;;
    .aws | .aws/* | .ssh | .ssh/* | .gnupg | .gnupg/* | .kube | .kube/* | .config/gcloud | .config/gcloud/* | \
      Library/Keychains | Library/Keychains/* | .t3/userdata/secrets | .t3/userdata/secrets/* | \
      .local/share/atuin | .local/share/atuin/* | .docker/config.json | .netrc | .git-credentials | \
      .npmrc | .pypirc | .codex/auth.json | .config/gh/hosts.yml) return 0 ;;
  esac
  case $p in *[*?[]*) ;; *) return 1 ;; esac
  pre=${p%%[*?[]*}
  is_secret "$pre" && return 0
  for q in $protected; do case $q in "$pre"*) return 0 ;; esac; done
  return 1
}
home_rel() { # home_rel <absolute path>: prints the path relative to $HOME, or fails
  case $1 in "$HOME") printf '/' ;; "$HOME"/*) printf '/%s' "${1#"$HOME"/}" ;; *) return 1 ;; esac
}
cred_path() { # prints the first word that names a protected path
  local h toks t prev="" b bases="" r IFS
  h=$(printf '%s' "$flat" | sed -E \
    -e 's#\$HOME([^A-Za-z0-9_]|$)#~\1#g' \
    -e 's#(^|[[:space:]=:(<>|;&`])(~[A-Za-z0-9._-]*|/Users/[^/[:space:]:]+|/var/root)(/|[[:space:]:;&|)]|$)#\1~\3#g')
  toks=$(printf '%s' "$h" | tr -s ' \t;&|()<>=:,`' '\n')
  r=$(home_rel "$cwd") && bases=$r
  printf '%s' "$h" | grep -Eq '(^|[;&|(])[[:space:]]*cd[[:space:]]*($|[;&|)])' && bases="$bases$nl/"
  IFS=$nl
  for t in $toks; do
    case $prev in cd | pushd | -C | --directory)
      case $t in
        "~") bases="$bases$nl/" ;;
        "~/"*) bases="$bases$nl${t#\~}" ;;
        /* | -* | \$*) ;;
        *) [ -n "$r" ] && bases="$bases$nl$r/$t" ;;
      esac ;;
    esac
    prev=$t
  done
  for t in $toks; do
    case $t in
      "~" | "~/"*) canon "${t#\~}"; is_secret "$c" && { printf '%s' "$t"; return; } ;;
      /* | -* | \$* | "~"*) ;;
      *) for b in $bases; do canon "$b/$t"; is_secret "$c" && { printf '%s' "$t"; return; }; done ;;
    esac
  done
}
hit=$(cred_path)
[ -n "$hit" ] && decide deny "Credential store path ($hit). These are denied on purpose; ask Brandon for the non-secret part (profile name, host alias) or ask him to run the command himself."

#    Key and token dumps count only in command position, so a commit message or a
#    search pattern that names one passes.
at='(^|[;&|(`]|\$\()[[:space:]]*((([A-Za-z_][A-Za-z0-9_]*=[^[:space:]]*)|sudo|env|exec|command|builtin|nohup|time|xargs|then|do|else|!)[[:space:]]+(-[^[:space:]]+[[:space:]]+)*)*([^[:space:];&|]*/)?'
keyop='(ssh-add([[:space:];&|)]|$)|ssh-keygen([[:space:]]+[^;&|]*)?[[:space:]]+-[A-Za-z]*y|security[[:space:]]+((find|dump)-|export)|aws[[:space:]]+configure[[:space:]]+(export-credentials|get[[:space:]]+[^;&|]*(secret|token|key))|gh[[:space:]]+auth[[:space:]]+(token|status[^;&|]*(-t|--show-token)))'
if printf '%s' "$cmdpos" | grep -Eq "$at$keyop"; then
  decide deny "Key or token operation (ssh-add, ssh-keygen -y, security find/dump/export, aws configure export-credentials/get, gh auth token). These are denied on purpose; ask Brandon to run it himself."
fi

# 2. excluded tools must be standalone calls. A single excluded command carrying
#    only a leading "cd <dir> &&" or a "git -C <dir>" is tolerated: the harness
#    resets cwd after every call, so cross-repo work has no other way to target
#    the repo, and nothing else rides along under the flag.
excl='(^|[;&|(]|\$\() *(ssh|scp|rsync|gh|glab|devcenter|docker|codex|aws)\b|\bgit +(commit|tag|fetch|pull|push|cherry-pick|rebase)\b'
compound='&&|\|\||;|\||\$\(|`'
rest=$(printf '%s' "$cmd" | sed -E 's/^[[:space:]]*cd[[:space:]]+[^;&|]+&&[[:space:]]*//')
if [ "$off" = "true" ] && printf '%s' "$rest" | grep -Eq "$excl" && printf '%s' "$rest" | grep -Eq "$compound"; then
  decide deny "This tool is in sandbox.excludedCommands and already runs outside the sandbox when it is the whole call. Re-issue it alone: no && or ; chain, no pipe, no \$( ). A single leading 'cd <repo> &&' or 'git -C <repo>' is fine when the repo is not the working directory. Put git log/status/tail in the next call."
fi

# 3. outward or destructive actions get a prompt with context
outward='\bssh\b.*\b(sudo|rsync|rm |mv |cp |chown|chmod|systemctl|nohup|tee )'
outward="$outward"'|\baws +(ec2 +(start|stop|reboot|terminate|modify|create|delete)|ecs +(update|run-task|stop-task|create|delete|register|deregister)|rds +(modify|delete|reboot|restore|create|start|stop)|iam +(create|put|attach|detach|delete|update|add|remove)|s3 +(rm|sync|cp|mv|rb)|s3api +(put|delete|create)|secretsmanager +(put|update|create|delete|rotate)|ssm +(put|delete|send-command|start-automation)|lambda +(invoke|update|create|delete)|wafv2 +(update|associate|disassociate|create|delete|put)|elbv2 +(create|modify|delete|register|deregister|set)|scheduler +(create|update|delete)|cloudformation +(create|update|delete|deploy)|eks +(update|create|delete)|route53 +change)'
outward="$outward"'|\b(terraform|tofu)( +-chdir=[^ ]+)? +(apply|destroy|import)|\bgh +pr +(close|reopen|merge)|\bglab +mr +(close|merge|reopen)|\bglab +api +.*(--method|-X) +(PUT|DELETE)'
outward="$outward"'|\bgit +(branch +-D|stash +drop|reset +--hard|rebase +--root|filter-repo|filter-branch)'
if printf '%s' "$flat" | grep -Eq "$outward"; then
  decide ask "Outward or destructive action. Name the approved plan step it belongs to before Brandon confirms."
fi

# 4. GitHub writes that skip the PR flow. gh api sends POST whenever it has
#    fields (-f/-F/--input) unless the call says GET; GraphQL asks on mutations
#    or a query it can't see (--input, @file, $( )).
ghask() { decide ask "GitHub write as Brandon that can land on main or change the repo without a PR ($1). Name the approved plan step it belongs to before Brandon confirms."; }
if printf '%s' "$cmdpos" | grep -Eq '\bgh[[:space:]]+(repo[[:space:]]+(delete|edit|rename|archive|unarchive|sync)|secret[[:space:]]+(set|delete|remove)|variable[[:space:]]+(set|delete)|release[[:space:]]+(create|delete|edit|upload))\b'; then
  ghask "gh repo/secret/variable/release change"
fi
if printf '%s' "$cmdpos" | grep -Eq '\bgh[[:space:]]+api\b'; then
  if printf '%s' "$flat" | grep -Eq '(^|[[:space:]])graphql([[:space:]]|$)'; then
    printf '%s' "$flat" | grep -Eiq 'mutation|--input|=@|\$\(' && ghask "gh api graphql mutation"
  elif printf '%s' "$flat" | grep -Eiq '(-X|--method)[[:space:]=]*(PUT|POST|PATCH|DELETE)'; then
    ghask "gh api write"
  elif printf '%s' "$flat" | grep -Eq '(^|[[:space:]])(-[fF]|--field|--raw-field|--input)' &&
    ! printf '%s' "$flat" | grep -Eiq '(-X|--method)[[:space:]=]*GET'; then
    ghask "gh api with fields defaults to POST"
  fi
fi

# 5. risky pushes ask; a push to a feature branch falls through. Covers every
#    spelling (git push, git -C <dir> push, cd <dir> && git push, quoted refs).
#    Risky means: main/master or the default branch of the named remote or origin,
#    force, delete, tags (--tags, --follow-tags, push.followTags), --all or
#    --mirror, a bare push while on a default branch, or a push the hook can't read.
if printf '%s' "$flat" | grep -Eq '\bgit( +(-[Cc] +[^ ]+|--[a-z-]+(=[^ ]+)?))* +push\b'; then
  risky() { decide ask "Risky push: $1. Brandon approves pushes to the default branch, force pushes, deletes and tag pushes himself; quote where he said to."; }
  printf '%s' "$rest" | grep -Eq "$compound" && risky "push inside a compound command"
  dir=$cwd
  resolve() { local d=${1//[\"\']/}; d=${d/#\~/$HOME}; case $d in /*) printf '%s' "$d" ;; *) printf '%s/%s' "$dir" "$d" ;; esac; }
  lead=$(printf '%s' "$cmd" | head -1 | sed -nE 's/^[[:space:]]*cd[[:space:]]+([^;&|]*[^;&|[:space:]])[[:space:]]*&&.*/\1/p')
  [ -n "$lead" ] && dir=$(resolve "$lead")
  words=($(printf '%s' "$rest" | tr -d "\"'\\\\"))
  in_push=false skip=false remote="" refs=()
  for ((i = 0; i < ${#words[@]}; i++)); do
    w=${words[i]}
    if ! $in_push; then
      case $w in
        -C) dir=$(resolve "${words[i+1]-}"); i=$((i + 1)) ;;
        -c)
          kv=$(printf '%s' "${words[i+1]-}" | tr '[:upper:]' '[:lower:]')
          case $kv in push.followtags=false | push.followtags=no | push.followtags=off | push.followtags=0) ;;
            push.followtags*) risky "-c $kv" ;; esac
          i=$((i + 1)) ;;
        push) in_push=true ;;
      esac
      continue
    fi
    if $skip; then skip=false; continue; fi
    case $w in
      --force* | --delete | --mirror | --all | --tags | --follow-tags | --prune) risky "$w" ;;
      -o | --push-option | --repo | --receive-pack | --exec) skip=true ;;
      --*) ;;
      -*) [[ $w =~ [fd] ]] && risky "$w" ;;
      *) if [ -z "$remote" ]; then remote=$w; else refs+=("$w"); fi ;;
    esac
  done
  g() { git -C "$dir" "$@" 2>/dev/null; }
  [ "$(g config --bool push.followTags)" = true ] && risky "push.followTags is on"
  cur=$(g symbolic-ref --short HEAD)
  [ -n "$remote" ] || remote=$(g config "branch.$cur.pushRemote" || g config remote.pushDefault || g config "branch.$cur.remote")
  defs=""
  for rm in ${remote:+"$remote"} origin; do
    d=$(g symbolic-ref --short "refs/remotes/$rm/HEAD") && defs="$defs ${d#"$rm"/}"
  done
  is_main() { case $1 in main | master) return 0 ;; esac; for d in $defs; do [ "$1" = "$d" ] && return 0; done; return 1; }
  if [ ${#refs[@]} -eq 0 ]; then
    [ -n "$cur" ] || risky "bare push with no branch checked out in ${dir:-the working directory}"
    is_main "$cur" && risky "bare push from $cur"
  fi
  for r in ${refs[@]+"${refs[@]}"}; do
    case $r in +*) risky "force refspec $r" ;; :*) risky "delete refspec $r" ;; esac
    dst=${r#*:}; dst=${dst#refs/heads/}
    [ "$dst" = HEAD ] && dst=$cur
    [ -n "$dst" ] || risky "unreadable push target $r"
    case $dst in refs/tags/*) risky "tag $dst" ;; esac
    g show-ref --verify --quiet "refs/tags/$dst" && risky "tag $dst"
    is_main "$dst" && risky "push to $dst"
  done
fi
exit 0
