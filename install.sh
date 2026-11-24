#!/usr/bin/env bash
# Links this repo into $HOME. Safe to run any number of times.
#
#   ./install.sh          link everything, seed the Codex config if missing
#   ./install.sh --check  list anything not linked yet; changes nothing
#
# Editing a linked file needs nothing: ~/.zshrc *is* home/.zshrc. Rerun this
# only after adding, renaming, or deleting a file under home/. New terminals
# say when that's needed (see home/.local/bin/dotfiles-status).
set -euo pipefail

repo=$(cd "$(dirname "$0")" && pwd)
# Links point at whichever checkout runs this, so a worktree or second clone
# would become the live config and dangle once deleted.
if [[ $repo != "$HOME/.dotfiles" ]]; then
    printf 'Run this from ~/.dotfiles, not %s\n' "$repo" >&2
    exit 1
fi
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

# The git email and signing key from a ~/.gitconfig this run is about to
# replace (a chezmoi copy holds whatever email `chezmoi init` asked for)
old_email="" old_key=""
if [[ -f $HOME/.gitconfig && ! -L $HOME/.gitconfig ]]; then
    old_email=$(git config --file "$HOME/.gitconfig" user.email 2>/dev/null || true)
    old_key=$(git config --file "$HOME/.gitconfig" user.signingkey 2>/dev/null || true)
fi

# 1. Link everything under home/ that git tracks or would track (skips ignored
#    junk like .DS_Store, and files deleted but not yet committed)
for d in "${dir_links[@]}"; do
    link "$d"
done
linked=$(cd "$repo" && git ls-files --cached --others --exclude-standard home | sed 's|^home/||' | sort -u |
    while IFS= read -r f; do [[ -e $repo/home/$f || -L $repo/home/$f ]] && printf '%s\n' "$f"; done)
while IFS= read -r f; do
    [[ -n $f ]] || continue
    inside_dir_link "$f" || link "$f"
done <<< "$linked"

# 2. Remove links from the last run whose file was renamed or deleted in the repo
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

# 3. Seed the Codex config, which Codex then owns
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

# 4. Work repos take their email from ~/.gitconfig-icfcorp; without it they'd
#    commit as the personal address. Carry over the email chezmoi had set.
work_cfg="$HOME/.gitconfig-icfcorp"
if [[ -d $HOME/dev-icfcorp && ! -f $work_cfg ]]; then
    if ! $check && [[ -n $old_email && $old_email != *users.noreply.github.com ]]; then
        printf '[user]\n\temail = %s\n' "$old_email" > "$work_cfg"
        say "saved work email $old_email to ~/.gitconfig-icfcorp"
    else
        flag "missing: ~/.gitconfig-icfcorp. Create it with: [user] email = <work email>"
    fi
fi

# 5. Commits are signed with this Mac's own key, named in ~/.gitconfig.local.
#    Carry over the one the old ~/.gitconfig had.
local_cfg="$HOME/.gitconfig.local"
if [[ -z $(git config --file "$local_cfg" user.signingkey 2>/dev/null) ]]; then
    if ! $check && [[ -n $old_key ]]; then
        git config --file "$local_cfg" user.signingkey "$old_key"
        say "saved signing key $old_key to ~/.gitconfig.local"
    elif [[ $(git config --global --includes --get commit.gpgsign 2>/dev/null) == true ]] &&
         [[ -z $(git config --global --includes --get user.signingkey 2>/dev/null) ]]; then
        flag "no signing key: add [user] signingkey = ~/.ssh/<key>.pub to ~/.gitconfig.local"
    fi
fi

if $check; then
    [[ $problems -eq 0 ]] && say "everything is linked"
    exit $((problems > 0 ? 1 : 0))
fi
if [[ -n $backup ]]; then
    say "Files that differed from the repo were moved to $backup"
fi
