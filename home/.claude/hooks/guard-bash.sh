#!/usr/bin/env bash
# PreToolUse guard for Claude Code Bash calls. Reads the hook JSON on stdin and
# prints one decision JSON line on stdout. Four rules:
#   1. deny any command that touches a credential store, sandboxed or not
#   2. deny dangerouslyDisableSandbox on an excluded tool used in a compound call
#      (sandbox.excludedCommands only matches a standalone call, so the bypass is
#      the wrong fix; the right fix is to re-issue the tool alone)
#   3. force a prompt ("ask") for remote-server, cloud-account and history writes
#   4. force a prompt for risky git pushes (default branch, force, delete, tags);
#      feature-branch pushes fall through
# Anything else falls through (exit 0, no output) to the normal permission flow.
# The hook fails open: a crash or timeout lets the call proceed with a notice.
# Tests: tests/guard-bash.test.sh
# Dry run:
#   echo '{"tool_input":{"command":"cat ~/.aws/credentials"}}' | ~/.claude/hooks/guard-bash.sh
set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
command -v jq >/dev/null 2>&1 || exit 0

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2>/dev/null) || exit 0
off=$(printf '%s' "$input" | jq -r '.tool_input.dangerouslyDisableSandbox // false' 2>/dev/null) || off=false
[ -n "$cmd" ] || exit 0

decide() {
  jq -cn --arg d "$1" --arg r "$2" \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:$d,permissionDecisionReason:$r}}'
  exit 0
}

# 1. credential stores (~/.ssh/config, known_hosts and ~/.aws/config are not matched on purpose)
if printf '%s' "$cmd" | grep -Eq '(~|\$HOME|/Users/[^/ ]+)/\.(aws/(credentials|sso|cli)|gnupg|ssh/(id_[^ ]*|[^ ]*\.pem)|docker/config\.json|netrc|git-credentials)|Library/Keychains|security +(find|dump)-(generic|internet)-password|\bssh-add\b|ssh-keygen +-y'; then
  decide deny "Credential store path or key operation. These are denied on purpose; ask Brandon for the non-secret part (profile name, host alias) or ask him to run the command himself."
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
if printf '%s' "$cmd" | grep -Eq "$outward"; then
  decide ask "Outward or destructive action. Name the approved plan step it belongs to before Brandon confirms."
fi

# 4. risky pushes ask; a push to a feature branch falls through. Covers every
#    spelling (git push, git -C <dir> push, cd <dir> && git push). Risky means:
#    the remote's default branch or main/master, force, delete, tags, --all or
#    --mirror, a bare push while on the default branch, or a push the hook can't read.
if printf '%s' "$cmd" | grep -Eq '\bgit( +-[Cc] +[^ ]+)* +push\b'; then
  risky() { decide ask "Risky push: $1. Brandon approves pushes to the default branch, force pushes, deletes and tag pushes himself; quote where he said to."; }
  printf '%s' "$rest" | grep -Eq "$compound" && risky "push inside a compound command"
  dir=$(printf '%s' "$input" | jq -r '.cwd // ""' 2>/dev/null)
  resolve() { local d=${1//[\"\']/}; d=${d/#\~/$HOME}; case $d in /*) printf '%s' "$d" ;; *) printf '%s/%s' "$dir" "$d" ;; esac; }
  lead=$(printf '%s' "$cmd" | head -1 | sed -nE 's/^[[:space:]]*cd[[:space:]]+([^;&|]*[^;&|[:space:]])[[:space:]]*&&.*/\1/p')
  [ -n "$lead" ] && dir=$(resolve "$lead")
  set -f; words=($rest); set +f
  in_push=false skip=false remote="" refs=()
  for ((i = 0; i < ${#words[@]}; i++)); do
    w=${words[i]}
    if ! $in_push; then
      case $w in
        -C) dir=$(resolve "${words[i+1]-}"); i=$((i + 1)) ;;
        -c) i=$((i + 1)) ;;
        push) in_push=true ;;
      esac
      continue
    fi
    if $skip; then skip=false; continue; fi
    case $w in
      --force*|--delete|--mirror|--all|--tags|--prune) risky "$w" ;;
      -o|--push-option|--repo|--receive-pack|--exec) skip=true ;;
      --*) ;;
      -*) [[ $w =~ [fd] ]] && risky "$w" ;;
      *) if [ -z "$remote" ]; then remote=$w; else refs+=("$w"); fi ;;
    esac
  done
  g() { git -C "$dir" "$@" 2>/dev/null; }
  def=$(g symbolic-ref --short refs/remotes/origin/HEAD); def=${def#origin/}
  is_main() { case $1 in main|master) return 0 ;; esac; [ -n "$def" ] && [ "$1" = "$def" ]; }
  cur=$(g symbolic-ref --short HEAD)
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
