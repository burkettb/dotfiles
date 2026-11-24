# Shared by every machine. Linked to ~/.Brewfile, so run: brew bundle --global
# Every CLI and dev tool goes here, plus apps wanted on any Mac (work included).
# Personal-life apps live in ~/.dotfiles/Brewfile.personal.

# Core
brew "git"
brew "tmux"
brew "neovim"
brew "mise"                 # Per-project node/pnpm/python/java versions (~/.config/mise)

# Shell
brew "starship"             # Prompt (~/.config/starship.toml)
brew "zsh-autosuggestions"
brew "zsh-syntax-highlighting"
brew "atuin"                # History search on Up arrow and Ctrl-R
brew "fzf"                  # Fuzzy picker (tmux-sessionizer, nvim, Ctrl-T)
brew "fd"                   # Faster find; feeds fzf and nvim's file picker
brew "ripgrep"              # Faster grep; nvim search, agents
brew "ripgrep-all"          # rg inside PDFs, docs, archives (fif, tmux prefix g)
brew "poppler"              # pdftotext, so rga can read PDFs
brew "eza"                  # ls replacement (ls wrapper in .shell_common)
brew "bat"                  # cat with syntax highlighting (cat alias)

# Neovim: enables whichever language servers are installed
brew "tree-sitter-cli"      # Builds nvim-treesitter parsers
brew "lua-language-server"
brew "stylua"
brew "typescript-language-server"
brew "gopls"
brew "ruff"                 # Python lint, format, and language server

# Languages
brew "go"
brew "python"
brew "uv"                   # Python packages, venvs, CLI apps (uv tool install)

# CLIs
brew "gh"
brew "jq"                   # Required by agent-doctor, agent-bootstrap, guard-bash.sh
brew "awscli"
brew "opentofu"             # tofu: open-source Terraform fork (homelab-infra)
brew "ansible"              # homelab-infra playbooks
brew "kubernetes-cli"       # kubectl for the homelab cluster
brew "rclone"               # Cloud storage sync (homelab tfstate backups)
brew "ffmpeg"
brew "mas"                  # Mac App Store installs (mas lines in Brewfile.personal)

# portless: *.test hostnames for local dev servers
brew "caddy"                # Reverse proxy with automatic local HTTPS
brew "dnsmasq"              # Resolves *.test to this Mac
brew "mkcert"               # Locally trusted certificates

# Apps
cask "docker-desktop"       # Ships the docker, docker compose, and kubectl CLIs
cask "iterm2"
cask "visual-studio-code"
cask "codex"
cask "t3-code@nightly"
cask "claude"
cask "chatgpt"
cask "linearmouse"
cask "secretive"            # SSH keys in the Secure Enclave (auth + commit signing)
cask "bitwarden"
cask "firefox"
cask "google-chrome"

# Fonts
cask "font-meslo-lg-nerd-font"   # iTerm's font
