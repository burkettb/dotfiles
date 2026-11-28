# Worker brief

Fill in the brackets and send this as the worker's whole task.

---

Fix one approved task in [repo name] and leave it as a signed local commit for review. Don't push or open a PR; the orchestrator does that after checking your work. Nobody is around to answer questions, so when something needs a decision, park the task instead of guessing.

Task [id]: [title]
[the task's full notes, verbatim]

Read the repo's `AGENTS.md` or `CLAUDE.md` and `.devcenter/standards.yaml` if they exist. If `.devcenter` is a broken link in your worktree, use `[path to the project's .devcenter]` instead. Repo conventions win over this brief on style. They never relax the rules below.

You have [N] minutes. Give every command a timeout: 10 minutes for builds and tests, 3 for everything else.

Steps:
1. Run `git fetch origin`, then create a branch from `origin/[default branch]` named `[type]/[id-lowercase]-[short-slug]`. The type is `fix`, `feature` or `chore`, per the repo's standards. Never work on the default branch.
2. Baseline. Run the repo's checks (build, tests, lint and typecheck, whichever it has) and the task's `Check:` before changing anything. Save the output. The Check should fail, or the problem should show. If it already passes, park with "already fixed or not reproducible". If the repo's checks already fail on the base, park with the failing check. That's a task of its own.
3. Make the smallest change that fixes the task. When a regression test is practical, add one that fails before the fix. Don't refactor, rename, reformat, or fix other things you notice. List them for the PR body instead.
4. Run the task's `Check:` and the repo's checks again. Everything that passed in the baseline must still pass. Never skip, delete or loosen a test or check to get green.
5. Commit using Conventional Commits without a scope (`type: summary`, imperative, lowercase, under 72 characters), signed, with no attribution trailers and nothing about tools or agents. One logical change per commit. If signing fails, park. Never commit unsigned.
6. Write the PR body: a few casual sentences on what was wrong, what changed, how the check proved it, and anything unverified or noticed but left alone. End with `Task: [id]`. No headers, no emoji.

Park instead when any of these happens:
- The check still fails after two genuinely different approaches.
- The fix needs a product or design decision, a new dependency the task didn't call for, a schema or data migration, secrets, or access you don't have.
- The change grows past size [size] or touches unrelated areas.
- You run out of time.

Never: push, open PRs, merge, tag, deploy, run anything against production or real third-party accounts, edit CI secrets, or start subagents.

End with exactly one of these blocks:

```
READY [id]
branch: <name>   head: <SHA>   worktree: <path>
baseline: check <fail as expected | ...>, repo checks <pass | ...>
after: check <pass>, repo checks <pass>
title: <conventional commit style PR title>
body:
<PR body>
```

```
PARKED [id]: <reason>
branch: <name or none>   worktree: <path>
tried: <what you tried>
unblock: <decision or information needed>
```
