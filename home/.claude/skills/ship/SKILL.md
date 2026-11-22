---
name: ship
description: Branch, commit, push, and open a PR/MR for work Brandon has already reviewed. Use only when Brandon explicitly says ship, ship it, or asks for a branch plus commit plus PR. Never invoke this on your own after finishing changes.
---

# Ship

Brandon has reviewed the changes and said ship. That sentence is his push authorization for this flow; nothing else ever is.

1. Read `.devcenter/global-standards.yaml` and `.devcenter/standards.yaml` if present, plus any repo contributing docs. Repo conventions beat everything below.
2. `git fetch`, then branch from `origin/main` (or the repo's default branch), never from the current HEAD, which may sit on another fix branch. Default naming: `feature/`, `bugfix/`, `chore/`, or `experiment/` plus a short kebab-case slug.
3. Commit. Split by concern: if the work mixes a fix and a refactor, or touches two unrelated areas, make separate commits rather than one mixed one. Conventional Commits without scope (`type: summary`), imperative, lowercase, under 72 characters, no trailing period, no body unless truly needed. The message describes the change, never the tooling or process that produced it. No attribution trailers.
4. Push, as its own command, never chained onto anything else.
5. Open the PR/MR. Write the title and description through the write-like-me skill: look at the repo's recent PRs first and match their length and shape. Say what changed and why, anything the reviewer should know, and how it was tested if non-obvious. A real PR, not a draft, unless Brandon or the repo says otherwise.
6. Stop. Report the branch name and the PR link. Don't merge, don't tag, don't deploy, don't start follow-up work.

If anything blocks the flow (push rejected, VPN down, conflicts with the base branch), report exactly where it stopped and what state things are in. Don't loop on retries and don't improvise around the blocker.
