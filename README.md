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

# 3. Install everything else
brew bundle --file ~/.dotfiles/Brewfile

# 4. Install tmux plugin manager, then prefix + I inside tmux
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

## Daily usage

| Task | Command |
| --- | --- |
| Edit a managed file | `chezmoi edit --apply ~/.zshrc` (or edit the `dot_` file in `~/.dotfiles` and `chezmoi apply`) |
| Edit nvim config | Just edit `~/.config/nvim/...` directly — it's a symlink into the repo |
| Track a new dotfile | `chezmoi add ~/.foo` |
| See unapplied changes | `chezmoi diff` / `chezmoi status` |
| Pull + apply on another machine | `chezmoi update` |

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
| `dot_claude/` | `~/.claude/settings.json` | Claude Code settings |
| `dot_editorconfig` | `~/.editorconfig` | applies to everything under `~` |
| `Brewfile` | — | `brew bundle --file ~/.dotfiles/Brewfile` |
| `iterm2/` | — | exported iTerm2 profile/settings JSON, import manually |

## Troubleshooting

- **tmux plugins missing** — install TPM (step 4 above), then `prefix + I`
- **Neovim LSP issues** — `:LspInfo` and `:Mason` inside nvim
- **A file looks stale** — `chezmoi diff` shows drift between repo and home;
  `chezmoi apply` pushes repo → home, `chezmoi re-add` pulls home → repo
