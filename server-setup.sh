#!/bin/bash

# Lightweight server setup for shared EC2 instances
# This script sets up a personal environment without affecting other users
#
# Installation methods:
# 1. Copy and run: scp server-setup.sh user@server:~/ && ssh user@server 'bash server-setup.sh'
# 2. Direct from GitHub: curl -sSL https://raw.githubusercontent.com/yourusername/dotfiles/main/server-setup.sh | bash

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up lightweight server environment...${NC}"

# Base directory for personal config
PERSONAL_DIR="$HOME/.personal_config"
mkdir -p "$PERSONAL_DIR"

# Create activation script
cat > "$PERSONAL_DIR/activate" << 'EOF'
#!/bin/bash

# Activate personal environment
export PERSONAL_CONFIG_ACTIVE=1

# Set custom paths
export PATH="$HOME/.personal_config/bin:$PATH"
export XDG_CONFIG_HOME="$HOME/.personal_config/config"
export XDG_DATA_HOME="$HOME/.personal_config/data"

# Aliases for using personal configs
alias tmux='tmux -f $HOME/.personal_config/config/tmux/tmux.conf'
alias nvim='nvim -u $HOME/.personal_config/config/nvim/init.lua'
alias vim='nvim -u $HOME/.personal_config/config/nvim/init.lua'

# Load custom shell config if using zsh
if [ -n "$ZSH_VERSION" ]; then
    source "$HOME/.personal_config/config/zsh/zshrc"
fi

echo "Personal environment activated! Type 'deactivate' to return to defaults."
EOF

# Create deactivation script
cat > "$PERSONAL_DIR/deactivate_function" << 'EOF'
deactivate() {
    unset PERSONAL_CONFIG_ACTIVE
    unset XDG_CONFIG_HOME
    unset XDG_DATA_HOME
    unalias tmux 2>/dev/null
    unalias nvim 2>/dev/null
    unalias vim 2>/dev/null
    # Restore original PATH
    export PATH=$(echo $PATH | sed "s|$HOME/.personal_config/bin:||")
    echo "Personal environment deactivated."
}
EOF

# Make activation script executable
chmod +x "$PERSONAL_DIR/activate"

# Create directory structure
mkdir -p "$PERSONAL_DIR/config/tmux"
mkdir -p "$PERSONAL_DIR/config/nvim/lua"
mkdir -p "$PERSONAL_DIR/config/zsh"
mkdir -p "$PERSONAL_DIR/bin"
mkdir -p "$PERSONAL_DIR/data"

# Create minimal tmux config
cat > "$PERSONAL_DIR/config/tmux/tmux.conf" << 'EOF'
# Minimal tmux config for servers (with nested session support)
set -g mouse on
set -g base-index 1
set -s escape-time 0

# IMPORTANT: Different prefix for remote sessions to avoid conflicts
# Use Ctrl+b on remote (your local uses Ctrl+a)
set -g prefix C-b
unbind C-a
bind C-b send-prefix

# Easy splits
bind | split-window -h
bind - split-window -v

# Vim-style pane navigation
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Status bar with REMOTE indicator
set -g status-style bg=colour235,fg=colour136
set -g status-left '#[fg=colour235,bg=colour166,bold] REMOTE: #S '
set -g status-right '#[fg=colour235,bg=colour252,bold] #H | %Y-%m-%d %H:%M '

# Window status
setw -g window-status-style fg=colour244
setw -g window-status-current-style fg=colour166,bold

# Window renumbering
set -g renumber-windows on
EOF

# Create minimal neovim config
cat > "$PERSONAL_DIR/config/nvim/init.lua" << 'EOF'
-- Minimal Neovim config for servers

-- Basic options
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.mouse = 'a'
vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.hlsearch = false
vim.opt.breakindent = true
vim.opt.undofile = false
vim.opt.updatetime = 250
vim.opt.signcolumn = 'yes'
vim.opt.clipboard = 'unnamedplus'
vim.opt.scrolloff = 10
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true

-- Set space as leader
vim.g.mapleader = ' '
vim.g.maplocalleader = ' '

-- Basic keymaps
vim.keymap.set('n', '<leader>w', ':w<CR>', { desc = 'Save file' })
vim.keymap.set('n', '<leader>q', ':q<CR>', { desc = 'Quit' })
vim.keymap.set('n', '<leader>/', ':noh<CR>', { desc = 'Clear search' })

-- Better navigation
vim.keymap.set('n', '<C-d>', '<C-d>zz')
vim.keymap.set('n', '<C-u>', '<C-u>zz')
vim.keymap.set('n', 'n', 'nzzzv')
vim.keymap.set('n', 'N', 'Nzzzv')

-- Move lines
vim.keymap.set('v', 'J', ":m '>+1<CR>gv=gv")
vim.keymap.set('v', 'K', ":m '<-2<CR>gv=gv")

-- File explorer
vim.keymap.set('n', '<leader>e', vim.cmd.Ex, { desc = 'Explorer' })

-- Minimal colorscheme
vim.cmd.colorscheme('habamax')
EOF

# Create minimal zsh config (if zsh is available)
cat > "$PERSONAL_DIR/config/zsh/zshrc" << 'EOF'
# Minimal zsh config for servers

# History
HISTFILE="$HOME/.personal_config/data/zsh_history"
HISTSIZE=1000
SAVEHIST=1000

# Basic prompt
PS1='%F{blue}%n@%m%f:%F{green}%~%f$ '

# Aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'

# Enable auto-completion
autoload -Uz compinit && compinit

# Load deactivate function
source "$HOME/.personal_config/deactivate_function"
EOF

# Create convenience command
cat > "$HOME/.personal_config/bin/myenv" << 'EOF'
#!/bin/bash
source "$HOME/.personal_config/activate"
EOF
chmod +x "$HOME/.personal_config/bin/myenv"

# Add myenv to PATH for easy access (without auto-activation)
if ! grep -q ".personal_config/bin" "$HOME/.bashrc" 2>/dev/null; then
    echo "" >> "$HOME/.bashrc"
    echo "# Personal environment available - type 'myenv' to activate" >> "$HOME/.bashrc"
    echo "export PATH=\"\$HOME/.personal_config/bin:\$PATH\"" >> "$HOME/.bashrc"
fi

echo -e "${GREEN}Setup complete!${NC}"
echo ""
echo -e "${YELLOW}To activate your personal environment:${NC}"
echo "  source ~/.personal_config/activate"
echo ""
echo -e "${YELLOW}Or simply run:${NC}"
echo "  myenv"
echo ""
echo -e "${YELLOW}To deactivate:${NC}"
echo "  deactivate"
echo ""
echo -e "${YELLOW}Quick install from GitHub:${NC}"
echo "  curl -sSL https://raw.githubusercontent.com/yourusername/dotfiles/main/server-setup.sh | bash"