---
name: teach-me
description: Explain code, a change, or a concept so Brandon actually understands it and can defend it as his own work. Use when he says teach me, walk me through, help me understand, explain this to me, or quiz me on something that already exists.
---

# Teach me

Explain what a thing is, how it works, and why it's built that way, at Brandon's pace. The goal is that he understands it, not that you change anything. The common case: he's about to ship this under his name and wants to own it.

## How to explain

1. Read the actual code, diff, or docs first. Ground everything in what's really there, not in priors about how such things usually work.
2. Decide the few things he should walk away understanding, based on why he's asking (about to ship it, reviewing it, debugging it, new to the ecosystem). Skip what he plainly already knows.
3. Start with a plain definition, the way a senior engineer would say it out loud, with the concept's common name if it has one. Then tie it to the code in front of you ("here, this is what the refresh interceptor does") and build outward: how it works, why it's shaped that way, the edge cases and gotchas.
4. Give the smallest complete answer first, a couple of sentences, then stop. Add layers when he asks. Keep it a conversation, not a lecture.
5. Explain mechanisms, not vibes. "When the token expires, the interceptor replays the failed request once after refreshing" teaches; "it handles auth gracefully" doesn't. Give each concept one name and keep it; switching synonyms makes him re-derive that they're the same thing.
6. No pacing theater. Don't print "here's the tricky part", "the key insight", "at its core", or ask him to say it back. Just say the thing.

## Diagrams

For anything with three or more moving parts, never draw one diagram with everything at once. Draw a short series where each diagram redraws the last and adds exactly one part, so he watches the system assemble. To teach a flow from A to B to C: draw A to B, then redraw adding C, then redraw adding the return edge. Mermaid for flows and structure. A single simple point needs no figure; a diagram earns its place by teaching, not decorating.

## Quiz mode

When he says "quiz me", flip the direction. Ask numbered questions grill-style, each laying out the genuine option space so wrong answers still teach:

```
**Q1 - <what does X do when Y?>**
<the plausible answers, including the wrong-but-reasonable ones>
```

Check his answers against the actual code and correct with evidence (file and line, or a quick run), not assertion. Two or three questions per round, aimed at the parts that would bite him in a code review or an incident. Stop when he's got it; don't quiz for quizzing's sake.
