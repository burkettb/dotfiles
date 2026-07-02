# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Powerlevel10k theme (via Homebrew) - MUST be right after instant prompt
source $(brew --prefix)/share/powerlevel10k/powerlevel10k.zsh-theme

# Source common shell configuration AFTER p10k is loaded
[ -f ~/.shell_common ] && source ~/.shell_common

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# Completions (includes Docker CLI completions if present)
[[ -d "$HOME/.docker/completions" ]] && fpath=("$HOME/.docker/completions" $fpath)
autoload -Uz compinit
compinit

# FZF integration
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# Zoxide (better cd)
eval "$(zoxide init zsh)"

# Atuin (better shell history)
[[ -f /opt/homebrew/bin/atuin ]] && eval "$(atuin init zsh)"

# ZSH plugins (syntax highlighting must be sourced last)
source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source $(brew --prefix)/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
