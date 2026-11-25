#!/usr/bin/env bash
# Feeds synthetic Bash tool calls to the guard hook and checks each decision.
# Builds a throwaway remote and clone under $TMPDIR; touches nothing else.
#   tests/guard-bash.test.sh
set -u
hook="$(cd "$(dirname "$0")/.." && pwd)/home/.claude/hooks/guard-bash.sh"
tmp=$(mktemp -d "${TMPDIR:-/tmp}/guard-test.XXXX")
trap 'rm -rf "$tmp"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1

git init -q --bare -b main "$tmp/remote.git"
git clone -q "$tmp/remote.git" "$tmp/repo" 2>/dev/null
git -C "$tmp/repo" -c user.name=t -c user.email=t@example.com commit -q --allow-empty -m init
git -C "$tmp/repo" push -q origin main
git -C "$tmp/repo" remote set-head origin main
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

check none fix/x "git push origin fix/x"
check none fix/x "git push -u origin HEAD"
check none fix/x "git push"
check none fix/x "git -C $repo push -u origin fix/x"
check none fix/x "git log --grep push"
check ask  fix/x "git push origin main"
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
check ask  fix/x "git push origin v1.0"
check ask  fix/x "git add . && git push"
check ask  main  "git push"
check ask  main  "git push -u origin HEAD"
check ask  main  "cd $repo && git push"
check deny fix/x "cat ~/.aws/credentials"

exit $fail
