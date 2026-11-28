#!/usr/bin/env bash
# Feeds synthetic Bash tool calls to the guard hook and checks each decision.
# Builds throwaway remotes and a clone under $TMPDIR; touches nothing else.
#   tests/guard-bash.test.sh
set -u
hook="$(cd "$(dirname "$0")/.." && pwd)/home/.claude/hooks/guard-bash.sh"
tmp=$(mktemp -d "${TMPDIR:-/tmp}/guard-test.XXXX")
trap 'rm -rf "$tmp"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1

git init -q --bare -b main "$tmp/remote.git"
git init -q --bare -b trunk "$tmp/upstream.git"
git clone -q "$tmp/remote.git" "$tmp/repo" 2>/dev/null
git -C "$tmp/repo" -c user.name=t -c user.email=t@example.com commit -q --allow-empty -m init
git -C "$tmp/repo" push -q origin main
git -C "$tmp/repo" remote set-head origin main
git -C "$tmp/repo" remote add upstream "$tmp/upstream.git"
git -C "$tmp/repo" push -q upstream main:trunk
git -C "$tmp/repo" fetch -q upstream
git -C "$tmp/repo" remote set-head upstream trunk
git -C "$tmp/repo" tag v1.0
repo="$tmp/repo"

fail=0
check() { # check <expect: ask|deny|none> <branch> <command>
  git -C "$repo" checkout -q -B "$2"
  out=$(jq -cn --arg c "$3" --arg d "$repo" '{tool_input:{command:$c},cwd:$d}' | "$hook")
  got=$(printf '%s' "$out" | jq -r '.hookSpecificOutput.permissionDecision // empty' 2>/dev/null)
  got=${got:-none}
  if [ "$got" = "$1" ]; then echo "ok    $1  [$2] $3"; else echo "FAIL  want $1 got $got  [$2] $3"; fail=1; fi
}

# pushes
check none fix/x "git push origin fix/x"
check none fix/x "git push -u origin HEAD"
check none fix/x "git push"
check none fix/x "git -C $repo push -u origin fix/x"
check none fix/x "git log --grep push"
check none fix/x "git push upstream fix/x"
check ask  fix/x "git push origin main"
check ask  fix/x "git push origin \"main\""
check ask  fix/x "git push origin 'main'"
check ask  fix/x "git push origin \"HEAD:main\""
check ask  fix/x "git push origin HEAD:main"
check ask  fix/x "git push origin refs/heads/master"
check ask  fix/x "git -C $repo push origin main"
check ask  fix/x "git -C $repo push --force origin fix/x"
check ask  fix/x "git push --force-with-lease origin fix/x"
check ask  fix/x "git push -uf origin fix/x"
check ask  fix/x "git push origin +fix/x"
check ask  fix/x "git push origin :fix/x"
check ask  fix/x "git push origin --delete fix/x"
check ask  fix/x "git push --tags"
check ask  fix/x "git push --follow-tags origin fix/x"
check ask  fix/x "git -c push.followTags=true push origin fix/x"
check ask  fix/x "git push origin v1.0"
check ask  fix/x "git push upstream trunk"
check ask  fix/x "git push upstream HEAD:trunk"
check ask  fix/x "git add . && git push"
check ask  main  "git push"
check ask  main  "git push -u origin HEAD"
check ask  main  "cd $repo && git push"

# credential paths
check deny fix/x 'cat ~/.aws/credentials'
check deny fix/x 'cat "$HOME"/.aws/credentials'
check deny fix/x 'cat ${HOME}/.aws/credentials'
check deny fix/x 'cat "${HOME}/.aws/credentials"'
check deny fix/x 'cat ~/".aws"/credentials'
check deny fix/x 'cd ~/.aws && cat credentials'
check deny fix/x 'cat ~/.aws/cred*'
check deny fix/x 'cat ~/.a?s/credentials'
check deny fix/x 'cat ~/.*/credentials'
check deny fix/x 'cat ~/dev/../.aws/credentials'
check deny fix/x 'cd ~ && cat .aws/credentials'
check deny fix/x 'cd && cat .aws/credentials'
check deny fix/x 'cd ~/.codex && cat auth.json'
check deny fix/x 'tar -C ~ -cf - .gnupg'
check deny fix/x 'docker run -v ~/.aws:/a alpine cat /a/credentials'
check deny fix/x 'cat /Users/someone/.ssh/id_ed25519'
check deny fix/x 'cat ~/.ssh/*'
check deny fix/x 'cat ~/.codex/auth.json'
check deny fix/x 'cat ~/.config/gh/hosts.yml'
check deny fix/x 'ls ~/.t3/userdata/secrets'
check deny fix/x 'sqlite3 ~/.local/share/atuin/history.db .dump'
check deny fix/x 'cat ~/.netrc ~/.npmrc'
# key and token operations
check deny fix/x 'ssh-add -l'
check deny fix/x 'ssh-add'
check deny fix/x 'ssh-keygen -y -f key'
check deny fix/x 'ssh-keygen -f key -y'
check deny fix/x 'security find-generic-password -s x -w'
check deny fix/x 'security dump-keychain'
check deny fix/x 'bash -c "ssh-add -L"'
check deny fix/x 'true && /usr/bin/ssh-add -L'
check deny fix/x 'aws configure export-credentials'
check deny fix/x 'aws configure get aws_secret_access_key'
check deny fix/x 'gh auth token'
check deny fix/x 'gh auth status --show-token'
# readable on purpose, and prose that names a key tool
check none fix/x 'cat ~/.ssh/config'
check none fix/x 'cat ~/.ssh/known_hosts'
check none fix/x 'cat ~/.aws/config'
check none fix/x 'ls ~/dev/*'
check none fix/x 'rg -n "ssh-add" README.md'
check none fix/x 'git commit -m "docs: explain ssh-add"'
check none fix/x 'git commit -m "docs: never run ssh-keygen -y; use the agent"'
check none fix/x 'ssh-keygen -Y sign -n git -f key.pub msg'
check none fix/x 'aws configure get region'
check none fix/x 'gh auth status'

# GitHub writes that skip the PR flow
check ask  fix/x 'gh pr merge 12 --squash'
check ask  fix/x 'gh api -X PUT repos/o/r/pulls/1/merge'
check ask  fix/x 'gh api --method=POST repos/o/r/git/refs -f ref=refs/heads/x -f sha=abc'
check ask  fix/x 'gh api -X patch repos/o/r/git/refs/heads/main -f sha=abc -F force=true'
check ask  fix/x 'gh api repos/o/r/merges -f base=main -f head=fix/x'
check ask  fix/x 'gh api -X DELETE repos/o/r/branches/main/protection'
check ask  fix/x 'gh api -X PUT repos/o/r/rulesets/1 --input rules.json'
check ask  fix/x "gh api graphql -f query='mutation { mergePullRequest(input: {pullRequestId: \"x\"}) { clientMutationId } }'"
check ask  fix/x 'gh repo delete o/r --yes'
check ask  fix/x 'gh repo edit --default-branch x'
check ask  fix/x 'gh repo rename r2'
check ask  fix/x 'gh repo archive o/r'
check ask  fix/x 'gh secret set FOO'
check ask  fix/x 'gh release create v1.0'
check ask  fix/x 'gh release delete v1.0'
check none fix/x 'gh api repos/o/r/pulls'
check none fix/x 'gh api -X GET search/issues -f q=repo:o/r'
check none fix/x "gh api graphql -f query='query { viewer { login } }'"
check none fix/x 'gh pr view 12'
check none fix/x 'gh pr create --fill'

# no jq, or input it can't parse: ask instead of silently allowing
mkdir "$tmp/nojq"
sed '/^export PATH=/d' "$hook" > "$tmp/nojq/hook"
got=$(printf '%s' '{"tool_input":{"command":"git push origin main"}}' | PATH="$tmp/nojq" /bin/bash "$tmp/nojq/hook" | jq -r '.hookSpecificOutput.permissionDecision')
if [ "$got" = ask ]; then echo "ok    ask  no jq on PATH"; else echo "FAIL  want ask got ${got:-none}  no jq on PATH"; fail=1; fi
got=$(printf 'not json' | "$hook" | jq -r '.hookSpecificOutput.permissionDecision')
if [ "$got" = ask ]; then echo "ok    ask  unparseable input"; else echo "FAIL  want ask got ${got:-none}  unparseable input"; fail=1; fi

exit $fail
