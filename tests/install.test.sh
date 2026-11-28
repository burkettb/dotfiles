#!/usr/bin/env bash
# Runs install.sh against a fake $HOME whose ~/.dotfiles is a small fixture repo
# holding this checkout's install.sh. Touches nothing outside $TMPDIR. Runs
# install.sh with the same bash as this script, so `/bin/bash tests/install.test.sh`
# covers Apple's Bash 3.2.
#   tests/install.test.sh
set -u
src="$(cd "$(dirname "$0")/.." && pwd)"
sh=${BASH:-bash}
tmpdir=${TMPDIR:-/tmp}
tmp=$(mktemp -d "${tmpdir%/}/install-test.XXXX")   # a trailing / would break the ~/.dotfiles check
trap 'rm -rf "$tmp"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export HOME="$tmp/ho&me"                 # & would break an unescaped sed substitution
repo="$HOME/.dotfiles"
mkdir -p "$repo/seeds"
cp "$src/install.sh" "$repo/"
cp "$src/seeds/codex-config.toml" "$repo/seeds/"
put() { mkdir -p "$(dirname "$repo/$1")" && printf '%s\n' "${2:-$1}" > "$repo/$1"; }
put home/.zshrc
put home/.config/nvim/init.lua
put home/.claude/skills/demo/SKILL.md
put home/zzz-last                       # sorts last in git ls-files
put hosts/argo/.config/agent/machine.md
git -C "$repo" init -q
git -C "$repo" add -A
commit() { git -C "$repo" -c user.name=t -c user.email=t@example.com commit -q -m "${1:-x}"; }
commit

fail=0
ok() { echo "ok    $1"; }
no() { echo "FAIL  $1"; fail=1; }
expect() { # expect <description> <want substring> <got>
    if [[ $3 == *"$2"* ]]; then ok "$1"; else no "$1: want '$2', got '$3'"; fi
}
linked_to() { # linked_to <~-relative path> <repo-relative source>
    [[ -L $HOME/$1 && $(readlink "$HOME/$1") == "$repo/$2" ]]
}
check_link() { if linked_to "$2" "$3"; then ok "$1"; else no "$1: ~/$2 -> $(readlink "$HOME/$2" 2>/dev/null || echo none)"; fi; }
check_none() { if [[ -e $HOME/$2 || -L $HOME/$2 ]]; then no "$1: ~/$2 exists"; else ok "$1"; fi; }
run() { out=$("$sh" "$repo/install.sh" "$@" 2>&1); rc=$?; }
links() { find "$HOME" -path "$repo" -prune -o -type l -print | sort; }

# Bad flags stop before anything happens
run --chek
expect "unknown flag exits 2" "2" "$rc"
expect "unknown flag prints usage" "usage:" "$out"
check_none "unknown flag changes nothing" .zshrc
run --host
expect "--host without a name exits 2" "2" "$rc"
run --host ../x
expect "bad host name exits 2" "2" "$rc"

# First run: a differing file is backed up, an identical one just replaced,
# scratch files and deleted files are left alone
printf 'mine\n' > "$HOME/.zshrc"
mkdir -p "$HOME/.config/nvim" && printf '%s\n' home/.config/nvim/init.lua > "$HOME/.config/nvim/init.lua"
put home/.scratch                       # untracked
rm "$repo/home/zzz-last"                # tracked, deleted, not committed
run
expect "install exits 0 when the last tracked file is missing" "0" "$rc"
check_link "links a tracked file" .zshrc home/.zshrc
check_link "links a whole folder" .config/nvim home/.config/nvim
check_link "links a skill for Claude" .claude/skills/demo home/.claude/skills/demo
check_link "links a skill for Codex" .agents/skills/demo home/.claude/skills/demo
check_none "skips an untracked file" .scratch
check_none "skips a deleted file" zzz-last
check_none "no host file links home/ only" .config/agent/machine.md
expect "no host file prints a hint" "info: no host file" "$out"
expect "reports the backup" "backed up ~/.zshrc" "$out"
saved=$(cat "$HOME"/.dotfiles-backup/*/.zshrc 2>/dev/null)
expect "backup holds the old content" "mine" "$saved"
[[ -z $(ls -d "$HOME"/.dotfiles-backup/*/.config 2>/dev/null) ]] && ok "identical folder not backed up" || no "identical folder was backed up"
ls -a "$HOME/.config" | grep -q dotfiles- && no "temp files left behind" || ok "no temp files left behind"
git -C "$repo" checkout -q -- home/zzz-last
rm "$repo/home/.scratch"
run

# Codex seed: private from the start, $HOME substituted literally
cfg="$HOME/.codex/config.toml"
[[ $(stat -f '%Lp' "$cfg" 2>/dev/null || stat -c '%a' "$cfg") == 600 ]] && ok "Codex seed is mode 600" || no "Codex seed mode"
grep -qF "\"$HOME/.aws\" = \"deny\"" "$cfg" && ok "Codex seed has the literal home path" || no "Codex seed home path: $(grep aws "$cfg")"

# --check
run --check
expect "--check passes when linked" "everything is linked" "$out"
expect "--check exit 0" "0" "$rc"
expect "--check mentions a missing ~/.gitconfig.local as info" "info: no ~/.gitconfig.local" "$out"
rm "$HOME/.zshrc"
run --check
expect "--check fails on a missing link" "not linked: ~/.zshrc" "$out"
expect "--check exit 1" "1" "$rc"
check_none "--check changes nothing" .zshrc
expect "--check lists the problem before info" "not linked" "$(printf '%s\n' "$out" | head -1)"

# Host overlay
run --host argo
expect "--host exits 0" "0" "$rc"
expect "--host writes the host file" "argo" "$(cat "$HOME/.config/dotfiles/host")"
check_link "links the host file" .config/agent/machine.md hosts/argo/.config/agent/machine.md
check_link "relinks home/ too" .zshrc home/.zshrc
run
check_link "host file is used on later runs" .config/agent/machine.md hosts/argo/.config/agent/machine.md
run --check
expect "--check passes with a host" "everything is linked" "$out"

# Collisions refuse before any change
put hosts/argo/.zshrc
put hosts/argo/.config/nvim/extra.lua
git -C "$repo" add -A && commit clash
printf 'x\n' > "$HOME/.config/dotfiles/host"
before=$(links)
run --host argo
expect "collision exits 1" "1" "$rc"
expect "names a shadowed file" "hosts/argo/.zshrc clashes with ~/.zshrc" "$out"
expect "names a file inside a folder link" "hosts/argo/.config/nvim/extra.lua clashes with ~/.config/nvim" "$out"
expect "collision leaves the host file alone" "x" "$(cat "$HOME/.config/dotfiles/host")"
[[ $(links) == "$before" ]] && ok "collision changes no links" || no "collision changed links"
run --check --host argo
expect "--check refuses too" "clashes" "$out"
expect "--check --host doesn't write the host file" "x" "$(cat "$HOME/.config/dotfiles/host")"
git -C "$repo" rm -q hosts/argo/.zshrc hosts/argo/.config/nvim/extra.lua
commit unclash
printf 'argo\n' > "$HOME/.config/dotfiles/host"

# Stale links: removed only while they still point at the recorded source
put home/.gone
put home/.moved
git -C "$repo" add -A && commit add
run
check_link "links new files" .gone home/.gone
ln -sfn "$tmp" "$HOME/.moved"            # someone repointed it
git -C "$repo" rm -q home/.gone home/.moved && commit rm
printf 'other\n' > "$HOME/.config/dotfiles/host"     # argo's files stop being selected
run
check_none "removes a link to a deleted file" .gone
check_none "removes a link to a still-existing host file" .config/agent/machine.md
expect "says it removed them" "removed stale link ~/.config/agent/machine.md" "$out"
[[ $(readlink "$HOME/.moved") == "$tmp" ]] && ok "keeps a link someone repointed" || no "repointed link was touched"
expect "unknown host prints a hint" "info: host other has no files" "$out"

# Upgrades from the old install: dest-only manifest, ~/.codex/skills links
manifest="$HOME/.local/state/dotfiles/links"
ln -s "$repo/home/.old" "$HOME/.old"
printf '.old\n' >> "$manifest"
mkdir -p "$HOME/.codex/skills"
ln -s "$repo/home/.codex/skills/demo" "$HOME/.codex/skills/demo"
ln -s "$tmp" "$HOME/.codex/skills/mine"
run
check_none "old-format manifest entry is cleaned up" .old
check_none "old ~/.codex/skills link into the repo is removed" .codex/skills/demo
[[ -L $HOME/.codex/skills/mine ]] && ok "other ~/.codex/skills link is kept" || no "other ~/.codex/skills link removed"
expect "manifest stores destination and source" ".zshrc	$repo/home/.zshrc" "$(cat "$manifest")"
rm -rf "$HOME/.codex/skills"
ln -s "$HOME/.agents/skills" "$HOME/.codex/skills"     # aliased to the new folder
run
check_link "cleanup doesn't follow an aliased ~/.codex/skills" .agents/skills/demo home/.claude/skills/demo

# Case only: macOS file systems treat these as one file
put hosts/other/.ZSHRC
git -C "$repo" add -A && commit case
run
expect "a clash differing only in case is refused" "hosts/other/.ZSHRC clashes with ~/.zshrc" "$out"
check_link "and changes nothing" .zshrc home/.zshrc
git -C "$repo" rm -q hosts/other/.ZSHRC && commit uncase

# A folder link that becomes per-file host links: the old folder link must go
# first, or the new links would be created inside the repo
git -C "$repo" rm -q home/.config/nvim/init.lua
put hosts/other/.config/nvim/host.lua
git -C "$repo" add -A && commit split
run
expect "folder split exits 0" "0" "$rc"
check_link "host file lands in a real folder" .config/nvim/host.lua hosts/other/.config/nvim/host.lua
[[ ! -L $HOME/.config/nvim ]] && ok "old folder link is gone" || no "old folder link still there"
[[ ! -e $repo/home/.config/nvim/host.lua ]] && ok "nothing written into the repo" || no "link written into the repo"

# A run that fails halfway still saves the old ~/.gitconfig's signing key
rm "$HOME/.gitconfig.local" 2>/dev/null
printf '[user]\n\tsigningkey = ~/.ssh/k.pub\n' > "$HOME/.gitconfig"
put home/.gitconfig '[user]'
put home/zzz-dir/f
git -C "$repo" add -A && commit gitconfig
mkdir -p "$HOME/zzz-dir" && chmod 500 "$HOME/zzz-dir"
run
expect "a link that can't be made fails the run" "1" "$rc"
chmod 700 "$HOME/zzz-dir"
run
expect "the retry succeeds" "0" "$rc"
expect "signing key survives the failed run" "~/.ssh/k.pub" "$(git config --file "$HOME/.gitconfig.local" user.signingkey)"

# Only ~/.dotfiles may run it
mkdir -p "$tmp/clone" && cp "$repo/install.sh" "$tmp/clone/"
out=$("$sh" "$tmp/clone/install.sh" 2>&1); rc=$?
expect "refuses another checkout" "Run this from ~/.dotfiles" "$out"
expect "other checkout exits 1" "1" "$rc"

exit $fail
