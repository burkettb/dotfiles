---
name: checkpoint
description: Close out a thread so the next one starts where this one stopped. Writes a thread card to DevCenter, moves task statuses, renames the session after its outcome, and lists Brandon's action items. Use when Brandon says checkpoint, wrap up, wrap this thread, park this, save where we are, or before splitting a long or drifting thread into a new one.
---

# Checkpoint

A thread's memory dies with the thread unless it lands in DevCenter. The next session in a project loads DevCenter at startup, so a checkpoint is how "what was done vs. not" survives. The job is to record the state of the work accurately, not to narrate the conversation.

## 1. Find the project

Run `devcenter status` from the repo this thread worked in. Threads often start in a parent folder (`~/dev`, `~/dev-icfcorp`) and touch one or more repos below it; checkpoint each repo that had real work, one card per repo. If a repo has no DevCenter project, say so and ask whether to attach it. Don't attach on your own.

No repo at all (a scratch or research thread): skip the DevCenter writes, still produce the card in chat, and rename the session.

## 2. Build the card from evidence

Reread the thread from its first message. The first ask is the goal, even if the thread drifted. Then check the facts against the tree, not against your memory of the conversation: `git status -sb`, `git log --oneline` since the thread began, `git stash list`, and the open PR/MR for the branch. Something counts as done only if a check in this thread proved it (a test run, a page load, a merged PR). Everything else is open or unverified, and the card says which.

```
Goal: <the original ask, one line>
Done: <what's finished, each with its proof: commit, PR, test run>
Open: <what's not done or not verified, and where it stands>
Decisions: <choices made and why, only ones a future thread would otherwise re-litigate>
Your move: <what only Brandon can do: review, run, decide, tell whom; or "nothing">
Next: <the first thing the next thread should do, with file paths and branch>
```

Every line is a fact a stranger could act on. Name branches, files, PR numbers, task IDs. Drop Done, Open, or Decisions when empty instead of writing "none"; always keep Your move and Next.

## 3. Write it to DevCenter

From the repo directory:

1. `devcenter task list`. For each task this thread touched: `devcenter task done <id>` only when Done proves it; otherwise `devcenter task set <id> in_progress` or `blocked`. Follow-up work the thread discovered becomes `devcenter task add "<title>" --notes "<why, where>"`, unless a task already covers it.
2. `devcenter log "<entry>"`: the card condensed to one entry in the style of the existing `agent-log.md` (what was done, how it was verified, what's next, task IDs).
3. If the project's state or next steps changed, edit the matching lines of `.devcenter/context.md` and bump "Last reviewed". Edit it; don't append a diary.
4. Durable decisions go in `.devcenter/decisions.md` as a dated bullet with the reason.
5. `devcenter sync`, as its own command (it's pre-authorized). If it fails (offline, VPN), say so and leave the changes for the next sync.

## 4. Rename the session

If the app's session-title tool is available (`set_session_title`, loaded through ToolSearch), rename this session after its outcome, not its opening question: "Tenure bulk upload: fixed, PR #61 open" beats "Bulk upload issue". Keep it under 60 characters. Skip this step outside the desktop app.

## 5. Report

Print the card. Then one line on what changed in DevCenter: which tasks moved to which status, whether context.md or decisions.md changed, and the sync result. If the thread is about to move on to different work, or it's long enough that a fresh start would help, offer a new session seeded with the card's Goal, Open, Decisions, and Next lines instead of continuing here.

A checkpoint never archives the session, pushes code, or closes PRs.
