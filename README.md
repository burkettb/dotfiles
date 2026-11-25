# Brandon's Dotfiles

macOS development environment. The repo lives at `~/.dotfiles`, `home/` mirrors
`$HOME`, and `install.sh` symlinks each file into place. Editing `~/.zshrc` edits
`home/.zshrc`, so there's no apply step: commit from `~/.dotfiles`, `git pull` on
the other machine, done.

## New machine setup

```bash
# 1. Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. SSH: brew install --cask secretive, create a key in it, add the public key
#    to GitHub (as auth and signing key), then in ~/.ssh/config:
#      Host *
#        IdentityAgent ~/Library/Containers/com.maxgoedjen.Secretive.SecretAgent/Data/socket.ssh
#        IdentityFile ~/.ssh/<key>.pub
#        IdentitiesOnly yes

# 3. Clone and link
git clone git@github.com:burkettb/dotfiles.git ~/.dotfiles
~/.dotfiles/install.sh

# 4. Install apps and tools
brew bundle --global
brew bundle --file ~/.dotfiles/Brewfile.personal   # personal Mac only

# 5. Install tmux plugin manager, then prefix + I inside tmux
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# 6. Install the managed agent plugins and verify the setup
agent-bootstrap
agent-doctor

# 7. Install node (and anything else in ~/.config/mise/config.toml)
mise install
```

## Moving a machine off chezmoi

```bash
cd ~/.dotfiles && git pull
# Replaces chezmoi's copies with links; anything that differed is moved to
# ~/.dotfiles-backup/<timestamp>/. Cleanup only runs if every link checks out.
./install.sh && ./install.sh --check &&
  brew uninstall chezmoi && rm -rf ~/.config/chezmoi ~/.tmux-sessionizer-dirs
```

Never run `chezmoi apply` after pulling this layout.

## Daily usage

| Task | Command |
| --- | --- |
| Edit a dotfile | Edit it where it is (`~/.zshrc`) or in `~/.dotfiles/home/`; same file |
| Track a new dotfile | Move it into `~/.dotfiles/home/` at the same path, then `./install.sh` |
| Rename or delete a dotfile | Do it in `home/`, then `./install.sh` (removes the stale link) |
| See what needs attention | The tmux status bar (e.g. `dotfiles ●1 ↓2`, empty when all is well), every new terminal, or `dotfiles-status`: links to update, uncommitted edits, a non-main branch, commits to pull or push |
| Check every link is in place | `./install.sh --check` |
| Get changes from the other machine | Automatic: a shell prompt runs `dotsync --quiet` in the background at most every 15 minutes, which fast-forwards main and relinks when there are no local edits or commits. Run `dotsync` to do it now and see what's blocking it. Background updates are logged in `~/.local/state/dotfiles/sync.log` |
| Install/repair agent plugins | `agent-bootstrap` |
| Verify agent configuration | `agent-doctor` |

## Machine differences (personal vs work)

Nothing in the repo knows which machine it's on. Differences live in untracked
files or skip themselves when a folder doesn't exist:

| What | Where |
| --- | --- |
| git email | GitHub noreply address in the shared `.gitconfig`. Work repos under `~/dev-icfcorp` get the work email from an untracked `~/.gitconfig-icfcorp` on the work Mac |
| Commit signing | On everywhere, through Secretive. Each Mac's key is its own: `[user] signingkey = ~/.ssh/<key>.pub` in `~/.gitconfig.local` (`install.sh` carries it over from an old `~/.gitconfig`), and its public key goes in `home/.config/git/allowed_signers`. No key: `[commit] gpgsign = false` there instead |
| Other machine-only git settings | `~/.gitconfig.local` (untracked, optional) |
| Work-only shell setup, secrets | `~/.shell_local`, sourced at the end of `.shell_common` |
| tmux-sessionizer folders | Roots that don't exist are skipped; override with `TMUX_SESSIONIZER_ROOTS` in `~/.shell_local` |
| Personal-only apps | `Brewfile.personal`, run by hand |
| Codex config | `~/.codex/config.toml`, seeded once from `seeds/` |

## What's here

| Repo path | Linked to | Notes |
| --- | --- | --- |
| `home/.zshrc`, `home/.zprofile` | `~/.zshrc` etc. | zsh |
| `home/.shell_common` | `~/.shell_common` | shared env/aliases/functions (bash+zsh) |
| `home/.config/starship.toml` | `~/.config/starship.toml` | prompt |
| `home/.config/mise/` | `~/.config/mise` | global tool versions (node); projects override with `mise.toml` or `.nvmrc` |
| `home/.gitconfig`, `home/.gitignore_global` | `~/.gitconfig` etc. | git |
| `home/.tmux.conf` | `~/.tmux.conf` | tmux |
| `home/.config/nvim/` | `~/.config/nvim` | Neovim 0.12, one `init.lua`, plugins via built-in `vim.pack` |
| `home/.local/bin/` | `~/.local/bin/*` | tmux-sessionizer and friends, agent bootstrap and health checks |
| `home/.config/atuin/` | `~/.config/atuin` | shell history sync |
| `home/.config/linearmouse/` | `~/.config/linearmouse` | mouse settings |
| `home/.claude/` | `~/.claude/CLAUDE.md`, `settings.json`, `hooks/`, `skills/*` | Claude defaults, permissions, hooks, skills |
| `home/.codex/` | `~/.codex/AGENTS.md`, `skills/*` | links back to the Claude files, so both agents share one set |
| `home/.editorconfig` | `~/.editorconfig` | applies to everything under `~` |
| `home/.Brewfile` | `~/.Brewfile` | `brew bundle --global` |
| `Brewfile.personal` | not linked | personal-only apps |
| `seeds/codex-config.toml` | copied once | see Agent configuration |
| `claude-plugins/` | read in place | Claude folder marketplace |

Folders the repo owns completely (nvim, mise, atuin, linearmouse, each skill) are
linked as whole folders, so new files inside need no `install.sh` run and apps
that save by replacing a file can't break the link. Everything else is linked
file by file, so `~/.claude` and `~/.codex` keep their own runtime files.

## Troubleshooting

- **tmux plugins missing**: install TPM (step 5 above), then `prefix + I`
- **Neovim LSP issues**: `:checkhealth vim.lsp` inside nvim. Language
  servers come from the Brewfile; nvim enables whichever are installed.
- **Neovim plugins**: `:lua vim.pack.update()` updates them; versions are
  pinned in `home/.config/nvim/nvim-pack-lock.json`.
- **A file stopped updating**: an app replaced the link with a copy. Run
  `./install.sh --check`, compare the copy in the backup folder, then `./install.sh`.

## Agent configuration

The dotfiles repository is the source of truth for global Codex and Claude
instructions, hardened permissions, and plugin declarations. DevCenter remains
the source of truth for per-project memory and standards; its home path is
intentionally machine-local.

`home/.claude/CLAUDE.md` is the one instruction file for both agents.
`home/.codex/AGENTS.md` is a symlink to it, and the few agent-specific lines say
which agent they apply to. A new skill goes in `home/.claude/skills/<name>/`, with a
relative link `home/.codex/skills/<name> -> ../../.claude/skills/<name>`, then
`./install.sh`.

`~/.codex/config.toml` is seeded once from `seeds/codex-config.toml`, because the
Codex app rewrites it at runtime with machine-local state (plugin caches, trust
hashes, node_repl paths) that should not be tracked. To re-seed a machine, delete
the file and run `./install.sh`. Claude's `settings.json` is a link, so changes
Claude makes to it show up as a diff here; `agent-doctor` verifies the hardening
keys are present in both. Because that link makes the live permissions and hooks
editable from this repo, settings.json blocks sandboxed writes to them and asks
before Edit/Write touches them; change them in a worktree branch instead.

Never commit credentials, OAuth state, API keys, or `.env` contents here.
Agent configuration references environment-variable names only. Use Keychain or
`~/.shell_local` for actual values.
