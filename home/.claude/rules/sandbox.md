# Claude Code sandbox

- These tools run outside the sandbox by policy (`sandbox.excludedCommands`), but only when the tool is the entire Bash call: `git commit|tag|fetch|pull|push|cherry-pick|rebase`, `gh`, `glab`, `devcenter`, `docker`, `codex`, `aws`, `ssh`, `scp`, `rsync`. Issue each as its own call: no `&&`/`;` chain, pipe or `$( )`; a single leading `cd <repo> &&` or `git -C <repo>` is fine. Put `git log`, `git status`, or `tail` in the next call. Never set `dangerouslyDisableSandbox` for them; the PreToolUse hook denies it on a chained call.
- The approval explanation goes in the Bash `description` field: one or two plain sentences, not a 5-word label.
