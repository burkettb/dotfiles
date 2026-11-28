#!/usr/bin/env bash
# Runs dotsync and dotfiles-status against a fake $HOME whose ~/.dotfiles
# clones a throwaway copy of this repo. Touches nothing outside $TMPDIR.
#   tests/dotsync.test.sh
set -u
bin="$(cd "$(dirname "$0")/.." && pwd)/home/.local/bin"
src="$(cd "$(dirname "$0")/.." && pwd)"
tmp=$(mktemp -d "${TMPDIR:-/tmp}/sync-test.XXXX")
trap 'rm -rf "$tmp"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export HOME="$tmp/home"
mkdir -p "$HOME"

git init -q --bare -b main "$tmp/remote.git"
git -C "$tmp/remote.git" fetch -q "$src" HEAD:refs/heads/main   # test this checkout, not local main
git clone -q -b main "$tmp/remote.git" "$HOME/.dotfiles"
"$HOME/.dotfiles/install.sh" >/dev/null
git clone -q -b main "$tmp/remote.git" "$tmp/other"     # the other Mac, pushing changes
commit() { # commit <clone> <file> [content]
    printf '%s\n' "${3:-x}" > "$1/$2"
    git -C "$1" add "$2"
    git -C "$1" -c user.name=t -c user.email=t@example.com commit -q -m "change $2"
}
push_from_other() { commit "$tmp/other" "$@" && git -C "$tmp/other" push -q origin main; }

fail=0
expect() { # expect <description> <want substring, or "" for empty> <got>
    if [[ -z $2 && -z $3 ]] || [[ -n $2 && $3 == *"$2"* ]]; then
        echo "ok    $1"
    else
        echo "FAIL  $1: want '${2:-<empty>}', got '$3'"
        fail=1
    fi
}
sync() { "$bin/dotsync" "$@" 2>&1; }
status() { "$bin/dotfiles-status" "$@" 2>&1; }

expect "up to date" "up to date" "$(sync)"
expect "tmux segment empty when clean" "" "$(status --tmux)"

push_from_other home/.sync-test-a
git -C "$HOME/.dotfiles" fetch -q
expect "tmux shows commits to pull" "↓1" "$(status --tmux)"
out=$(sync)
expect "fast-forwards" "change home/.sync-test-a" "$out"
expect "links the new file" "linked ~/.sync-test-a" "$out"
[[ -L $HOME/.sync-test-a ]] && echo "ok    new file is a link" || { echo "FAIL  ~/.sync-test-a not linked"; fail=1; }
expect "tmux empty after sync" "" "$(status --tmux)"

push_from_other home/.sync-test-a y
printf 'local edit\n' > "$HOME/.dotfiles/home/.sync-test-a"
out=$(sync)
expect "skips with uncommitted edits" "uncommitted edits" "$out"
expect "names the file that blocks it" "1 uncommitted: .sync-test-a" "$out"
expect "tmux shows dirty and behind" "●1 ↓1" "$(status --tmux)"
git -C "$HOME/.dotfiles" checkout -q -- home/.sync-test-a

printf 'junk\n' > "$HOME/.dotfiles/home/.untracked-junk"
expect "untracked files don't block" "change home/.sync-test-a" "$(sync)"
rm "$HOME/.dotfiles/home/.untracked-junk"

push_from_other home/.sync-test-b
git -C "$HOME/.dotfiles" checkout -q -b experiment
expect "skips off main" "on experiment" "$(sync)"
git -C "$HOME/.dotfiles" checkout -q main

commit "$HOME/.dotfiles" home/.sync-test-local
expect "skips when main diverged" "local commits on main" "$(sync)"
expect "tmux shows both directions" "↓1 ↑1" "$(status --tmux)"
git -C "$HOME/.dotfiles" reset -q --hard origin/main~1

expect "quiet prints nothing" "" "$(sync --quiet)"
expect "quiet logs the update" "change home/.sync-test-b" "$(cat "$HOME/.local/state/dotfiles/sync.log")"
before=$(wc -l < "$HOME/.local/state/dotfiles/sync.log")
sync --quiet >/dev/null
expect "quiet no-op logs nothing" "$before" "$(wc -l < "$HOME/.local/state/dotfiles/sync.log")"

exit $fail
