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

# fzf keybindings: Ctrl-T files, Alt-C dirs. Atuin, loaded later, takes Ctrl-R.
command -v fzf >/dev/null && source <(fzf --zsh)

# mise: per-project tool versions (replaces nvm). Interactive shells get a
# hook that switches versions on cd; agent shells (no TTY) get shims, which
# pick the version when the command runs and need no prompt hook.
if command -v mise >/dev/null; then
  if [[ -t 0 ]]; then eval "$(mise activate zsh)"; else eval "$(mise activate zsh --shims)"; fi
fi

# Atuin (better shell history)
[[ -f /opt/homebrew/bin/atuin ]] && eval "$(atuin init zsh)"

# Flag anything in ~/.dotfiles that needs attention (silent when all is well)
[[ -t 0 ]] && command -v dotfiles-status >/dev/null && dotfiles-status

# Prompt (config: ~/.config/starship.toml)
command -v starship >/dev/null && eval "$(starship init zsh)"

# Inside tmux, mark where each command's output starts (OSC 133;C) so the
# prefix y / Y bindings in .tmux.conf can find and copy it
if [[ -n $TMUX && -t 0 ]]; then
  autoload -Uz add-zsh-hook
  _tmux_mark_output() { print -n '\e]133;C\e\\' }
  add-zsh-hook preexec _tmux_mark_output
fi

# ZSH plugins (syntax highlighting must be sourced last)
source ${HOMEBREW_PREFIX:-/opt/homebrew}/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source ${HOMEBREW_PREFIX:-/opt/homebrew}/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
