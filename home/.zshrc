# Shared env/aliases/functions (bash + zsh)
[ -f ~/.shell_common ] && source ~/.shell_common

# Agent shells (no TTY on stdin): relax two zsh-isms that abort commands
# agents routinely write — words starting with "=" (=cmd expansion, e.g.
# unquoted `echo === done ===`) and unmatched globs erroring instead of
# passing through like bash. Real terminals keep normal zsh behavior.
if [[ ! -t 0 ]]; then
  unsetopt equals nomatch 2>/dev/null
fi

# Completions (includes Docker CLI completions if present)
[[ -d "$HOME/.docker/completions" ]] && fpath=("$HOME/.docker/completions" $fpath)
autoload -Uz compinit
compinit

# FZF integration
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# mise: per-project tool versions (replaces nvm). Interactive shells get a
# hook that switches versions on cd; agent shells (no TTY) get shims, which
# pick the version when the command runs and need no prompt hook.
if command -v mise >/dev/null; then
  if [[ -t 0 ]]; then eval "$(mise activate zsh)"; else eval "$(mise activate zsh --shims)"; fi
fi

# Zoxide (better cd)
eval "$(zoxide init zsh)"

# Atuin (better shell history)
[[ -f /opt/homebrew/bin/atuin ]] && eval "$(atuin init zsh)"

# Prompt (config: ~/.config/starship.toml)
command -v starship >/dev/null && eval "$(starship init zsh)"

# ZSH plugins (syntax highlighting must be sourced last)
source ${HOMEBREW_PREFIX:-/opt/homebrew}/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source ${HOMEBREW_PREFIX:-/opt/homebrew}/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
