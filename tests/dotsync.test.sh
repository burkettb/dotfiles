#!/usr/bin/env bash
# Runs dotsync and dotfiles-status against a fake $HOME whose ~/.dotfiles
# clones a throwaway repo seeded from this working tree, uncommitted edits
# included. launchctl is a stub, so nothing reaches the real launchd. Touches
# nothing outside $TMPDIR.
#   tests/dotsync.test.sh
set -u
src="$(cd "$(dirname "$0")/.." && pwd)"
bin="$src/home/.local/bin"
tmp=$(mktemp -d "${TMPDIR:-/tmp}/sync-test.XXXX")
trap 'chmod -R u+w "$tmp" 2>/dev/null; rm -rf "$tmp"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export HOME="$tmp/home"
mkdir -p "$HOME" "$tmp/stub"
gitc() { git -c user.name=t -c user.email=t@example.com -c commit.gpgsign=false "$@"; }

# launchctl stub: records each call, fails bootout like an unloaded job would
cat > "$tmp/stub/launchctl" <<EOF
#!/bin/sh
echo "\$*" >> "$tmp/launchctl.calls"
[ "\$1" = bootout ] && exit 3
exit 0
EOF
chmod +x "$tmp/stub/launchctl"
export PATH="$tmp/stub:$PATH"

# The "GitHub" remote's main is this working tree, so the fixture's installer
# is the one on this branch, not main's
mkdir "$tmp/seed"
(cd "$src" && git ls-files -z --cached --others --exclude-standard |
    while IFS= read -r -d '' f; do [[ -e $f || -L $f ]] && printf '%s\0' "$f"; done |
    tar -cf - --null -T -) | tar -xf - -C "$tmp/seed"
git -C "$tmp/seed" init -q -b main
git -C "$tmp/seed" add -A
gitc -C "$tmp/seed" commit -q -m seed
git clone -q --bare "$tmp/seed" "$tmp/remote.git"
git clone -q -b main "$tmp/remote.git" "$HOME/.dotfiles"
"$HOME/.dotfiles/install.sh" >/dev/null
git clone -q -b main "$tmp/remote.git" "$tmp/other"     # where PRs get merged
commit() { # commit <clone> <file> [content]
    mkdir -p "$(dirname "$1/$2")"
    printf '%s\n' "${3:-x}" > "$1/$2"
    git -C "$1" add "$2"
    gitc -C "$1" commit -q -m "change $2"
}
merge_on_github() { commit "$tmp/other" "$@" && git -C "$tmp/other" push -q origin main; }

fail=0
expect() { # expect <description> <want substring, or "" for empty> <got>
    if [[ -z $2 && -z $3 ]] || [[ -n $2 && $3 == *"$2"* ]]; then
        echo "ok    $1"
    else
        echo "FAIL  $1: want '${2:-<empty>}', got '$3'"
        fail=1
    fi
}
check() { # check <description> <command...>
    if "${@:2}"; then echo "ok    $1"; else echo "FAIL  $1"; fail=1; fi
}
sync() { "$bin/dotsync" "$@" 2>&1; }
status() { "$bin/dotfiles-status" "$@" 2>&1; }
head_() { git -C "$HOME/.dotfiles" rev-parse HEAD; }
state="$HOME/.local/state/dotfiles"
log="$state/sync.log"

# LaunchAgent
expect "status asks for the agent" "dotsync --install-agent" "$(status)"
out=$(sync --install-agent)
plist="$HOME/Library/LaunchAgents/com.burkettb.dotsync.plist"
expect "install-agent loads it" "loaded $plist" "$out"
check "plist is a real file" test -f "$plist" -a ! -L "$plist"
check "plist is valid" plutil -lint -s "$plist"
check "plist runs dotsync --quiet by absolute path" \
    grep -q "<string>$HOME/.local/bin/dotsync</string>" "$plist"
check "plist every 15 minutes, at load" grep -q '<integer>900</integer>' "$plist"
check "plist sets PATH" grep -q '<key>PATH</key>' "$plist"
uid=$(id -u)
expect "bootout then bootstrap" "bootout gui/$uid/com.burkettb.dotsync
bootstrap gui/$uid $plist" "$(cat "$tmp/launchctl.calls")"
cp "$plist" "$tmp/plist.1"
sync --install-agent >/dev/null
check "install-agent is idempotent" cmp -s "$plist" "$tmp/plist.1"
sync --uninstall-agent >/dev/null
check "uninstall-agent removes it" test ! -e "$plist"
expect "uninstall-agent boots it out" "bootout gui/$uid/com.burkettb.dotsync" "$(tail -1 "$tmp/launchctl.calls")"
check "uninstall-agent twice is fine" "$bin/dotsync" --uninstall-agent >/dev/null
sync --install-agent >/dev/null

# Default run: fetch only
expect "up to date" "up to date" "$(sync)"
expect "status empty when clean" "" "$(status)"
expect "tmux segment empty when clean" "" "$(status --tmux)"
check "records last attempt" test -s "$state/last-attempt"
check "records last success" test -s "$state/last-success"

merge_on_github home/.sync-test-a
before=$(head_)
out=$(sync)
expect "lists what's waiting" "change home/.sync-test-a" "$out"
expect "says how to review and apply" \
    "~/.dotfiles is 1 commit behind main: review with git -C ~/.dotfiles log -p HEAD..origin/main, then dotsync --apply" "$out"
expect "default run never moves HEAD" "$before" "$(head_)"
check "default run links nothing" test ! -e "$HOME/.sync-test-a"
expect "tmux shows commits behind" "↓1" "$(status --tmux)"

merge_on_github home/.sync-test-b
expect "quiet prints nothing" "" "$(sync --quiet)"
expect "quiet never moves HEAD" "$before" "$(head_)"
expect "quiet logs new commits" "change home/.sync-test-b" "$(cat "$log")"
lines=$(wc -l < "$log")
sync --quiet >/dev/null
expect "quiet no-op logs nothing" "$lines" "$(wc -l < "$log")"
expect "plural" "2 commits behind main" "$(status)"

# --apply
reviewed=$(git -C "$HOME/.dotfiles" rev-parse origin/main~1)
out=$(sync --apply "$reviewed")
expect "apply stops at the reviewed commit" "$reviewed" "$(head_)"
expect "apply relinks" "linked ~/.sync-test-a" "$out"
check "new file is a link" test -L "$HOME/.sync-test-a"
merge_on_github home/.sync-test-c
out=$(sync --apply)
expect "apply doesn't fetch" "change home/.sync-test-b" "$out"
expect "apply lands on last fetched main" "$(git -C "$HOME/.dotfiles" rev-parse origin/main)" "$(head_)"
check "apply didn't pick up the unfetched commit" test ! -e "$HOME/.dotfiles/home/.sync-test-c"
expect "apply logs" "applied" "$(cat "$log")"
expect "apply with nothing new" "nothing to apply" "$(sync --apply)"
sync >/dev/null

# Blocked cases
printf 'local edit\n' > "$HOME/.dotfiles/home/.sync-test-a"
before=$(head_)
out=$(sync --apply); rc=$?
expect "blocked by uncommitted edits" "uncommitted edits" "$out"
expect "names the file that blocks it" "1 uncommitted: .sync-test-a" "$out"
expect "blocked apply exits 1" 1 "$rc"
expect "blocked apply doesn't move HEAD" "$before" "$(head_)"
expect "blocked apply is logged" "apply blocked: uncommitted edits" "$(cat "$log")"
expect "tmux shows dirty and behind" "●1 ↓1" "$(status --tmux)"
git -C "$HOME/.dotfiles" checkout -q -- home/.sync-test-a

printf 'junk\n' > "$HOME/.dotfiles/home/.untracked-junk"
expect "untracked files don't block" "change home/.sync-test-c" "$(sync --apply)"
rm "$HOME/.dotfiles/home/.untracked-junk"

merge_on_github home/.sync-test-d
sync --quiet
git -C "$HOME/.dotfiles" checkout -q -b experiment
expect "blocked off main" "on experiment" "$(sync --apply)"
git -C "$HOME/.dotfiles" checkout -q main

commit "$HOME/.dotfiles" home/.sync-test-local
expect "blocked when main diverged" "local commits on main" "$(sync --apply)"
expect "tmux shows both directions" "↓1 ↑1" "$(status --tmux)"
expect "rejects a commit not on main" "not on origin/main" "$(sync --apply HEAD)"
git -C "$HOME/.dotfiles" reset -q --hard HEAD~1
sync --apply >/dev/null

# A relink that fails exits nonzero, and the next run retries it
mkdir "$HOME/.ro"
chmod 555 "$HOME/.ro"
merge_on_github home/.ro/file
sync --quiet
out=$(sync --apply); rc=$?
expect "failed relink exits nonzero" 1 "$rc"
expect "failed relink says so" "relinking failed" "$out"
expect "failed relink is logged" "relink failed" "$(cat "$log")"
expect "status flags the missing link" "not linked: ~/.ro/file" "$(status)"
chmod 755 "$HOME/.ro"
out=$(sync --apply); rc=$?
expect "next apply retries the relink" "linked ~/.ro/file" "$out"
expect "and exits 0" 0 "$rc"
check "link is in place" test -L "$HOME/.ro/file"

# Lock
mkdir "$state/lock"
echo $$ > "$state/lock/pid"
out=$(sync); rc=$?
expect "second run waits its turn" "another dotsync is running" "$out"
expect "and exits 1" 1 "$rc"
check "doesn't remove someone else's lock" test -d "$state/lock"
expect "quiet run skips silently" "" "$(sync --quiet)"
sleep 0 & wait $!
echo $! > "$state/lock/pid"                # a process that's gone
expect "takes over a stale lock" "up to date" "$(sync)"
check "releases the lock" test ! -e "$state/lock"

# Fetch failures
git -C "$HOME/.dotfiles" remote set-url origin "$tmp/missing.git"
out=$(sync); rc=$?
expect "fetch failure says so" "fetch failed" "$out"
expect "fetch failure exits 1" 1 "$rc"
expect "fetch failure is logged" "fetch failed" "$(cat "$log")"
touch -t 202001010000 "$state/last-success"
expect "status flags stale fetches" "no successful fetch since" "$(status)"
expect "tmux flags stale fetches" "fetch?" "$(status --tmux)"

exit $fail
