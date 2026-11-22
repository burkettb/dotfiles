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
backup="$HOME/.dotfiles-backup/$(date +%Y%m%d-%H%M%S)"
problems=0
backed_up=false

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
        mkdir -p "$backup/$(dirname "$rel")"
        mv "$dest" "$backup/$rel"
        backed_up=true
        say "backed up ~/$rel"
    fi
    ln -s "$src" "$dest"
    say "linked ~/$rel"
}

# The git email moves out of ~/.gitconfig, so read it before that file is replaced.
old_email=$(git config --file "$HOME/.gitconfig" user.email 2>/dev/null || true)

# 1. Link everything under home/
for d in "${dir_links[@]}"; do
    link "$d"
done
while IFS= read -r f; do
    f=${f#./}
    inside_dir_link "$f" || link "$f"
done <<< "$(cd "$repo/home" && find . \( -type f -o -type l \) | sort)"

# 2. Remove links into home/ whose file was renamed or deleted in the repo
for dir in "$HOME" "$HOME/.config" "$HOME/.claude" "$HOME/.claude/hooks" \
    "$HOME/.claude/skills" "$HOME/.codex" "$HOME/.codex/skills" "$HOME/.local/bin"; do
    [[ -d $dir ]] || continue
    for l in "$dir"/.[!.]* "$dir"/*; do
        [[ -L $l && ! -e $l && $(readlink "$l") == "$repo/home/"* ]] || continue
        if $check; then
            flag "stale link: $l"
        else
            rm "$l"
            say "removed stale link $l"
        fi
    done
done

# 3. Per-machine files git never tracks
if [[ ! -f $HOME/.gitconfig.local ]]; then
    if $check; then
        flag "missing: ~/.gitconfig.local (your git email for this machine)"
    else
        email=$old_email
        [[ -n $email ]] || read -rp "Git email for this machine: " email || true
        if [[ -n $email ]]; then
            printf '[user]\n\temail = %s\n' "$email" > "$HOME/.gitconfig.local"
            say "wrote ~/.gitconfig.local ($email)"
        else
            say "skipped ~/.gitconfig.local: no email. Git will refuse to commit until it exists."
        fi
    fi
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
if $backed_up; then
    say "Files that differed from the repo were moved to $backup"
fi
