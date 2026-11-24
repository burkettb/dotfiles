---
name: grill
description: Interview Brandon about a plan, decision, or greenfield idea until the design is actually settled, teaching the option space as it goes. Use when he says grill, grill me, quiz me on this plan, align first, or when a task is ambiguous or high-stakes enough that guessing wrong would waste real work.
---

# Grill

Interview Brandon until you reach a shared understanding. He is deciding and learning at the same time, so every question also teaches the territory.

Map the work as a **design tree**: every decision branches into the decisions that hang off it. Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled, the questions you can ask now without guessing at answers you haven't heard yet. Ask the whole frontier in one numbered round, then wait.

Format each question like this:

```
**Q1 - <question title>**
<the real option space: the two to four genuine choices, and the tradeoff that
actually decides between them, in a sentence or two each. Teach here. If one
option is what most teams in this ecosystem do, say so.>

➡️ Recommended: <your pick and the one-line reason>
```

Brandon answers rounds tersely ("1 yes, 2B, 3 your call"). "Your call" means take your recommendation and move on. Settled answers push the frontier outward; recompute it and ask the next round. A question whose answer depends on another question still open in this round belongs to a later round.

Rules:

- Finding facts is your job, never Brandon's. When a question needs a fact from the environment (the repo, a config, a library's behavior), dispatch a subagent or look it up; don't ask him anything you could discover. Don't block the rest of the frontier on it.
- Decisions are Brandon's. Put each to him with a recommendation and wait.
- Challenge fuzzy terms as they appear. If he says "account" and could mean two different things, pin it down and use the settled term consistently from then on.
- Track settled terms and decisions in the conversation as the interview runs. After Brandon confirms the final summary or spec, and only when the task authorized project changes, write them through: glossary terms to `CONTEXT.md` (created on the first term), consequential decisions with their why to `.devcenter/decisions.md` (or `docs/adr/` where the repo already keeps ADRs). A grill that ends at understanding writes nothing.
- Stress-test with concrete scenarios when a boundary feels soft ("a user cancels mid-sync: what should exist afterward?").
- Proportionality: a small task gets one round and done. Don't grill past the point where answers stop changing the design.

## Output

When the frontier is empty, write the result at the size the work deserves:

- **Small or medium work:** a short summary in chat. Decisions made, anything deferred, first step.
- **Large or greenfield work:** a spec file (`docs/spec-<topic>.md` or wherever the repo keeps such things). Keep it short: the goal, the settled decisions and why, slices in priority order where the first slice alone is a working end-to-end version, and every open unknown marked `[NEEDS CLARIFICATION: question]`. Never fill a gap with a plausible guess; the markers are the point.

Do not start building until Brandon confirms the summary or spec. The spec is what he reviews for big builds, so getting it right is worth more than getting to code.
