# Marketing components — when to use what

For SaaS/product sites. Apply `.sds-reading` to the page root (16px body). Breathes more: display type, generous whitespace, `--container-page` sections separated by hairlines.

- **MarketingHero** — `centered` for a single big claim, `split` when you have a real product visual. Headlines are specific ("Get invoices paid in days, not weeks") — never template hype.
- **SectionHeading** — eyebrow + title + lead for every section. Keep eyebrows honest ("Pricing", not "Why us").
- **FeatureGrid** vs **FeatureRows** — grid for 3–6 peer features; alternating rows when each feature deserves a visual. **BentoGrid** only when features genuinely vary in weight.
- **PricingTable** — one highlighted tier max.
- **TestimonialGrid** — concrete claims, real names/roles. Stars are banned here (brochure is the exception).
- **LogoWall / StatsBand** — only with real logos/numbers. No filler.
- **CTABanner** — the one dark (`--slate-900`) section; one per page.
- **FAQAccordion** — marketing-styled FAQ. In-app disclosure → `Accordion` (core/).
- **BlogCard / ArticleLayout** — editorial index + post at `--container-prose` measure.

Which hero? Product site → `MarketingHero`. Local service business → `BrochureHero`. Personal work → portfolio intro. Case study → `CaseStudyHero`.

Start from the `landing-page` template.
