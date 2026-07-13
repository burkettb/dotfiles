# Brochure components — when to use what

For local service businesses (plumber, dentist, landscaper): phone-forward, trust-forward. Apply `.sds-reading` to the page root (16px body).

- **BrochureHero** — headline + phone number + quote CTA. The phone number is a first-class action, not footer trivia.
- **TrustStrip** — licenses, years, insured — real credentials only.
- **ServicesGrid** — the business's actual services; link each to a quote.
- **ReviewCards + ReviewStars** — the ONE place stars are allowed in the whole system. Real reviews with names.
- **BeforeAfterGallery / TeamCards** — use `ImagePlaceholder` until real photos are supplied; never stock art.
- **HoursLocation / ServiceArea** — hours table + coverage. Keep factual.
- **QuoteForm** — multi-step; ask only what's needed to call back.
- **StickyCallButton** — mobile-only fixed call bar (appears ≤768px, `--z-fixed`).

Don't mix with marketing/ sections on the same page — brochure pages are warmer and simpler; pick one vocabulary per site.
