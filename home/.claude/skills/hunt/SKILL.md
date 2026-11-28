---
name: hunt
description: Scan one or more repos for real, actionable problems (bugs, failing checks, outdated or vulnerable dependencies, missing tests, release and config gaps) using stack-specific check lists, verify every finding, and file only the best ones as DevCenter inbox tasks for Brandon to triage. Never fixes anything. Use when Brandon asks to hunt, scan, sweep or audit a repo or all his projects for problems, find bugs, build up a backlog, or run the weekly hunt.
---

# Hunt

Find problems worth fixing and turn them into tasks Brandon can approve in seconds and the drain skill can finish without him. This skill changes no code. The only things it writes are DevCenter tasks, the per-project hunt file and logs.

A hunt that files 40 vague tickets has failed even if every one is technically true. Triage time is the cost being saved, so file fewer, better tickets: verified, specific, each with a check that proves it's fixed.

## Settings

Brandon says these in plain words. Defaults in brackets.

- **Scope** [the current repo]. "All my projects" means every DevCenter project with status `active` (`devcenter list`). Paused, archive and archived projects are only included when named. Map a project to its repo by finding the repo under `~/dev` whose `.devcenter` link points at that project.
- **Ticket cap** [8 per repo, 25 per run]. This is the main limit, because it bounds triage time. "Go light" means 4 per repo. Never raise it past 15 per repo, even when asked for "everything". Put the overflow in the report instead.
- **Deadline** [45 minutes per finder, plus an overall deadline when Brandon gives one, like "until 7am"]. Keep the last 15 minutes of the run for verifying and filing. Cancel any finder still running at its deadline with `task_cancel` and use whatever it already reported. Every command a finder runs gets a timeout: 10 minutes for builds and tests, 3 for everything else.
- **Focus** [all checks]. "Just dependencies", "security only" or "frontend stuff" limits which checks run.

There are no rounds. Each check runs once per repo, per hunt.

## 1. Plan each repo

1. Read the project's `.devcenter/project.yaml` (stack), `context.md`, `tasks.yaml` and `hunt.md` if it exists. If `tasks.yaml` doesn't parse, skip the project and report it. Filing into a broken file would make it worse.
2. Detect the stack from the files too. `project.yaml` can be stale. Use the table below to pick check files from `checks/`. Always include `general.md`.
3. Apply `.devcenter/hunt.md`: its extra checks run, and its skipped checks and ignored paths don't.
4. If no catalog fits a stack, run `general.md` and say in the report which catalog is missing.
5. Run each build and test once. When a stack catalog defines the build or test command, it replaces `general.build-pass` and `general.tests-pass`.

| Signal in the repo | Check file |
|---|---|
| any repo | `general.md` |
| `package.json` | `node.md` |
| a web UI: Next, Vite, Astro, SvelteKit, static HTML | `web-frontend.md` |
| `Package.swift`, `*.xcodeproj` | `swift-apple.md` |
| `pyproject.toml`, `requirements*.txt`, `setup.py` | `python.md` |
| `*.sh`, `bin/`, dotfiles, install scripts | `shell.md` |
| `*.tf`, `docker-compose*`, `Dockerfile`, `ansible/`, k8s manifests | `infra.md` |

## 2. Run the checks

Run one finder per repo, in parallel, at most 4 at a time. Call `orchestrator_capabilities` once, then start each finder with `delegate_task`:
- `role: research`
- `isolation: worktree`
- `target.projectId` set to the repo's T3 project (find it with `t3_project_list`; create one with `t3_project_create` if it's missing)
- the effort in `target.options`

Never run checks in Brandon's working checkout. Builds, installs and dev servers would change his branch and files, and the evidence has to come from the default branch anyway. The finder detaches its worktree at `origin/<default>` and records that SHA.

Brief each finder with `finder-brief.md`, filled in with the check files, the deadline and the project's open task titles so it doesn't re-find them. Finders never fix anything. They never run commands that reach production services, deploy, or need secrets. Tests that need real credentials count as not run.

The command checks (build, tests, audits, outdated reports) run first. They're cheap and objective. Judgment checks come after, and their findings need a `file:line` and an explanation of what goes wrong.

Whenever a command needs the network or a tool that isn't installed, record it as "not run: <reason>". A check that couldn't run is not a finding.

## 3. Verify every candidate

Verify each candidate yourself before it becomes a ticket. Rerun the command, open the `file:line`, and walk the failure through. Rate how sure you are:

- **reproduced**: you ran something and saw it fail.
- **pointed**: the exact line is cited and the failure is walked through step by step.
- **suspected**: plausible, but not shown.

File reproduced and pointed findings. Suspected findings, and anything without a done-check, go in the report's "worth a look" list instead of the inbox, so they don't use up triage time. The one exception is a high-severity suspicion: file it as a question ("Does X leak the token when Y?"), at most 2 per run. Drop everything else and mention the count in the report.

## 4. Choose what to file

1. **Deduplicate** against open tasks and against each other. Merge findings that share a root cause into one ticket, such as "12 minor bumps" or "3 handlers skip input validation".
2. **Skip anything Brandon already rejected.** Each filed ticket carries a fingerprint, `fp: <check-id> <path or package>`, in its notes, and `hunt.md` keeps a `Filed` log of them. A logged fingerprint that no task in `tasks.yaml` still carries was deleted at triage, so treat it as rejected and don't file it again. Match on the fingerprint, never the task id, because DevCenter can reuse an id after a delete. A one-line mention in the report is enough. Re-file a rejected finding only when the evidence changed materially, such as a new CVE or the code now failing outright.
3. **Rank** by severity × confidence ÷ size, and file up to the cap. Severity: high (broken, unsafe, data loss, blocks a release), medium (real cost now), low (real but minor). Don't file nits or style preferences at all.
4. **Every ticket gets a done-check**: a local command or concrete observation that proves the fix and doesn't deploy, publish, or touch real services. A finding without one goes in the "worth a look" list.

## 5. File tickets

From inside the repo, run `devcenter task add "<title>" --priority <high|medium|low> --notes "<notes>"`. That puts the task in `inbox`. Titles are imperative and specific: "Fix undo merging separate adjustment sessions", not "Undo issues". The notes follow this shape exactly, one field per line:

```
hunt <YYYY-MM-DD> at <short SHA>, confidence: reproduced|pointed|suspected
fp: <check-id> <path or package>
Problem: what goes wrong, for whom.
Evidence: file:line, command run, a short excerpt of the output.
Fix: the suggested approach in one or two lines, smallest change first.
Check: the command or observation that passes once it's fixed.
Size: S (under 1h) | M (half a day) | L (more; consider splitting)
Risk: low | medium | high, and what the fix could break.
```

Then append each fingerprint with the date to the `Filed` section of `.devcenter/hunt.md`. Create the file from `hunt-template.md` if it's missing. If a run crashes between the two writes, the next run rebuilds the log from the `fp:` lines in `tasks.yaml`.

## 6. Report

Report in chat, and add one `devcenter log` line per project. Then run `devcenter sync`. The report covers:

- Per repo: tickets filed (id, title, priority, size, confidence), checks run, checks not run and why, and the time used.
- The overflow: verified findings over the cap, one line each, so Brandon can ask for them.
- Worth a look: suspected findings and findings with no done-check, one line each.
- How many candidates were dropped as unverified, how many matched rejected fingerprints, and any missing check catalogs.
- One line telling Brandon to triage on the board. Moving a task to `next` approves it for the drain skill.

## Scheduling

When Brandon asks to run this on a schedule, create it with T3's `schedule_task`, using `fixed_time` with `timeOfDay` and `weekdays`. Pass `environmentId` for argo when he wants it to run there. Put the scope, caps and deadline in the prompt, for example: "Use the hunt skill on all active DevCenter projects, 6 tickets per repo, 25 total, finish by 6:00." Pick a time early enough that he can triage before the drain runs.
