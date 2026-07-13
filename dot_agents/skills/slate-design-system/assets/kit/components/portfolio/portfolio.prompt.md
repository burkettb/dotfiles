# Portfolio components — when to use what

For personal sites: same tokens, expressive type variant (bigger display, looser spacing). Apply `.sds-reading` to the page root (16px body).

**Voice rule: personal, not resume.** A portfolio here is a person sharing work they care about, not a CV with CSS. Write intros and summaries in first person with a reason ("a menu bar app that only interrupts when something you own breaks"), not deliverable-speak ("Product design · 2025").

- **ProjectTiles** — `variant="text"` is the **default**: title + one-line story + mono meta (platform · stack · year). Software rarely photographs well — an ETL pipeline or a menu bar app has no hero shot, and a fake screenshot reads worse than good words. Use `variant="media"` only when the work genuinely has a strong visual (and then use real shots, or a cropped UI fragment — never stock).
- **CaseStudyHero + CaseStudySection** — problem → approach → outcome, at reading measure. **GalleryLightbox** for full-bleed viewing (`--z-max`).
- **AboutBio** — portrait + bio; first person, specific, allowed to mention off-hours obsessions.
- **SkillsList** — plain lists, never meters. Frame groups as a person, not a CV: "Now / Tools I Reach For / Off Hours" beats "Design / Research / Build".
- **ExperienceTimeline** — keep it short and concrete; it supports the story, it isn't the story.
- **ContactSection** — email as the primary action; social links secondary.

Case study body text uses `--container-prose` (70ch). One display-size statement per screen, max.
