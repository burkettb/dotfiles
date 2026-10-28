#!/usr/bin/env bash
# PreToolUse guard for Claude Code Bash calls. Reads the hook JSON on stdin and
# prints one decision JSON line on stdout. Three rules:
#   1. deny any command that touches a credential store, sandboxed or not
#   2. deny dangerouslyDisableSandbox on an excluded tool used in a compound call
#      (sandbox.excludedCommands only matches a standalone call, so the bypass is
#      the wrong fix; the right fix is to re-issue the tool alone)
#   3. force a prompt ("ask") for remote-server, cloud-account and history writes
# Anything else falls through (exit 0, no output) to the normal permission flow.
# The hook fails open: a crash or timeout lets the call proceed with a notice.
# Dry run:
#   echo '{"tool_input":{"command":"cat ~/.aws/credentials"}}' | ~/.claude/hooks/guard-bash.sh
set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
command -v jq >/dev/null 2>&1 || exit 0

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2>/dev/null) || exit 0
off=$(printf '%s' "$input" | jq -r '.tool_input.dangerouslyDisableSandbox // false' 2>/dev/null) || off=false
[ -n "$cmd" ] || exit 0

decide() {
  jq -cn --arg d "$1" --arg r "$2" \
    '{hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:$d,permissionDecisionReason:$r}}'
  exit 0
}

# 1. credential stores (~/.ssh/config, known_hosts and ~/.aws/config are not matched on purpose)
if printf '%s' "$cmd" | grep -Eq '(~|\$HOME|/Users/[^/ ]+)/\.(aws/(credentials|sso|cli)|gnupg|ssh/(id_[^ ]*|[^ ]*\.pem)|docker/config\.json|netrc|git-credentials)|Library/Keychains|security +(find|dump)-(generic|internet)-password|\bssh-add\b|ssh-keygen +-y'; then
  decide deny "Credential store path or key operation. These are denied on purpose; ask Brandon for the non-secret part (profile name, host alias) or ask him to run the command himself."
fi

# 2. excluded tools must be standalone calls. A single excluded command carrying
#    only a leading "cd <dir> &&" or a "git -C <dir>" is tolerated: the harness
#    resets cwd after every call, so cross-repo work has no other way to target
#    the repo, and nothing else rides along under the flag.
excl='(^|[;&|(]|\$\() *(ssh|scp|rsync|gh|glab|devcenter|docker|codex|aws)\b|\bgit +(commit|tag|fetch|pull|push|cherry-pick|rebase)\b'
compound='&&|\|\||;|\||\$\(|`'
rest=$(printf '%s' "$cmd" | sed -E 's/^[[:space:]]*cd[[:space:]]+[^;&|]+&&[[:space:]]*//')
if [ "$off" = "true" ] && printf '%s' "$rest" | grep -Eq "$excl" && printf '%s' "$rest" | grep -Eq "$compound"; then
  decide deny "This tool is in sandbox.excludedCommands and already runs outside the sandbox when it is the whole call. Re-issue it alone: no && or ; chain, no pipe, no \$( ). A single leading 'cd <repo> &&' or 'git -C <repo>' is fine when the repo is not the working directory. Put git log/status/tail in the next call."
fi

# 3. outward or destructive actions get a prompt with context
outward='\bssh\b.*\b(sudo|rsync|rm |mv |cp |chown|chmod|systemctl|nohup|tee )'
outward="$outward"'|\baws +(ec2 +(start|stop|reboot|terminate|modify|create|delete)|ecs +(update|run-task|stop-task|create|delete|register|deregister)|rds +(modify|delete|reboot|restore|create|start|stop)|iam +(create|put|attach|detach|delete|update|add|remove)|s3 +(rm|sync|cp|mv|rb)|s3api +(put|delete|create)|secretsmanager +(put|update|create|delete|rotate)|ssm +(put|delete|send-command|start-automation)|lambda +(invoke|update|create|delete)|wafv2 +(update|associate|disassociate|create|delete|put)|elbv2 +(create|modify|delete|register|deregister|set)|scheduler +(create|update|delete)|cloudformation +(create|update|delete|deploy)|eks +(update|create|delete)|route53 +change)'
outward="$outward"'|\bterraform +(apply|destroy|import)|\bgh +pr +(close|reopen|merge)|\bglab +mr +(close|merge|reopen)|\bglab +api +.*(--method|-X) +(PUT|DELETE)'
outward="$outward"'|\bgit +push\b.*(--force|-f\b|:refs/heads/)|\bgit +(branch +-D|stash +drop|reset +--hard|rebase +--root|filter-repo|filter-branch)'
if printf '%s' "$cmd" | grep -Eq "$outward"; then
  decide ask "Outward or destructive action. Name the approved plan step it belongs to before Brandon confirms."
fi
exit 0
