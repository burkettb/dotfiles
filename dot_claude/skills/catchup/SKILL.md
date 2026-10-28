---
name: catchup
description: Rebuild where a project stands after time away, from DevCenter tasks and context, local git state, CI, open PRs/MRs, and what the last few threads left unfinished. Ends with Brandon's action items. Use when Brandon asks for the status of a repo or project, what's left, where he left off, what he needs to do, or says it's been a while since he touched something. Read-only.
---

# Catch up

Brandon is coming back to a project and wants to know where it stands and what's his to do, in about a minute of reading. Gather state from every place it lives, check the sources against each other, and report. Read-only: change nothing in his work or in DevCenter, and offer fixes at the end.

## 1. Pick the scope

The repo in the current directory, or the one Brandon names. From a parent folder (`~/dev`, `~/dev-icfcorp`), ask which project unless the question names one or covers all of them; for "all", give each repo a short block. When an action item points into another repo (an ops repo pinning this app's image, a server holding its files), name that repo in the item; `devcenter list` shows related projects. Don't search the disk for other clones.

## 2. Gather

Run independent reads in parallel. Any source can be stale; step 3 deals with that.

- Freshness: `git fetch` as a standalone command, so remote branches and upstream drift are current. If it fails (VPN, auth), say how old the remote data is (`stat -f %Sm .git/FETCH_HEAD`) and carry on.
- DevCenter: `devcenter task list` gives only ID, status, and title, so also read `.devcenter/tasks.yaml` for branches and notes. Read `.devcenter/context.md`, the 3 most recent dates in `.devcenter/agent-log.md` (the file isn't always in order), and the headings of `.devcenter/decisions.md`. Not attached: say so and continue with the rest.
- Local git: `git status -sb`, `git worktree list`, `git log --oneline -15` on the default branch, and every local branch with its last commit and upstream drift: `git for-each-ref --sort=-committerdate refs/heads --format='%(refname:short) %(committerdate:short) %(upstream:track)'`. Take the default branch from `git symbolic-ref refs/remotes/origin/HEAD`; if that points at a deleted branch, ask the host (`gh repo view -R <owner/repo> --json defaultBranchRef`). For each stash, list its files with `git stash show --include-untracked --name-only stash@{N}`. A stash is often the only copy of work that "vanished".
- CI: what's live comes from the last deploys, not the task list. `gh run list -R <owner/repo> --limit 10`; when a run on the default branch or a tag failed overall, `gh run view <id> -R <owner/repo> --json jobs` shows whether the deploy job itself passed. On GitLab, `glab ci list`.
- PRs/MRs: on GitHub, `gh pr list -R <owner/repo> --author @me` and `gh pr list -R <owner/repo> --search review-requested:@me`; on GitLab, `glab mr list --author=@me` and `glab mr list --reviewer=@me`. Run every `gh`, `glab`, and `git fetch` as a standalone command, not chained after `cd`, so it falls under the sandbox exclusions. GitLab unreachable or 403: run `vpncheck`, report it, and continue without MR data. If `gh` can't see the repo, name the active account from `gh auth status` and continue. Don't switch accounts.
- Past threads, when the app's session tools are available (load them through ToolSearch): `list_sessions` with `include_archived: true` (inactive threads auto-archive after 14 days), filtered to sessions whose cwd is this repo or its parent folder. Then `search_session_transcripts` with `include_archived: true` on distinctive terms (task IDs, branch and tag names, file names), not the repo name, which also matches the project list in every system prompt. For the 2 or 3 most relevant threads, `list_events` with a limit of about 20; if the tail is wordsmithing or chatter, page back with `before_uuid` until you reach the last real conclusion and anything it left for Brandon.

## 3. Reconcile

The useful findings are where sources disagree:

- Tasks `in_progress` or `next` with no matching branch or recent commits.
- Branches, stashes, or uncommitted work that no task mentions.
- PRs merged or closed while their task is still open; tasks marked done whose branch never merged.
- Deploys or releases that no log entry or task records.
- Action items a past thread handed Brandon that nothing shows as done.
- Lines in context.md that the git history or CI contradicts.

## 4. Report

Use this shape. Aim for under 250 words: keep the loose ends that change what Brandon does next and offer the rest as a longer list. Drop any line with nothing under it.

```
<project>: <what it is and its current focus, one line>

Where it stands: <2-4 lines: what was done recently, what's live per CI>
In flight: <branch / PR / task, its state, last touched date>
Your move: <ranked, at most 5, each concrete: what only Brandon can do>
Loose ends: <at most 5: stashes, unpushed or uncommitted work, stale branches, drift>
READ: <at most 2 things he must understand before acting, only if they exist>
Start with: <the one next step, and whether to do it here or in a fresh thread>
```

Then list the DevCenter fixes the reconcile step turned up. The CLI covers `devcenter task add "<title>" --notes "..."`, `devcenter task start|done <id>`, `devcenter task set <id> <backlog|next|in_progress|blocked|done>`, and `devcenter log "<entry>"`. Context, notes, and decision changes are direct edits to `.devcenter/` files, so show them as the exact old and new lines. Apply nothing unless he says yes.
