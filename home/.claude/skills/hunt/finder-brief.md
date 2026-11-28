# Finder brief

Fill in the brackets and send this as the finder's whole task.

---

Scan [repo path] for problems worth fixing, using these check files: [paths to checks/*.md]. Project context: [one line from project.yaml summary and stack]. Skip anything already covered by these open tasks: [titles]. Extra checks, skips and ignored paths from the project's hunt file: [hunt.md contents or "none"]. Deadline: [time]. Stop starting new checks after it.

First, in your own worktree, run `git fetch origin` and then `git checkout --detach origin/[default branch]`. Record the SHA. All evidence comes from that commit.

Rules:
- Don't edit tracked files, commit, push, install global tools, or start subagents. Installs, builds and tests may write to the worktree's usual dependency and build output folders, and nothing else.
- Never run anything that deploys, publishes, reaches production or real third-party accounts, or needs secrets. Tests that need real credentials count as not run.
- Give every command a timeout: 10 minutes for builds and tests, 3 for everything else. A timeout is "not run: timed out", not a finding.
- If a command needs the network and fails, or a tool is missing, write it down as not run.
- Never print secret values. Give the file, line and type only.
- Run the command checks first, then the judgment checks.
- Every finding needs evidence: the exact command plus a short excerpt of its output, or a `file:line` plus how the failure happens. No evidence, no finding.
- Don't report style preferences, nits, or "could be cleaner". Report what is broken, unsafe, outdated per the check's own threshold, or missing per the check's own definition.
- Group findings that share one cause into one finding.

Reply in exactly this shape:

```
REPO: <path> at <SHA>
RAN: <check-id>: <command or "judgment">: <pass | n findings>
NOT RUN: <check-id>: <reason>
FINDINGS
  <check-id> high|medium|low reproduced|pointed|suspected
    title: <imperative, specific>
    problem: <what goes wrong, for whom>
    evidence: <file:line / command + short excerpt>
    fix: <smallest change>
    check: <command or observation that proves the fix, or "none">
    size: S|M|L   risk: low|medium|high <what the fix could break>
```
