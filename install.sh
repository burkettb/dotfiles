#!/usr/bin/env bash
# Links this repo into $HOME. Safe to run any number of times.
#
#   ./install.sh          link everything and create the per-machine files
#   ./install.sh --check  list anything not linked yet; changes nothing
#
# Editing a linked file needs nothing: ~/.zshrc *is* home/.zshrc. Rerun this
# only after adding, renaming, or deleting a file under home/.
set -euo pipefail

repo=$(cd "$(dirname "$0")" && pwd)
check=false
[[ ${1:-} == --check ]] && check=true
backup=""                               # created on first use, unique per run
manifest="$HOME/.local/state/dotfiles/links"
problems=0

say() { printf '%s\n' "$*"; }
flag() { say "$*"; problems=$((problems + 1)); }

# Folders the repo owns completely get one link for the whole folder, so new
# files inside show up without rerunning this, and apps that save by replacing
# a file can't swap the link for a plain copy.
dir_links=(.config/nvim .config/mise .config/atuin .config/linearmouse)
for d in "$repo"/home/.claude/skills/*/; do
    d=${d%/}
    dir_links+=(".claude/skills/${d##*/}")
done

inside_dir_link() {
    local d
    for d in "${dir_links[@]}"; do
        [[ $1 == "$d"/* ]] && return 0
    done
    return 1
}

link() {
    local rel=$1 src="$repo/home/$1" dest="$HOME/$1"
    [[ -L $dest && $(readlink "$dest") == "$src" ]] && return 0
    if $check; then
        flag "not linked: ~/$rel"
        return 0
    fi
    mkdir -p "$(dirname "$dest")"
    if [[ -L $dest ]]; then
        rm "$dest"                      # a link to somewhere else, nothing to lose
    elif [[ -f $dest ]] && cmp -s "$dest" "$src"; then
        rm "$dest"                      # an identical copy
    elif [[ -d $dest ]] && diff -rq "$dest" "$src" >/dev/null 2>&1; then
        rm -r "$dest"                   # an identical folder
    elif [[ -e $dest ]]; then
        if [[ -z $backup ]]; then
            mkdir -p "$HOME/.dotfiles-backup"
            backup=$(mktemp -d "$HOME/.dotfiles-backup/$(date +%Y%m%d-%H%M%S)-XXXX")
        fi
        mkdir -p "$backup/$(dirname "$rel")"
        mv "$dest" "$backup/$rel"
        say "backed up ~/$rel"
    fi
    ln -s "$src" "$dest"
    say "linked ~/$rel"
}

# 1. Git email. It moves from ~/.gitconfig to the untracked ~/.gitconfig.local,
#    so save it there (keeping anything already in that file) before step 2
#    replaces ~/.gitconfig.
local_cfg="$HOME/.gitconfig.local"
if ! git config --file "$local_cfg" user.email >/dev/null 2>&1; then
    if $check; then
        flag "missing: user.email in ~/.gitconfig.local"
    else
        email=$(git config --file "$HOME/.gitconfig" user.email 2>/dev/null || true)
        [[ -n $email ]] || read -rp "Git email for this machine: " email || true
        if [[ -n $email ]]; then
            git config --file "$local_cfg" user.email "$email"
            say "saved git email to ~/.gitconfig.local ($email)"
        else
            say "no git email set: git will refuse to commit until ~/.gitconfig.local has one"
        fi
    fi
fi

# 2. Link everything under home/ that git tracks or would track (skips ignored
#    junk like .DS_Store)
for d in "${dir_links[@]}"; do
    link "$d"
done
linked=$(cd "$repo" && git ls-files --cached --others --exclude-standard home | sed 's|^home/||' | sort -u)
while IFS= read -r f; do
    [[ -n $f ]] || continue
    inside_dir_link "$f" || link "$f"
done <<< "$linked"

# 3. Remove links from the last run whose file was renamed or deleted in the repo
if [[ -f $manifest ]]; then
    while IFS= read -r rel; do
        l="$HOME/$rel"
        [[ -L $l && ! -e $l && $(readlink "$l") == "$repo/home/"* ]] || continue
        if $check; then
            flag "stale link: ~/$rel"
        else
            rm "$l"
            say "removed stale link ~/$rel"
        fi
    done < "$manifest"
fi
if ! $check; then
    mkdir -p "$(dirname "$manifest")"
    printf '%s\n' "${dir_links[@]}" "$linked" > "$manifest"
fi

if [[ ! -f $HOME/.codex/config.toml ]]; then
    if $check; then
        flag "missing: ~/.codex/config.toml"
    else
        mkdir -p "$HOME/.codex"
        sed "s|__HOME__|$HOME|g" "$repo/seeds/codex-config.toml" > "$HOME/.codex/config.toml"
        chmod 600 "$HOME/.codex/config.toml"
        say "seeded ~/.codex/config.toml"
    fi
fi

if $check; then
    [[ $problems -eq 0 ]] && say "everything is linked"
    exit $((problems > 0 ? 1 : 0))
fi
if [[ -n $backup ]]; then
    say "Files that differed from the repo were moved to $backup"
fi
