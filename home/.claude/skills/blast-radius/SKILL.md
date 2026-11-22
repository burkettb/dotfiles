---
name: blast-radius
description: Find what a change could break beyond the diff and prove the key safety fact by running real code. Use when Brandon asks blast radius, what could this break, is this safe to merge, or wants a small diff he doesn't trust checked before shipping.
---

# Blast radius

Find what a change breaks somewhere else, before it ships. Listing the callers is not the job; grep does that in a second. The job is the breakage grep won't show you.

## Don't trust your own writeup

A blast-radius writeup that sounds right is worthless. It reads as convincing whether or not it's true. So don't hand back an argument. Find the one or two facts the whole thing depends on and prove them by running code.

For each fact the change's safety depends on, get it as far down this ladder as is cheap, and say where it stopped:

1. You said so. Worthless on its own.
2. You pointed at the line: a real `file:line`, or the library's own source.
3. You showed the bad case can't happen: walked the failure step by step and it doesn't reach.
4. You ran it: a script or test that calls the real code and fails loud if you're wrong.
5. You reproduced it in the running app.

Any safety fact you can't get to step 4, say so out loud. Mark it unproven; never round up to settled. Step 4 is usually one small script that imports the same library the app ships and calls the exact function you're worried about.

## Steps

1. Read the change: the diff, the symbols it adds, changes, and deletes, and what it now does differently, including the part the diff doesn't spell out.
2. Find the one fact it's safe because of. Most scary-looking changes are safe because of a single fact ("this call only drops already-dead cache entries"). Find it. If it holds, most of the scary cases die at once. Spend your time here, not on a long list of maybes.
3. Look where grep stops: the source of the library you call (and its pinned version), execution timing (microtasks, unmount, teardown ordering), and what a symbol search misses — the JSON an API returns, a DB column, a wire format, another service reading the same bytes, a feature flag, code three hops downstream.
4. Be honest about each risk: a real likelihood, a real cost. Keep the risks you confirmed; list what you checked and cleared separately. Cite real `file:line` references; a search that finds nothing is still an answer; never invent a caller.
5. Prove the one fact: write the script or test, run it, paste what happened.

## Hand back

- **What it does**, including the non-obvious part.
- **The one fact it's safe because of**: stated, with which ladder step it reached and the proof, or marked unproven.
- **Risks**: only real ones, each with how it breaks, where, likelihood, cost, and how to check.
- **Cleared**: what you checked and why it's fine.
- **Before merge**: the cheapest test or repro that would catch the real bug, including any script you wrote.
