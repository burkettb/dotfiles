# Brandon's Dotfiles

macOS development environment, managed with [chezmoi](https://www.chezmoi.io/).
The repo lives at `~/.dotfiles` and is chezmoi's source directory.

## New machine setup

```bash
# 1. Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install chezmoi and apply the dotfiles
brew install chezmoi
chezmoi init --source ~/.dotfiles --apply git@github.com:Brandon-Burkett/dotfiles.git
# You'll be prompted for: machine type (personal/work) and git email

# 3. Install everything else (~/.Brewfile is rendered by chezmoi,
#    with personal-only apps excluded on work machines)
brew bundle --global

# 4. Install tmux plugin manager, then prefix + I inside tmux
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# 5. Install the managed agent plugins and verify the setup
agent-bootstrap
agent-doctor
```

## Migrating a machine that still uses the old stow setup

The work machine has stow symlinks pointing at the old repo layout; they'll
dangle after pulling. One-time fix:

```bash
cd ~/.dotfiles && git pull
brew install chezmoi

# Remove the old stow symlinks (files only — leaves real files alone)
/bin/rm -f ~/.editorconfig ~/.gitconfig ~/.gitignore_global ~/.p10k.zsh \
  ~/.shell_common ~/.shell_local.example ~/.tmux-sessionizer-dirs ~/.tmux.conf \
  ~/.zshrc ~/.zprofile ~/.config/nvim ~/.config/iterm2 \
  ~/.local/bin/git_dir.sh ~/.local/bin/tmux-sessionizer \
  ~/.local/bin/tmux-ssh-sessionizer ~/.local/bin/tmux-windowizer

# Point chezmoi at the repo and apply (answer: machine=work, work git email)
chezmoi init --source ~/.dotfiles --apply

brew bundle --global   # personal-only apps are excluded automatically
brew uninstall stow
```

Then restart the terminal. Machine-specific extras still go in `~/.shell_local`.

## Daily usage

| Task | Command |
| --- | --- |
| Edit a managed file | `chezmoi edit --apply ~/.zshrc` (or edit the `dot_` file in `~/.dotfiles` and `chezmoi apply`) |
| Edit nvim config | Just edit `~/.config/nvim/...` directly — it's a symlink into the repo |
| Track a new dotfile | `chezmoi add ~/.foo` |
| See unapplied changes | `chezmoi diff` / `chezmoi status` |
| Pull + apply on another machine | `chezmoi update` |
| Install/repair agent plugins | `agent-bootstrap` |
| Verify agent configuration | `agent-doctor` |

Commit and push from `~/.dotfiles` like any normal git repo.

## Machine differences (personal vs work)

Two mechanisms:

- **Templates** — `.tmpl` files branch on the `machine` and `email` values you
  entered at `chezmoi init` (stored in `~/.config/chezmoi/chezmoi.toml`).
  Work-only shell config goes in the `{{ if eq .machine "work" }}` block of
  `dot_shell_common.tmpl`; the git email is templated in `dot_gitconfig.tmpl`.
- **`~/.shell_local`** — untracked escape hatch, sourced at the end of
  `.shell_common` if it exists, for anything that shouldn't be in the repo.

## What's here

| Source | Target | Notes |
| --- | --- | --- |
| `dot_zshrc`, `dot_zprofile`, `dot_p10k.zsh` | `~/.zshrc` etc. | zsh + powerlevel10k |
| `dot_shell_common.tmpl` | `~/.shell_common` | shared env/aliases/functions (bash+zsh) |
| `dot_gitconfig.tmpl`, `dot_gitignore_global` | `~/.gitconfig` etc. | git |
| `dot_tmux.conf`, `dot_tmux-sessionizer-dirs` | `~/.tmux.conf` etc. | tmux |
| `nvim/` | `~/.config/nvim` (symlink) | Neovim; kept as a symlink so edits apply instantly |
| `dot_local/bin/executable_*` | `~/.local/bin/*` | tmux-sessionizer and friends |
| `dot_config/kitty/` | `~/.config/kitty` | kitty terminal |
| `dot_config/private_atuin/` | `~/.config/atuin` | shell history sync |
| `dot_codex/` | `~/.codex/AGENTS.md`, `~/.codex/config.toml` | Codex defaults and permissions; `config.toml` is seeded once, then owned by the Codex app |
| `dot_claude/` | `~/.claude/CLAUDE.md`, `~/.claude/settings.json` | Claude defaults, permissions, hooks, and plugins |
| `dot_local/bin/executable_agent-*` | `~/.local/bin/agent-*` | Agent bootstrap and health checks |
| `dot_editorconfig` | `~/.editorconfig` | applies to everything under `~` |
| `dot_Brewfile.tmpl` | `~/.Brewfile` | `brew bundle --global`; personal-only casks are templated out on work machines |
| `iterm2/` | — | exported iTerm2 profile/settings JSON, import manually |

## Troubleshooting

- **tmux plugins missing** — install TPM (step 4 above), then `prefix + I`
- **Neovim LSP issues** — `:LspInfo` and `:Mason` inside nvim
- **A file looks stale** — `chezmoi diff` shows drift between repo and home;
  `chezmoi apply` pushes repo → home, `chezmoi re-add` pulls home → repo

## Agent configuration

The dotfiles repository is the source of truth for global Codex and Claude
instructions, hardened permissions, and plugin declarations. DevCenter remains
the source of truth for per-project memory and
standards; its home path is intentionally machine-local.

`~/.codex/config.toml` is a one-time seed (`create_` source): chezmoi writes it
only when the file is missing, because the Codex app rewrites it at runtime
with machine-local state (plugin caches, trust hashes, node_repl paths) that
should not be tracked. To re-seed a machine, delete the file and run
`chezmoi apply`. Claude's `settings.json` stays fully managed; `agent-doctor`
verifies the hardening keys are present in both.

Never commit credentials, OAuth state, API keys, or `.env` contents here.
Agent configuration references environment-variable names only. Use Keychain or
`~/.shell_local` for actual values.
