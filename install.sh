#!/usr/bin/env bash

set -euo pipefail

DOTFILES_DIR="$HOME/.dotfiles"
CONFIG_DIR="$HOME/.config"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    log_error "This script is designed for macOS only"
    exit 1
fi

# Install Homebrew if not installed
install_homebrew() {
    if ! command -v brew &> /dev/null; then
        log_info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for Apple Silicon Macs
        if [[ -d "/opt/homebrew" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> "$HOME/.zprofile"
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
        
        log_success "Homebrew installed"
    else
        log_info "Homebrew already installed"
    fi
}

# Install packages from Brewfile
install_brew_packages() {
    log_info "Installing packages from Brewfile..."
    
    if [[ -f "$DOTFILES_DIR/Brewfile" ]]; then
        brew bundle --file="$DOTFILES_DIR/Brewfile"
        log_success "Brew packages installed"
    else
        log_warning "Brewfile not found, skipping package installation"
    fi
}

# Create necessary directories
create_directories() {
    log_info "Creating necessary directories..."
    
    directories=(
        "$CONFIG_DIR"
        "$HOME/.local/bin"
        "$HOME/.local/share"
        "$HOME/.cache"
    )
    
    for dir in "${directories[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_success "Created $dir"
        fi
    done
}

# Backup existing configurations
backup_existing_configs() {
    log_info "Backing up existing configurations..."
    
    backup_dir="$HOME/.dotfiles_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # List of files/directories to backup
    configs=(
        "$HOME/.zshrc"
        "$HOME/.bashrc"
        "$HOME/.gitconfig"
        "$HOME/.tmux.conf"
        "$CONFIG_DIR/nvim"
        "$CONFIG_DIR/tmux"
    )
    
    for config in "${configs[@]}"; do
        if [[ -e "$config" ]]; then
            cp -r "$config" "$backup_dir/" 2>/dev/null || true
            log_info "Backed up $config"
        fi
    done
    
    if [[ -n "$(ls -A "$backup_dir")" ]]; then
        log_success "Existing configs backed up to $backup_dir"
    else
        rmdir "$backup_dir"
        log_info "No existing configs to backup"
    fi
}

# Remove bash configurations
clean_bash_configs() {
    log_info "Cleaning up bash configurations..."
    
    if [[ -L "$HOME/.bashrc" ]]; then
        rm "$HOME/.bashrc"
        log_success "Removed .bashrc symlink"
    fi
    
    if [[ -L "$HOME/.bash_profile" ]]; then
        rm "$HOME/.bash_profile"
        log_success "Removed .bash_profile symlink"
    fi
}

# Stow dotfiles
stow_dotfiles() {
    log_info "Stowing dotfiles..."
    
    cd "$DOTFILES_DIR"
    
    # Directories to stow
    stow_dirs=(
        "aerospace"
        "bin"
        "git"
        "nvim"
        "shell"
        "tmux"
        "zsh"
    )
    
    # Skip bash since you don't use it anymore
    # Skip yabai/skhd since they're problematic
    
    for dir in "${stow_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            log_info "Stowing $dir..."
            stow -v "$dir"
            log_success "Stowed $dir"
        else
            log_warning "Directory $dir not found, skipping"
        fi
    done
}

# Post-installation setup
post_install_setup() {
    log_info "Running post-installation setup..."
    
    # Install tmux plugin manager
    if [[ ! -d "$HOME/.tmux/plugins/tpm" ]]; then
        log_info "Installing tmux plugin manager..."
        git clone https://github.com/tmux-plugins/tpm "$HOME/.tmux/plugins/tpm"
        log_success "TPM installed"
    fi
    
    # Clean up old powerlevel10k installation
    if [[ -d "$HOME/powerlevel10k" ]]; then
        log_info "Removing old powerlevel10k installation..."
        rm -rf "$HOME/powerlevel10k"
        log_success "Old powerlevel10k removed"
    fi
    
    # Set zsh as default shell
    if [[ "$SHELL" != "$(which zsh)" ]]; then
        log_info "Setting zsh as default shell..."
        chsh -s "$(which zsh)"
        log_success "Default shell set to zsh"
    fi
    
    # Install Node.js global packages
    if command -v npm &> /dev/null; then
        log_info "Checking global npm packages..."
        
        # Only install packages not available via Homebrew
        # typescript-language-server, prettier, eslint are installed via Homebrew
        if ! command -v tsc &> /dev/null; then
            log_info "Installing typescript..."
            npm install -g typescript
        else
            log_info "typescript already installed"
        fi
        
        log_success "Global npm packages checked"
    fi
    
    # Install Python packages
    if command -v pipx &> /dev/null; then
        log_info "Installing Python packages..."
        
        # Ensure pipx path is set up
        pipx ensurepath
        
        # Install Python applications via pipx
        # Note: black and ruff are already installed via Homebrew
        # Only need to install neovim Python support
        if command -v pip3 &> /dev/null; then
            # Use pip with --break-system-packages for neovim module only
            pip3 install --user --break-system-packages pynvim
            log_success "Python neovim support installed"
        fi
    else
        log_warning "pipx not found, skipping Python package installation"
    fi
}

# Main installation function
main() {
    echo "🚀 Starting dotfiles installation..."
    echo
    
    # Confirm before proceeding
    read -p "This will install packages and symlink dotfiles. Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Installation cancelled"
        exit 0
    fi
    
    install_homebrew
    install_brew_packages
    create_directories
    backup_existing_configs
    clean_bash_configs
    stow_dotfiles
    post_install_setup
    
    echo
    log_success "🎉 Dotfiles installation complete!"
    echo
    echo "Next steps:"
    echo "  1. Restart your terminal or run: source ~/.zshrc"
    echo "  2. Open tmux and press <prefix>+I to install plugins"
    echo "  3. Open Neovim and wait for plugins to install"
    echo "  4. Configure Rectangle for window management"
    echo
}

# Run main function
main "$@"