#!/usr/bin/env bash
# Links this repo into $HOME. Safe to run any number of times.
#
#   ./install.sh              link home/, then hosts/<this Mac>/, seed the Codex config if missing
#   ./install.sh --host argo  save "argo" as this Mac's name first (~/.config/dotfiles/host)
#   ./install.sh --check      list anything not linked yet; changes nothing
#
# Editing a linked file needs nothing: ~/.zshrc *is* home/.zshrc. Rerun this
# only after adding, renaming, or deleting a file under home/ or hosts/. Only
# files git tracks are linked, so `git add` a new file first. New terminals
# say when a rerun is needed (see home/.local/bin/dotfiles-status).
set -euo pipefail

usage() { printf 'usage: install.sh [--check] [--host <name>]\n'; }
check=false host_arg=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --check) check=true ;;
        --host) [[ $# -ge 2 ]] || { usage >&2; exit 2; }; host_arg=$2; shift ;;
        --host=*) host_arg=${1#--host=} ;;
        -h|--help) usage; exit 0 ;;
        *) usage >&2; exit 2 ;;
    esac
    shift
done

repo=$(cd "$(dirname "$0")" && pwd)
# Links point at whichever checkout runs this, so a worktree or second clone
# would become the live config and dangle once deleted.
if [[ $repo != "$HOME/.dotfiles" ]]; then
    printf 'Run this from ~/.dotfiles, not %s\n' "$repo" >&2
    exit 1
fi
backup=""                               # created on first use, unique per run
manifest="$HOME/.local/state/dotfiles/links"
host_file="$HOME/.config/dotfiles/host"
problems=0
infos=()
pending=""                              # a temp file to delete if this run dies
work=$(mktemp -d "${TMPDIR:-/tmp}/dotfiles-install.XXXXXX")

cleanup() {
    local rc=$?
    [[ -z $pending ]] || rm -rf "$pending"
    rm -rf "$work"
    if [[ $rc -ne 0 && -n $backup ]]; then
        printf 'Stopped early. Files already moved aside are in %s\n' "$backup" >&2
    fi
}
trap cleanup EXIT

say() { printf '%s\n' "$*"; }
flag() { say "$*"; problems=$((problems + 1)); }
info() { infos+=("$*"); }
die() { printf '%s\n' "$*" >&2; exit 1; }

# The host name is written down rather than detected: inside the agent sandbox
# `scutil --get LocalHostName` returns a different name than outside it.
host_re='^[A-Za-z0-9][A-Za-z0-9_-]*$'
if [[ -n $host_arg ]]; then
    [[ $host_arg =~ $host_re ]] || { printf 'Bad host name: %s\n' "$host_arg" >&2; exit 2; }
    host=$host_arg
elif [[ -f $host_file ]]; then
    host=""
    IFS= read -r host < "$host_file" || true
    host=${host//[[:space:]]/}
    [[ -z $host || $host =~ $host_re ]] || die "Bad host name in $host_file: $host"
else
    host=""
fi

# 1. Work out every link before touching anything. Only tracked files count:
#    a scratch file under home/ must not become live config.
plan_dest=() plan_src=()                # ~-relative destination, absolute source
add() { plan_dest+=("$1"); plan_src+=("$2"); }

# tracked <dir> <out>: tracked files under <dir>/ that still exist, NUL-separated,
# relative to <dir>
tracked() {
    local f
    git -C "$repo" ls-files -z -- "$1/" > "$work/ls"
    : > "$2"
    while IFS= read -r -d '' f; do
        if [[ ! -e $repo/$f && ! -L $repo/$f ]]; then
            continue                    # deleted, not yet committed
        fi
        case $f in *$'\t'*|*$'\n'*) die "Path with a tab or newline: $f" ;; esac
        printf '%s\0' "${f#"$1"/}" >> "$2"
    done < "$work/ls"
}

# Folders the repo owns completely get one link for the whole folder, so new
# files inside show up without rerunning this, and apps that save by replacing
# a file can't swap the link for a plain copy.
dir_links=(.config/nvim .config/mise .config/atuin .config/linearmouse)
skills=()
tracked home "$work/home"
while IFS= read -r -d '' f; do
    case $f in
        .claude/skills/*/*)
            n=${f#.claude/skills/}
            n=${n%%/*}
            case " ${skills[*]-} " in *" $n "*) ;; *) skills+=("$n") ;; esac
            ;;
    esac
done < "$work/home"
for n in ${skills[@]+"${skills[@]}"}; do
    dir_links+=(".claude/skills/$n")
done

used_dirs=() files=()
while IFS= read -r -d '' f; do
    owner=""
    for d in "${dir_links[@]}"; do
        if [[ $f == "$d"/* ]]; then
            owner=$d
            break
        fi
    done
    if [[ -z $owner ]]; then
        files+=("$f")
        continue
    fi
    case " ${used_dirs[*]-} " in *" $owner "*) ;; *) used_dirs+=("$owner") ;; esac
done < "$work/home"
for d in "${dir_links[@]}"; do
    case " ${used_dirs[*]-} " in *" $d "*) add "$d" "$repo/home/$d" ;; esac
done
for f in ${files[@]+"${files[@]}"}; do
    add "$f" "$repo/home/$f"
done
# Codex reads user skills from ~/.agents/skills; both agents share the Claude copies
for n in ${skills[@]+"${skills[@]}"}; do
    add ".agents/skills/$n" "$repo/home/.claude/skills/$n"
done

# hosts/<name>/ mirrors $HOME like home/ and only adds files. Anything that
# would shadow or land inside a home/ link stops the run before any change.
if [[ -z $host ]]; then
    names=$(cd "$repo" && git ls-files -- hosts | cut -d/ -f2 | sort -u | paste -sd ' ' -)
    info "no host file, linked home/ only. For this Mac's extras run ./install.sh --host <name> (hosts/: ${names:-none})"
elif [[ -z $(git -C "$repo" ls-files -- "hosts/$host/") ]]; then
    info "host $host has no files under hosts/$host/, linked home/ only"
else
    tracked "hosts/$host" "$work/host"
    # Compared without case: macOS file systems treat .zshrc and .ZSHRC as one file
    lower() { printf '%s\n' "$1" | tr '[:upper:]' '[:lower:]'; }
    clashes=() base_lower=()
    base_count=${#plan_dest[@]}
    for ((i = 0; i < base_count; i++)); do
        base_lower+=("$(lower "${plan_dest[i]}")")
    done
    while IFS= read -r -d '' f; do
        fl=$(lower "$f")
        for ((i = 0; i < base_count; i++)); do
            b=${base_lower[i]}
            if [[ $fl == "$b" || $fl == "$b"/* || $b == "$fl"/* ]]; then
                clashes+=("hosts/$host/$f clashes with ~/${plan_dest[i]} from home/")
            fi
        done
        add "$f" "$repo/hosts/$host/$f"
    done < "$work/host"
    if [[ ${#clashes[@]} -gt 0 ]]; then
        printf '%s\n' "${clashes[@]}" >&2
        die "Host files only add to home/. Move or delete these, nothing was changed."
    fi
fi

in_plan() {
    local d
    for d in ${plan_dest[@]+"${plan_dest[@]}"}; do
        [[ $1 == "$d" ]] && return 0
    done
    return 1
}

# 2. Make the changes. Every link is created beside its destination and renamed
#    over it, so a failure never leaves a file missing.
if [[ $(uname -s) == Darwin ]]; then
    mv_link=(mv -f -h)                  # rename over a link to a folder, not into it
else
    mv_link=(mv -f -T)
fi

if ! $check && [[ -n $host_arg ]]; then
    mkdir -p "$(dirname "$host_file")"
    pending=$(mktemp "$host_file.XXXXXX")
    printf '%s\n' "$host_arg" > "$pending"
    mv -f "$pending" "$host_file"
    pending=""
    say "saved host name $host_arg to ~/.config/dotfiles/host"
fi

repo_real=$(cd "$repo" && pwd -P)
inside_repo() { # inside_repo <path>: its nearest existing folder resolves into the repo
    local p=$1
    while [[ ! -e $p && $p != / ]]; do p=$(dirname "$p"); done
    p=$(cd "$p" && pwd -P)
    [[ $p == "$repo_real" || $p == "$repo_real"/* ]]
}

link() {
    local rel=$1 src=$2 dest="$HOME/$1" dir aside=""
    [[ -L $dest && $(readlink "$dest") == "$src" ]] && return 0
    if $check; then
        flag "not linked: ~/$rel"
        return 0
    fi
    dir=$(dirname "$dest")
    if inside_repo "$dir"; then
        die "~/$rel: a parent folder is a link into the repo; remove it and rerun"
    fi
    mkdir -p "$dir"
    pending="$dir/.dotfiles-new.$$.$RANDOM"
    ln -s "$src" "$pending"
    if [[ -L $dest || ! -e $dest ]]; then
        :                               # a link to somewhere else, nothing to lose
    elif [[ -f $dest ]] && cmp -s "$dest" "$src"; then
        :                               # an identical copy
    elif [[ -d $dest ]] && diff -rq "$dest" "$src" >/dev/null 2>&1; then
        aside="$dir/.dotfiles-old.$$.$RANDOM"   # an identical folder
        mv "$dest" "$aside"
    else
        if [[ -z $backup ]]; then
            mkdir -p "$HOME/.dotfiles-backup"
            backup=$(mktemp -d "$HOME/.dotfiles-backup/$(date +%Y%m%d-%H%M%S)-XXXX")
        fi
        mkdir -p "$backup/$(dirname "$rel")"
        mv "$dest" "$backup/$rel"
        say "backed up ~/$rel"
    fi
    if ! "${mv_link[@]}" "$pending" "$dest"; then
        [[ -z $aside ]] || mv "$aside" "$dest"
        die "could not link ~/$rel"
    fi
    pending=""
    [[ -z $aside ]] || rm -rf "$aside"
    say "linked ~/$rel"
}

# The git email and signing key from a ~/.gitconfig this run is about to
# replace (a chezmoi copy holds whatever email `chezmoi init` asked for). Saved
# before any link changes, so a run that fails halfway can't lose them.
old_email="" old_key=""
if [[ -f $HOME/.gitconfig && ! -L $HOME/.gitconfig ]]; then
    old_email=$(git config --file "$HOME/.gitconfig" user.email 2>/dev/null || true)
    old_key=$(git config --file "$HOME/.gitconfig" user.signingkey 2>/dev/null || true)
fi
work_cfg="$HOME/.gitconfig-icfcorp"
local_cfg="$HOME/.gitconfig.local"
if ! $check; then
    # Work repos take their email from ~/.gitconfig-icfcorp; without it they'd
    # commit as the personal address
    if [[ -d $HOME/dev-icfcorp && ! -f $work_cfg && -n $old_email &&
          $old_email != *users.noreply.github.com ]]; then
        printf '[user]\n\temail = %s\n' "$old_email" > "$work_cfg"
        say "saved work email $old_email to ~/.gitconfig-icfcorp"
    fi
    # Commits are signed with this Mac's own key, named in ~/.gitconfig.local
    if [[ -n $old_key && -z $(git config --file "$local_cfg" user.signingkey 2>/dev/null) ]]; then
        git config --file "$local_cfg" user.signingkey "$old_key"
        say "saved signing key $old_key to ~/.gitconfig.local"
    fi
fi

# 3. Remove links from the last run that this run no longer makes: the file was
#    renamed or deleted, or it belongs to another host. Only while the link still
#    points where that run put it; anything else is someone else's. This runs
#    before linking, so a folder link that became a real folder is gone before
#    anything is created inside it.
unlink_stale() { # unlink_stale <rel> <recorded source>
    local l="$HOME/$1"
    [[ -L $l && $2 == "$repo/"* && $(readlink "$l") == "$2" ]] || return 0
    in_plan "$1" && return 0
    if $check; then
        flag "stale link: ~/$1"
    else
        rm "$l"
        say "removed stale link ~/$1"
    fi
}
if [[ -f $manifest ]]; then
    while IFS= read -r line || [[ -n $line ]]; do
        [[ -n $line ]] || continue
        case $line in
            *$'\t'*) unlink_stale "${line%%$'\t'*}" "${line#*$'\t'}" ;;
            *) unlink_stale "$line" "$repo/home/$line" ;;  # written before sources were recorded
        esac
    done < "$manifest"
fi
# Codex skills used to be linked into ~/.codex/skills. Skip it when it is itself
# a link (say to ~/.agents/skills): its entries are someone else's.
if [[ ! -L $HOME/.codex/skills ]]; then
    for l in "$HOME"/.codex/skills/*; do
        [[ -L $l ]] || continue
        t=$(readlink "$l")
        [[ $t == "$repo/"* ]] || continue
        unlink_stale ".codex/skills/${l##*/}" "$t"
    done
fi

for ((i = 0; i < ${#plan_dest[@]}; i++)); do
    link "${plan_dest[i]}" "${plan_src[i]}"
done
if ! $check; then
    mkdir -p "$(dirname "$manifest")"
    pending=$(mktemp "$manifest.XXXXXX")
    for ((i = 0; i < ${#plan_dest[@]}; i++)); do
        printf '%s\t%s\n' "${plan_dest[i]}" "${plan_src[i]}"
    done > "$pending"
    mv -f "$pending" "$manifest"
    pending=""
fi

# 4. Seed the Codex config, which Codex then owns. Written private from the start.
codex_cfg="$HOME/.codex/config.toml"
if [[ ! -e $codex_cfg && ! -L $codex_cfg ]]; then
    if $check; then
        flag "missing: ~/.codex/config.toml"
    else
        old_umask=$(umask)
        umask 077
        mkdir -p "$HOME/.codex"
        pending=$(mktemp "$codex_cfg.XXXXXX")
        home_esc=$(printf '%s\n' "$HOME" | sed 's/[\\|&]/\\&/g')
        sed "s|__HOME__|$home_esc|g" "$repo/seeds/codex-config.toml" > "$pending"
        chmod 600 "$pending"
        mv -f "$pending" "$codex_cfg"
        pending=""
        umask "$old_umask"
        say "seeded ~/.codex/config.toml"
    fi
fi

# 5. Work repos need their own email, and signing needs this Mac's key
if [[ -d $HOME/dev-icfcorp && ! -f $work_cfg ]]; then
    flag "missing: ~/.gitconfig-icfcorp. Create it with: [user] email = <work email>"
fi
if [[ -z $(git config --file "$local_cfg" user.signingkey 2>/dev/null) ]] &&
   [[ $(git config --global --includes --get commit.gpgsign 2>/dev/null) == true ]] &&
   [[ -z $(git config --global --includes --get user.signingkey 2>/dev/null) ]]; then
    flag "no signing key: add [user] signingkey = ~/.ssh/<key>.pub to ~/.gitconfig.local"
fi

# 6. Untracked files that hold this Mac's secrets; templates live in seeds/examples/
for pair in .gitconfig.local:gitconfig.local.example .shell_local:shell_local.example; do
    [[ -e $HOME/${pair%%:*} ]] || info "no ~/${pair%%:*} (template: seeds/examples/${pair#*:})"
done

# Info goes last so a problem stays the first line (dotfiles-status shows it)
for m in ${infos[@]+"${infos[@]}"}; do
    say "info: $m"
done
if $check; then
    [[ $problems -eq 0 ]] && say "everything is linked"
    exit $((problems > 0 ? 1 : 0))
fi
if [[ -n $backup ]]; then
    say "Files that differed from the repo were moved to $backup"
fi
