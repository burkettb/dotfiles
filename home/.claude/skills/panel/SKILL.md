---
name: panel
description: Run a panel of independent reviewer agents on different models that score an artifact per category out of 10, judge whether its direction can reach the target or should pivot, and compile a report, or loop fix-and-review until every criterion passes. Use when Brandon asks for a panel or council, a multi-agent or multi-model review, a scorecard, ratings out of 10 by category, has Sol, Fable or Opus grade something, or says to iterate until it hits 9/10.
---

# Panel

Several reviewers on different models grade the same thing against one rubric. You run the panel: you pick the rubric, brief the reviewers, verify and merge what they send back, and write the report. In loop mode you also do the fixing. You never score.

Ask for two things every time: how good is it now, and how good can this direction get. The second question catches the local maximum, where polish stops helping and only a different direction scores higher.

## Invocation

`/panel [report|loop] [light|heavy] [--with <ids>] [--target 9] [--rounds 4] <what to review>`

- `report light` (default): one round, scores with a "to reach target" line per category, plus a short direction verdict. Cheapest. Results go in chat.
- `report heavy`: one round, adds pass/fail criteria, a ceiling per category, sketched alternatives, and verification of every rated finding. Results go in a report page.
- `loop`: always heavy. Fix, re-review, repeat until done, stalled or out of rounds. Tests a pivot when the ceiling says to.

If the target isn't clear (a diff, a branch, a path, a running prototype, a plan), ask once.

Brandon usually asks in plain words. Map them like this:
- "run a panel", "what do they think", "rate this": report, light.
- "thorough", "deep", "be accurate": heavy.
- "keep going until 9", "fix it until they agree": loop.
- "fix what it finds": loop with `--rounds 1`, a single fix-and-review round.
- "just Sol and Fable", "add Sonnet", "Sol on xhigh": the reviewers and their effort.
- A bare count ("two reviewers"): keep Sol plus Claude models from the roster in order, so at least two model families stay on the panel.
- "aim for 8.5", "max 3 rounds": the target and the round cap.
- "focus on X" weights the categories toward X. "Skip the pivot stuff" drops the ceiling and alternatives.
- "this" means whatever the conversation has been working on.

## 1. Roster

Read `roster.yaml` next to this file, unless `--with` overrides it. Call `orchestrator_capabilities` once and match each entry to a real provider and model. If one is missing or disabled, tell Brandon which one and stop. Never substitute a model he didn't name. Always pass effort explicitly, because provider defaults differ (Codex defaults to low).

Without T3's `delegate_task`, use the harness's own subagents for models on your provider. Say which roster entries couldn't run.

## 2. Rubric

Read `categories.md`. Take the menu that fits the artifact, drop what doesn't apply, add categories specific to this artifact, and give every category a one-line boundary so no two count the same problem. Keep the must-track ones unless you say why you dropped them. Use as many categories as there are things Brandon would fix differently. Count isn't the goal.

Heavy and loop also get 3 to 5 pass/fail criteria per category that together define "meets the target". Make each one checkable: "undo restores each adjustment session separately", not "undo works well".

Write the rubric to a file (scratchpad, or `.devcenter/panel/` when it exists) and freeze it. Every reviewer and every round reads that same file. If a round proves a criterion wrong, stop and show Brandon the change before applying it.

## 3. Review

Start one `delegate_task` per reviewer, all in parallel, with `role: review`, using the brief in `reviewer-brief.md`. Every review and re-review is a new `delegate_task`. Reviewers get the artifact, the rubric file and the depth. In loop rounds they also get the open finding IDs. They never get your rationale, your summary of the fixes, or another reviewer's output. Wait for the results; don't poll.

## 4. Merge and verify

- Deduplicate. A problem two or more reviewers flagged on their own ranks first.
- Verify before reporting. Light: check every BLOCKER and everything that goes in the top fixes list against the artifact. Heavy: check every BLOCKER and ISSUE. If you can't confirm one, keep it and label it unverified. Drop it only when the artifact contradicts it, and say why.
- When reviewers split by 2 or more points on a category, report both scores and the reason they differ. Don't average the disagreement away.
- Reject scores that don't match the findings. A score below target needs at least one finding behind it. A score at or above target can't sit next to an open BLOCKER or ISSUE in the same category.

## 5. Direction verdict

Each reviewer gives a ceiling: what this direction scores if executed well. A ceiling below target must name a structural cause, such as "flat SVG primitives can't show depth at this size". "Needs polish" isn't one. Light gives one overall ceiling and names one alternative. Heavy gives a ceiling per category and one or two sketched alternatives with their own ceilings.

The verdict is one of these:
- **Climb**: the ceiling reaches the target and there's room left.
- **Pivot**: most reviewers put the ceiling below target. Name the alternative with the highest ceiling.
- **Accept or pivot**: the current score is within about half a point of the ceiling. More polish won't move it.

## 6. Loop (loop mode only)

Each round:
1. Fix the open BLOCKERs and ISSUEs by ID. You are the only writer; reviewers never edit. NITs wait until the end and never keep the loop running.
2. Run the project's checks (build, lint, tests, the prototype's own frame or screenshot scripts). Don't re-review red work.
3. Snapshot the round: a local commit on a working branch in git (never push), or a copied file otherwise. That makes it possible to revert to the best round.
4. Re-review with new reviewer tasks. Each reviewer settles every prior ID as fixed, open or worse, and adds new findings.

Stop when one of these happens:
- **Done**: every reviewer marks every criterion PASS or UNPROVABLE, and no BLOCKER or ISSUE is open. UNPROVABLE counts only when proving it needs something out of reach, such as real users, real hardware or VoiceOver. List each one as unverified.
- **Worse round**: more failing criteria or a new BLOCKER. Revert to the best snapshot and try a different fix. Two worse rounds in a row stop the loop.
- **Pivot check**: two rounds pass with no criterion flipping to PASS, or the direction verdict says pivot. Build a cheap spike of the highest-ceiling alternative in a separate file or worktree, never over the current work. Score it with the same panel and rubric. Then stop and show Brandon both, side by side. Pivoting is his call.
- **Round cap**: `--rounds` (default 4) runs out. If the last round still flipped criteria to PASS, ask Brandon whether to extend by 2 rounds. Otherwise report where it stands.

## 7. Report

Light: in chat. Use a scorecard table (category rows, one column per reviewer, a spread column), what gets each category below target to target, the direction verdict, the top fixes ranked with IDs, and disagreements. Keep it under a screen.

Heavy and loop: a report page. In Claude Code, publish it with the Artifact tool (load `artifact-design` first). Without one, write it to `.devcenter/panel/<date>-<slug>.md`, or to the scratchpad when the project has no `.devcenter`, and give the path. It contains:
- At the top: the reviewers as they actually ran (model and effort, taken from the task results), the target, the outcome, and the direction verdict.
- The scorecard, current score and ceiling per reviewer.
- Criteria status.
- Findings by severity, verified or unverified.
- Loop only: the score trend per round and what changed each round.
- NITs and UNPROVABLE items last.

End your chat message with the outcome in one line, the link or path, and what Brandon needs to decide, if anything.
