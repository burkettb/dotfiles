# Brandon's Dotfiles

A comprehensive set of configuration files for macOS development environment, managed with GNU Stow.

## Quick Setup

Clone this repository and run the installation script:

```bash
git clone https://github.com/your-username/dotfiles.git ~/.dotfiles
cd ~/.dotfiles
./install.sh
```

The install script will:
- Install Homebrew and required packages
- Backup your existing configurations
- Create symlinks using Stow
- Set up development tools and language servers

## Manual Installation

If you prefer to install manually:

### 1. Install Dependencies

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install packages
brew bundle --file=Brewfile
```

### 2. Stow Configurations

```bash
cd ~/.dotfiles

# Stow individual configurations
stow bin
stow git
stow nvim
stow shell
stow tmux
stow zsh
```

### 3. Post-Installation Setup

```bash
# Install tmux plugins
tmux new-session -d
tmux send-keys 'C-a I' Enter

# Install Neovim plugins (they'll install automatically on first launch)
nvim

# Set zsh as default shell (if not already)
chsh -s $(which zsh)
```

## What's Included

### 🚀 Core Tools

- **Neovim**: Modern Vim with LSP, treesitter, and extensive plugin ecosystem
- **Tmux**: Terminal multiplexer with beautiful theme and session management
- **Zsh**: Enhanced shell with Powerlevel10k theme and modern utilities
- **Git**: Comprehensive configuration with useful aliases and colors

### 🛠 Development Tools

- **Language Servers**: TypeScript, Lua, Python, Go, Rust
- **Formatters**: Prettier, Black, Stylua, ESLint
- **Modern CLI Tools**: fzf, ripgrep, bat, eza, zoxide, atuin
- **Container Tools**: Docker, Docker Compose, Lazydocker

### 📁 File Structure

```
~/.dotfiles/
├── bin/           # Custom scripts and utilities
├── git/           # Git configuration and global gitignore
├── nvim/          # Neovim configuration (Lua-based)
├── shell/         # Shared shell configuration
├── tmux/          # Tmux configuration and theme
├── zsh/           # Zsh-specific configuration
├── Brewfile       # Homebrew package list
├── install.sh     # Automated installation script
└── README.md      # This file
```

## Configurations

### Neovim

- **Plugin Manager**: lazy.nvim
- **Base**: Kickstart.nvim with custom enhancements
- **LSP**: Pre-configured for TypeScript, Python, Lua, Go, Rust
- **Key Features**: Telescope, Harpoon, Oil.nvim, Treesitter, DAP debugging

**New Features Added:**
- **DAP**: Full debugging support with UI (`<F5>` to start, `<leader>b` for breakpoints)
- **Harpoon**: Configured with proper keymaps (`<leader>a` to add, `<C-e>` for menu)
- **Terminal**: Integrated terminal (`<C-\>` for floating terminal, `<leader>gg` for lazygit)
- **Trouble**: Better diagnostics and error navigation (`<leader>xx` for diagnostics)
- **Flash**: Enhanced f/t motions and navigation (`s` for flash jump)
- **Sessions**: Auto-save/restore sessions (`<leader>qs` to save, `<leader>ql` to load)

**Key Bindings:**
- `<leader>` = Space
- `<leader>ff` = Find files
- `<leader>fg` = Live grep  
- `<leader>sh` = Search help
- `<C-h/j/k/l>` = Navigate splits
- `<leader>a` = Add to Harpoon
- `<C-e>` = Harpoon menu
- `<F5>` = Start/continue debugging
- `<leader>b` = Toggle breakpoint
- `<C-\>` = Toggle floating terminal
- `<leader>gg` = Lazygit
- `<leader>xx` = Show diagnostics
- `s` = Flash jump to any text

### Tmux

- **Theme**: Catppuccin
- **Prefix**: `Ctrl-a`
- **Plugins**: TPM, resurrect, continuum, vim-navigator

**Key Bindings:**
- `<prefix>I` = Install plugins
- `<prefix>f` = Find session
- `<prefix>r` = Reload config
- `<prefix>|` = Split horizontal
- `<prefix>-` = Split vertical

### Git

Essential aliases and configurations:
- `git lg` = Beautiful log graph
- `git st` = Short status
- `git unstage` = Unstage files
- `git cleanup` = Remove merged branches

### Shell

Modern shell enhancements:
- **fzf**: Fuzzy finder for files, history, processes
- **zoxide**: Smart directory jumping
- **eza**: Modern ls replacement
- **bat**: Syntax-highlighted cat
- **atuin**: Better shell history

## Window Management

**Aerospace** (installed via Brewfile)
- Modern keyboard-driven tiling window manager
- Reliable alternative to Yabai/SKHD which break with macOS updates
- **Key Feature**: `Ctrl + 1-6` to switch between workspaces instantly

**Workspace Layout:**
- **Space 1**: Utility apps (Spotify, Notes, Docker, Messages, Finder)
- **Space 2**: Main browser (Chrome)  
- **Space 3**: Terminal (iTerm2)
- **Space 4**: Secondary browser (Firefox)
- **Space 5**: Communication (Teams/ChatGPT)
- **Space 6**: Open space for meetings/flexible use

**Key Bindings:**
- `Ctrl + 1-6` = Switch to workspace
- `Ctrl + Shift + 1-6` = Move window to workspace
- `Alt + h/j/k/l` = Focus window in direction
- `Alt + Shift + h/j/k/l` = Move window in direction
- `Alt + f` = Toggle fullscreen
- `Alt + semicolon` = Enter service mode (for advanced window manipulation)

## Development Environment

### Language Support

| Language   | LSP Server | Formatter | Linter |
|------------|------------|-----------|--------|
| TypeScript | typescript-language-server | Prettier | ESLint |
| Python     | pyright    | Black     | Ruff   |
| Lua        | lua-language-server | Stylua | - |
| Go         | gopls      | gofmt     | - |
| Rust       | rust-analyzer | rustfmt | - |

### Database Tools

- PostgreSQL client
- MySQL client
- Redis

## Customization

### Local Overrides

Create local override files for machine-specific settings:

```bash
# Git (personal vs work email)
~/.gitconfig.local

# Shell (machine-specific paths)
~/.shell_local
```

### Adding New Packages

Add to `Brewfile` and run:
```bash
brew bundle --file=Brewfile
```

### Custom Scripts

Add executable scripts to `bin/.local/bin/` and they'll be available in your PATH.

## Troubleshooting

### Common Issues

**Zsh plugins not working:**
```bash
# Reinstall syntax highlighting and autosuggestions
brew reinstall zsh-syntax-highlighting zsh-autosuggestions
```

**Tmux plugins not installing:**
```bash
# Manually install TPM
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
# Then in tmux: prefix + I
```

**Neovim LSP not working:**
```bash
# Check LSP status in Neovim
:LspInfo
:Mason  # Install/update language servers
```

**Stow conflicts:**
```bash
# Remove existing files/symlinks before stowing
rm ~/.zshrc ~/.gitconfig ~/.tmux.conf
stow zsh git tmux
```

### Getting Help

1. Check the configuration files for inline documentation
2. Run `git aliases` to see all available Git shortcuts
3. Use `which-key` in Neovim (press space and wait) to see keybindings
4. Check tmux key bindings with `prefix + ?`

## Contributing

Feel free to submit issues or pull requests for improvements!

## License

MIT License - feel free to use and modify as needed.