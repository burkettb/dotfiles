# Server Setup Documentation

This document explains the lightweight server configuration system for shared EC2 instances.

## Overview

The `server-setup.sh` script creates an isolated personal environment that:
- **Doesn't affect other users** - Everything lives in `~/.personal_config/`
- **Activates on-demand** - Type `myenv` to load your configs
- **Easily reversible** - Type `deactivate` to return to system defaults

## Installation

### Method 1: Direct copy
```bash
# From your local machine
scp ~/.dotfiles/server-setup.sh user@ec2-instance:~/

# SSH in and run
ssh user@ec2-instance
bash server-setup.sh
rm server-setup.sh  # Optional cleanup
```

### Method 2: From GitHub (after pushing your dotfiles)
```bash
ssh user@ec2-instance
curl -sSL https://raw.githubusercontent.com/yourusername/dotfiles/main/server-setup.sh | bash
```

## How It Works

### Directory Structure
```
~/.personal_config/
├── activate           # Activation script
├── deactivate_function # Deactivation function
├── bin/
│   └── myenv         # Quick activation command
├── config/
│   ├── tmux/
│   │   └── tmux.conf # Tmux configuration
│   ├── nvim/
│   │   └── init.lua  # Neovim configuration
│   └── zsh/
│       └── zshrc     # Zsh configuration (if using zsh)
└── data/
    └── zsh_history   # Isolated shell history
```

### Activation System

When you run `myenv` or `source ~/.personal_config/activate`:

1. **Environment variables are set:**
   - `XDG_CONFIG_HOME` → `~/.personal_config/config`
   - `XDG_DATA_HOME` → `~/.personal_config/data`
   - `PATH` → Prepends `~/.personal_config/bin`

2. **Aliases are created:**
   - `tmux` → Uses your personal tmux.conf
   - `nvim`/`vim` → Uses your personal init.lua

3. **Shell config loads** (if using zsh)

4. **Deactivation function** becomes available

### No Interference Design

- **No files in home directory** except `~/.personal_config/`
- **No global config changes**
- **PATH modification in .bashrc** only adds the `myenv` command
- **Original commands work normally** when not activated

## What's Included

### Tmux Configuration (`Ctrl+b` prefix)
- **Different prefix** from local (`Ctrl+b` vs your local `Ctrl+a`)
- **Visual indicator** - Status bar shows "REMOTE: session-name"
- **Mouse support** - Click to select panes/windows
- **Vim navigation** - Use hjkl to move between panes
- **Easy splits** - `|` for vertical, `-` for horizontal
- **Window renumbering** - Automatic reordering when closing windows

### Neovim Configuration
- **Basic options** - Line numbers, relative numbers, mouse support
- **Leader key** - Space (same as your local config)
- **Essential mappings:**
  - `<leader>w` - Save
  - `<leader>q` - Quit
  - `<leader>e` - File explorer
  - `<leader>/` - Clear search
- **Navigation improvements:**
  - Centered scrolling (`C-d`/`C-u`)
  - Centered search (`n`/`N`)
- **Clipboard integration** - System clipboard works
- **Sane defaults** - 4-space tabs, case-insensitive search

### Shell Enhancements (if using zsh)
- **Aliases:**
  - `ll` → `ls -la`
  - `la` → `ls -A`
  - `..` → `cd ..`
  - `...` → `cd ../..`
- **Simple prompt** - Shows user@host:path
- **Isolated history** - Separate from system history
- **Auto-completion** enabled

## Nested Tmux Usage

Since you're using tmux locally to SSH into servers:

### Understanding Prefixes
- **Local tmux**: `Ctrl+a` (your normal prefix)
- **Remote tmux**: `Ctrl+b` (different to avoid conflicts)

### Key Forwarding (configured in your local tmux)
- `Ctrl+a a` - Send prefix to inner tmux
  - Example: `Ctrl+a a d` detaches from remote tmux
- `F12` - Toggle local tmux on/off
  - When off, all keys go to remote tmux

### Visual Indicators
- Local tmux: Your normal Catppuccin theme
- Remote tmux: Shows "REMOTE:" in orange status bar

### Common Workflows
```bash
# Local tmux window 1: Direct server work
ssh user@server
myenv
nvim /path/to/file

# Local tmux window 2: Remote tmux for persistent sessions
ssh user@server
myenv
tmux new -s debug-session
# Do work...
# Ctrl+b d to detach
# Session persists after disconnect

# Later: Reattach to remote session
ssh user@server
myenv
tmux attach -t debug-session
```

## What's NOT Included

### Heavy Features
- **Plugin managers** - No TPM, vim-plug, etc.
- **Language servers** - No LSP, completion, or intelligent features
- **Fancy themes** - Basic colors only
- **Git integration** - No fugitive, gitsigns, etc.

### Why These Are Excluded
1. **Performance** - Shared servers have limited resources
2. **Dependencies** - Requires internet, compilation, or root access
3. **Disk space** - Minimal footprint on shared systems
4. **Quick setup** - No waiting for plugin downloads
5. **Security** - Less attack surface, no external downloads

## Maintenance

### Updating Configuration
1. Edit `server-setup.sh` locally
2. Re-run installation on server
3. Old config is overwritten

### Complete Removal
```bash
rm -rf ~/.personal_config
# Remove PATH line from ~/.bashrc if desired
```

### Troubleshooting

**myenv command not found:**
```bash
source ~/.bashrc
# Or just use the full command:
source ~/.personal_config/activate
```

**Tmux conflicts:**
- Make sure you're using `Ctrl+b` on remote
- Use `F12` to temporarily disable local tmux
- Check status bar for "REMOTE" indicator

**Permission issues:**
- Script creates everything in your home directory
- No sudo required
- All files owned by your user

## Tips

1. **Create tmux sessions on remote** for persistent work
2. **Use mouse** for quick pane selection in nested tmux
3. **Remember different prefixes** - `Ctrl+a` local, `Ctrl+b` remote
4. **No need to deactivate** - Settings automatically reset when you disconnect
5. **Keep it minimal** - This is for quick debugging, not development

## Important Notes

### Automatic Cleanup
- **Your settings are session-specific** - They disappear when you disconnect
- **No cleanup needed** - Each SSH session starts fresh
- **Other users are never affected** - Even if you forget to deactivate
- **Use `deactivate` only if** - You want defaults back in current session

## Philosophy

This setup follows the principle of "just enough to not be annoying" - providing essential muscle-memory keybindings and basic productivity features without the overhead of a full development environment.