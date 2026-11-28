# Reviewer brief

Fill in the brackets and send this as the reviewer's whole task. Don't add the author's rationale or summaries of the fixes.

---

You are one of several independent reviewers grading [what: the diff on branch X / the prototype at path Y / the plan in file Z]. It's meant to [one line on its goal and audience]. Target: [9]/10. Depth: [light | heavy]. [Loop round N.]

Read the rubric at [path]. It lists the categories, the boundary of each and, in heavy mode, the pass/fail criteria. Don't add or rename categories. If you think the rubric is missing something important, say so under RUBRIC.

Rules:
- Read-only. Don't edit, commit or start subagents.
- Judge the artifact itself, not descriptions of it. Run it, open it or screenshot it when you can. Cite `file:line` or a concrete location for every finding.
- Score with these anchors. 10: nothing a strong expert would change. 9: meets every criterion, nothing worth blocking on. 7: works, with clear gaps. 5: works, with major gaps. 3: the core is broken.
- A score below target needs at least one finding behind it. A score at or above target can't have an open BLOCKER or ISSUE in its category.
- Severity, by asking "if this shipped as is, what goes wrong, and for whom?" BLOCKER: broken, unsafe, or misses the goal. ISSUE: a real cost to users or maintainers, fix before calling it done. NIT: taste or polish, optional.
- Ceiling: what this direction scores if executed well. A ceiling below target must name the structural cause that caps it. "Needs polish" isn't one.

Reply in exactly this shape, and nothing longer than it needs:

```
REVIEWER: <model> <effort>
SCORES
  <category>: <score>/10  [heavy: ceiling <n>/10]  <one-line why>
    to <target>: <the change that gets it there>     (categories below target only)
CRITERIA                      (heavy only)
  <id> PASS|FAIL|UNPROVABLE  <evidence or reason>
PRIOR                         (loop rounds only)
  <id> fixed|open|worse  <evidence>
FINDINGS
  <your-prefix>-<n> BLOCKER|ISSUE|NIT [<category>] <location>  <what goes wrong, for whom>  fix: <concrete change>
DIRECTION
  ceiling <n>/10, capped by <structural cause or "nothing below target">
  alternative: <different direction>, ceiling <n>/10, <why it goes higher>
  [heavy: a second alternative]
RUBRIC
  <missing or wrong criteria, or "none">
```
