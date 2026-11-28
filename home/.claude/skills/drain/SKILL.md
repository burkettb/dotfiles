---
name: drain
description: Work through approved DevCenter tasks without Brandon. Each eligible `next` task with an objective done-check gets its own worktree and branch, a fix proven by that check, a review by the orchestrating agent, and a draft PR for Brandon. Use when Brandon says drain, drain the backlog, work the queue, burn usage on the backlog, or run the overnight or pre-reset drain.
---

# Drain

Turn tasks Brandon already approved into draft PRs he can review in the morning. The approval comes from triage: a task he moved to `next` on the board. Drain never decides what's worth doing. It does what was approved, proves each fix with the task's own check, and parks anything that turns out to need a decision.

You orchestrate, and you're the only one who publishes. Workers fix and commit locally. You check every result before anything leaves the machine.

Brandon asking for a drain, or scheduling one, authorizes this flow, the same way "ship" does for the ship skill. For each task it works, that covers pushing its feature branch and opening a draft PR, after you've verified it. It never covers pushing to the default branch, force-pushing, merging, tagging, deploying, or touching tasks outside the selection.

## Settings

Brandon says these in plain words. Defaults in brackets.

- **Scope** [the current project]. "Everything" means all DevCenter projects with status `active`.
- **Task cap** [6 per run]. Keeps the morning review to an amount he can actually read. Even when asked for more, go to at most 12.
- **Concurrency** [3 workers at a time].
- **Deadline** [none]. A worker gets 90 minutes, or the time left before the deadline minus 20 minutes, whichever is shorter. Don't start a task when that comes to under 45 minutes.
- **Include** [S and M size, low and medium risk]. "Include the big ones" adds L. High risk always needs Brandon to name the task.

## 1. Reconcile the last run

A crashed or cancelled run leaves tasks claimed. Before selecting anything, check every `in_progress` task in scope whose notes have a `Drain <run-id> ... claimed` line but no `PR:` line:

- A PR already exists for its branch (`gh pr list --head <branch>`): record it (step 6) and leave the task `in_progress`.
- A local branch with commits exists but there's no PR: mark the task `blocked`, with a note naming the branch and saying the earlier run died before publishing. Brandon decides what happens to it.
- Nothing exists and the claim is more than 12 hours old: move it back with `devcenter task set <id> next`.

If a project's `tasks.yaml` doesn't parse, skip the project and report it.

## 2. Select

From each project in scope, take the `next` tasks whose notes have all three of these:
- a `Check:` line that is a local command or concrete observation. A check that deploys, publishes or touches real services doesn't count.
- a `Size:` line
- a `Risk:` line

Both size and risk have to fit the settings. A task missing any of these lines gets skipped and goes in the report as "needs check, size and risk", so Brandon can add them. Tasks from the hunt skill already have this shape. Tasks Brandon writes himself work too, as long as they have these lines.

Order the selection by priority, then size, smallest first. Within one repo, take only tasks whose likely files don't overlap, and leave the rest for the next run.

Also skip, and report with the reason, any task that:
- belongs to a project whose repo has no remote
- says it's waiting on something or someone
- needs secrets, accounts, devices, real user data or production access.

## 3. Preflight (once per run)

Stop the affected repos, or the whole run, when any of these fails:

- `gh auth status` succeeds. Run it as the entire command so it runs outside the sandbox.
- Signing works in each repo, with that repo's own config. Run `git commit-tree -S -m drain-preflight HEAD^{tree}` from inside the repo. It creates an unreferenced signed object and changes nothing else. In Claude Code it has to run outside the sandbox, because it reads the signing public key under `~/.ssh`. `git commit` itself is exempt from the sandbox, so workers aren't affected. If it fails or hangs past 30 seconds, skip that repo. Pushed commits are never unsigned.
- Each repo has a T3 project, found with `t3_project_list` by `workspaceRoot`. If one is missing, create it with `t3_project_create` for the repo path.
- The repo's default branch is known (`git remote show origin`).
- `orchestrator_capabilities` lists the worker model. Call it once.

## 4. Claim and dispatch

Claim a task right before starting its worker, not earlier. First re-read its `tasks.yaml`. If the task isn't `next` any more, Brandon or another run changed it, so skip it. Otherwise:
1. Run `devcenter task start <id>` from inside the repo.
2. Add `Drain <run-id> <ISO time>: claimed` to the task's notes. The run id is the start time, like `20261128T0200`.

Start the worker with `delegate_task`:
- `role: implementation`
- `isolation: worktree`
- `target.projectId` set to the task's T3 project
- the effort in `target.options`
- the brief from `worker-brief.md`, filled in

Use the current model unless Brandon named one. Keep at most the concurrency number running. Follow each worker's `next` instead of polling, and `task_cancel` any worker that runs past its time.

## 5. Verify before publishing

A worker ends with `READY` (a local branch, commits and a PR body) or `PARKED`. For a `READY` worker, check all of this in the repo before pushing anything:

1. The branch's merge base with `origin/<default>` is a recent commit on the default branch, and `git log --format='%G? %H %s' origin/<default>..<branch>` shows only signed commits (`G` or `U`) with conventional messages.
2. `git diff --stat origin/<default>...<branch>` touches only files that fit the task. Read the full diff once against the task's Problem and Check. Park the task when the diff fixes something else, grows well past its size, or weakens, skips or deletes tests or checks.
3. The worker's report shows the Check failing before the fix and passing after, and the repo's checks passing. If you have time, re-run the Check yourself in the worker's worktree.

Then publish. Run `git push -u origin <branch>` as its own command, then `gh pr create --repo <owner/name> --base <default> --head <branch> --draft --title "<conventional title>" --body-file <file with the worker's body>`. Confirm with `gh pr view <url> --json isDraft,baseRefName,headRefName`.

## 6. Record

For a published task, in its `.devcenter/tasks.yaml`, set `branch` and add `PR: <url>` to the notes. It stays `in_progress` until the PR merges. Keep the YAML valid, since the board reads it. Link every PR to this thread with `link_pull_requests`.

For a parked task, run `devcenter task set <id> blocked` and add a `Parked <date>:` note line: why, what was tried, the local branch if it holds useful work (never pushed), and what decision or information would unblock it. Never retry a parked task in the same run.

## 7. Report

End with one message Brandon can read in two minutes:

- Opened: one line per PR with project, task id, title, PR link, check result, and anything unverified.
- Parked: task id, why, and what would unblock it.
- Skipped: task id and reason, grouped by reason.
- Not started: anything that ran out of cap or time. Move claimed tasks that never got a worker back to `next`.
- Problems: unparseable task files, and repos that failed preflight.

Add one `devcenter log` line per project touched, then run `devcenter sync`.

## Scheduling

When Brandon wants this unattended, create it with T3's `schedule_task`, using `fixed_time` on the evening before his weekly usage resets. Ask him which day if he hasn't said. Pass `environmentId` for argo when he wants it to run there; argo is the always-on box, and its sandbox won't stall on prompts. Example prompt: "Use the drain skill on all active DevCenter projects, cap 8, concurrency 3, finish by 6:00." Before relying on a schedule, do one supervised run on the machine that will run it. Preflight failures there (gh auth, signing, permissions) are the usual way an overnight run dies.
