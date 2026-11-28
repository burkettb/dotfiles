#!/usr/bin/env bash
# Codex PreToolUse adapter for ~/.claude/hooks/guard-bash.sh. Codex sends the
# same payload (tool_input.command, cwd) and accepts the same deny JSON, but not
# "ask": it marks the hook failed and runs the command. So for "ask" (and for a
# write through gh api, which the guard leaves to Claude's permission rules):
#   - if ~/.codex/rules/*.rules already prompt for the command, stay quiet and
#     let Codex prompt, passing the guard's reason along as context
#   - otherwise deny, so Codex reissues it in a form the rules catch or hands
#     Brandon the command
# Fails open like the guard itself.
# Dry run:
#   echo '{"tool_input":{"command":"git push origin main"},"cwd":"'"$PWD"'"}' | ~/.codex/hooks/guard-bash.sh
set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
command -v jq >/dev/null 2>&1 || exit 0
guard="$HOME/.claude/hooks/guard-bash.sh"
[ -x "$guard" ] || exit 0

# tool_input.command is a string today; join an argv array just in case
input=$(jq -c '.tool_input.command |= (if type == "array" then join(" ") else . end)' 2>/dev/null) || exit 0
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""') || exit 0
out=$(printf '%s' "$input" | "$guard") || exit 0
decision=$(printf '%s' "$out" | jq -r '.hookSpecificOutput.permissionDecision // empty' 2>/dev/null)
reason=$(printf '%s' "$out" | jq -r '.hookSpecificOutput.permissionDecisionReason // empty' 2>/dev/null)

if [ -z "$decision" ] && printf '%s' "$cmd" | grep -Eq '\bgh +api\b.*(-X|--method)[ =]*(POST|PUT|PATCH|DELETE)\b'; then
  decision=ask reason="gh api write."
fi
case $decision in
  ask) ;;
  "") exit 0 ;;
  *) printf '%s\n' "$out"; exit 0 ;;
esac

# Does Codex's own policy prompt for this exact argv?
rules=()
for f in "$HOME"/.codex/rules/*.rules; do [ -f "$f" ] && rules+=(--rules "$f"); done
policy=""
if [ ${#rules[@]} -gt 0 ] && command -v codex >/dev/null 2>&1; then
  set -f; argv=($cmd); set +f
  policy=$(codex execpolicy check "${rules[@]}" -- "${argv[@]}" 2>/dev/null | jq -r '.decision // empty' 2>/dev/null)
fi
if [ "$policy" = prompt ] || [ "$policy" = forbidden ]; then
  jq -cn --arg r "$reason" '{hookSpecificOutput:{hookEventName:"PreToolUse",additionalContext:("Guard: " + $r)}}'
else
  jq -cn --arg r "Needs Brandon: $reason Codex hooks can't prompt. Reissue it alone with the flag or target right after the subcommand (git push -f origin x, git push origin main, gh api -X POST <path>) so the rules prompt, or give Brandon the exact command." \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",permissionDecisionReason:$r}}'
fi
exit 0
