# Slate Design System

A near-monochrome, systems-first design language: cool **slate** neutrals, one bold **blue** accent doing all the emphatic work, and a small fixed palette of functional colors where hue encodes meaning. Restrained, crisp, paper-on-white — shadcn/Vercel/Linear-adjacent, re-themed to these tokens. Nothing decorative; everything considered.

> **"Slate" is a placeholder brand.** This system was generated from a personal **design profile** (a `DESIGN.md` distilled from 136 recorded design decisions), not from a company codebase, Figma file, or brand kit. There is **no real product, logo, or company** behind it. The name, the sample billing app, and the marketing copy are illustrative scaffolding so the foundations have something to live on. Rebrand freely.

## Sources
- **Design profile (`DESIGN.md`)** — the sole input. Precedence: House rules → Color policy → Layout playbook → Core principles → Visual foundations → Tentative signals. The owner-confirmed **Color policy** (neutral base + one bold blue + functional color, never a rainbow) and the **Starting tokens** JSON block were used verbatim as the seed.
- No codebase, Figma URL, or slide deck was attached. If you have one, attach it via the Import menu and this system can be aligned to it.

## Fonts
The type is **Geist** (Sans + Mono) — the neutral grotesk named in the profile (Vercel/Geist family). It is loaded from the **Google Fonts CDN** (`tokens/fonts.css`) rather than vendored binaries, because no font files were supplied. This is the intended typeface, not a substitution. To ship offline, drop `Geist*.woff2` into `assets/fonts/` and swap the `@import` for local `@font-face` rules.

---

## Scope: web-first — native apps defer to the platform

Slate is a design language for **web surfaces** (apps in the browser, marketing sites, portfolios, tools). **Native applications must feel native — owner rule.** When building or prototyping a macOS, Windows, iOS, or Android app, the platform's conventions beat Slate on every fork: system font (SF Pro / Segoe UI), native controls, native settings panes (a macOS settings window looks like Apple's Settings — sidebar + grouped panes — not a Slate web page), native toolbars, spacing, and motion. Slate may inform the accent color and the voice/microcopy rules, never the chrome. Prototype native UIs with platform-accurate mockups rather than composing them from `sds-*` components.

## Content fundamentals

**Voice: plain, specific, confident.** Copy names the concrete capability or outcome of the product — never hype. The house rule bans template headlines ("Supercharge your workflow", "X, reimagined", "Unleash…"). Compare the real hero used here: *"Get invoices paid in days, not weeks."*

- **Casing:** **Title Case** for headings and buttons, applied consistently — "Create Invoice", "Send Reminder", "Start Free Trial". (The profile flags Title-vs-sentence as a low-confidence fork; Title Case wins for now.)
- **Person:** addresses the user as **you** ("Choose what Slate emails you about"); the product refers to itself by name ("Slate sends invoices…").
- **Microcopy is real and actionable.** Buttons name the action ("Delete Workspace", not "Submit"). Empty states say what will appear. Errors say what to do ("This slug is already taken."), never "Oops! Something went wrong".
- **Numbers are specific and earned.** Testimonials carry concrete claims ("days-to-payment dropped from 41 to 12"); stars are banned. No decorative stat-slop.
- **No emoji** in UI chrome, headings, or feature lists. No exclamation-driven excitement.
- **No keyboard-shortcut chrome.** No keycap glyphs, shortcut hints, or command-palette UI by default — owner decision (they read as AI-generated and unproven). Revisit case-by-case only when users demonstrably use a shortcut.
- **Tone:** calm, competent, finance-grade. Encouraging in empty states, matter-of-fact everywhere else.

## Visual foundations

- **Color.** Structure is colorless — layout, borders, text, surfaces use the **slate** scale only. **One accent (`#1d4ed8` blue)** carries every emphasis: primary buttons (solid), active nav (leading bar), focus rings, links. **Functional color** (fixed categorical palette of ≤5 hues + semantic red/green/amber) appears only where hue encodes information — status badges, category tags, chart series. If removing the color loses no information, it shouldn't be there. No decorative gradients in app UI (one deliberate gradient permitted on a marketing hero only — this kit doesn't even use that).
- **Dark theme (opt-in, tokens only, experimental).** Light is the one default — `styles.css` ships no dark rules. `tokens/theme-dark.css` (deliberately **not** imported by `styles.css`) remaps every semantic alias; to use it, link it after `styles.css` and set `data-theme="dark"` on `<html>`. Components have **not** been audited on dark.
- **Type.** One workhorse grotesk (Geist) for display and body — type as invisible infrastructure. 14px base, scale ratio 1.333, line-height 1.6. Headings 700 (display 800), body 400, labels 500. Large display uses tight tracking (−0.02em). **Reading surfaces** (marketing, brochure, portfolio pages) apply `.sds-reading` to the page root, which remaps base type to 16px in scope — apps stay at 14px.
- **Spacing.** Strict **4/8** scale (`--space-1`=4px … `--space-24`=96px). No arbitrary one-off margins. Information density is **spacious** — generous whitespace, one idea per view.
- **Layout & layers.** `tokens/layout.css` defines the semantic **z-index scale** (`--z-sticky` 20 … `--z-toast` 70 … `--z-max` 80 — never hardcode a z-index), **container widths** (`--container-page/content/narrow/prose`), and the **three breakpoints**: ≤1024px (tablet — sidebars collapse), ≤768px (mobile — the primary collapse point, everything single-column), ≤640px (phone — tighter padding, full-width buttons). Desktop-first `max-width` queries at exactly these values; see the Responsive Rules card in `guidelines/`.
- **Backgrounds.** White page, white cards. No imagery, textures, patterns, or gradients in app UI. Regions are separated by **1px hairline borders**, not fills or shadows. The one dark surface (auth panel, marketing CTA) is a solid near-black (`--slate-900`), never glassmorphism or glow.
- **Corners.** Sharp-leaning: **cards 6px**, **controls 4px** (`--radius-card` / `--radius-control`). Pill radius reserved for status dots, avatars, and toggle tracks. Do not go rounder.
- **Borders.** 1px hairlines are the primary structural device (`--border` slate-200, `--border-strong` slate-300). Inputs are outlined (1px border, subtle bg, ring on focus).
- **Elevation.** Structure from borders, **not shadows**. Cards at rest: border, no shadow. Shadows exist only on genuinely floating layers — modals (`--shadow-modal`), popovers/dropdowns (`--shadow-popover`), slide-over drawers (`--shadow-drawer`, deeper — the drawer must read as clearly above the page), drag previews — and are soft and small.
- **Motion.** Restrained but choreographed — transitions explain state changes. Durations 150 / 300 / 450ms (`--duration-fast/base/slow`), standard easing `cubic-bezier(0.2,0,0,1)`. Respects `prefers-reduced-motion` (durations collapse to 0). No infinite decorative loops.
- **Hover.** Flat background **tint shift** (3–5%, `--surface-hover`) — no movement, no shadow growth.
- **Press / focus.** Focus is designed as carefully as hover: a 2px accent ring at 2px offset (`--ring`) on `:focus-visible`. Inputs get a 3px soft blue halo. Buttons darken on hover rather than lift.
- **Cards.** White surface, 1px `--border`, 6px radius, no shadow at rest; optional header (title + muted description, hairline divider) and right-aligned footer actions.
- **Transparency / blur.** Used sparingly — only the sticky marketing nav (85% white + backdrop blur) and the modal scrim (`rgba(15,23,42,0.4)`). Not a general device.
- **Imagery vibe.** No photography in the sample. Where a product visual is needed (marketing hero), it's a real UI fragment (an invoice card), not stock art.

## Iconography

- **Set:** [**Heroicons**](https://heroicons.com) — **solid** variant, one set, one weight, matching the profile's "solid/filled, one set" rule.
- **Delivery:** the `Icon` component renders a **self-contained inline `<svg>`** from an embedded map of Heroicons-solid path data (`ICON_PATHS` in `Icon.jsx`), sized via width/height with `fill: currentColor`, so icons inherit text color and size cleanly and work offline with no external requests. Add glyphs to `ICON_PATHS` as needed. *(Substitution note: no icon assets were supplied, so Heroicons-solid is used as the match to the profile's stated "Heroicons-solid or equivalent".)*
- **Usage discipline (house rules):** icons **earn their place** — never prefix every nav item, heading, and list row by default. Primary actions may pair icon + label; text alignment is the default elsewhere. One stroke/fill weight throughout.
- **No emoji, no unicode glyphs** used as iconography.
- **`Icon` names** are Heroicons v2 solid names present in `ICON_PATHS`, e.g. `home`, `document-text`, `magnifying-glass`, `ellipsis-horizontal`, `chevron-right`, `plus`, `check`, `cog-6-tooth`.

---

## Components

Reusable React primitives (bundled to `window.SlateDesignSystem_59ffb3`). Grouped by concern under `components/`:

- **core/** — `Button`, `IconButton`, `Icon`, `Card`, `Badge`, `Tag`, `Avatar` / `AvatarGroup`, `Accordion`, `Divider`
  - `Badge` (status) and `Tag` (categorical) are **containerless by default** — colored round dot (Badge) or square swatch (Tag, same solids as chart series) + plain text; quiet, no tinted pills. Both take `boxed` for a hairline chip in dense/filter contexts.
- **forms/** — `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch` (each with error / success / disabled states + helper text)
- **feedback/** — `Dialog`, `Tooltip`, `Popover`, `Alert` (inline), `Toast` / `ToastProvider`, `Skeleton`, `Spinner`, `Progress`, `EmptyState`
- **navigation/** — `NavItem`, `Tabs`, `Breadcrumbs`, `Menu` (dropdown), `Pagination`
- **data/** — `Table`
- **dashboard/** — `TopNavShell` (the preferred app frame: horizontal nav, centered content), `DashboardShell` (collapsible sidebar — for many/grouped sections), `TopBar`, `SearchField`, `UserMenu`, `DataTable` (sort / toolbar search / selection + bulk actions / row menu / pagination / empty state), `StatCard` + `Sparkline`, `Chart` (`LineChart`, `BarChart`, `AreaChart`, `DonutChart`, `ChartLegend` — hover shows exact values), `FilterBar` + `DateRangePicker` + `MultiSelectFilter`, `Drawer` + `DrawerField`, `SettingsSection` + `DangerZone` + `DangerRow`, `ActivityFeed`
- **marketing/** — SaaS/product-site sections (breathes more: display type, generous whitespace): `MarketingHero` (centered / split), `SectionHeading`, `FeatureGrid`, `FeatureRows` (alternating), `BentoGrid`, `PricingTable` (highlighted tier + monthly/annual toggle), `TestimonialGrid`, `LogoWall`, `CTABanner`, `NewsletterCapture`, `FAQAccordion`, `StatsBand`, `BlogCard`, `ArticleLayout`
- **brochure/** — local service-business sections (phone-forward; the one place review stars are allowed): `BrochureHero`, `TrustStrip`, `ServicesGrid`, `ReviewCards` + `ReviewStars`, `BeforeAfterGallery`, `TeamCards`, `HoursLocation`, `ServiceArea`, `QuoteForm` (multi-step), `StickyCallButton`
- **portfolio/** — personal-site sections (expressive type variant: bigger display, looser spacing, same fonts/colors): `ProjectTiles`, `CaseStudyHero` + `CaseStudySection` + `GalleryLightbox`, `AboutBio`, `SkillsList`, `ExperienceTimeline`, `ContactSection`
- **tool/** — single-purpose utilities (centered, minimal chrome): `ToolShell` + `ToolPanels` + `InputPanel` + `OutputPanel`, `CopyButton`, `CodeBlock`, `ResultCard`, `ShareExportRow`, `RangeSlider`, `Stepper`, `FileDropzone`, `HowItWorks`, `RelatedToolsGrid`
- `ImagePlaceholder` (core) — striped stand-in for real imagery with a mono label; used across marketing/brochure/portfolio until real assets are supplied.

Each category ships **individual specimen cards** per component (edit them in isolation on the Design System tab) plus one **composed sample** page that pulls the whole category together.

Each component has a `.jsx` implementation and a `.d.ts` props contract; primitives have per-component `.prompt.md` usage notes, and each page category (dashboard, marketing, brochure, portfolio, tool) has a **category `.prompt.md`** — a "which component when" decision guide. Each directory has a `*.card.html` specimen registered on the Design System tab.

### Which component when — the common forks
- **App frame:** ≤6 top-level destinations → `TopNavShell` (preferred) · many/grouped sections → `DashboardShell`
- **Floating layers:** short hint → `Tooltip` · list of actions → `Menu` · arbitrary content → `Popover` · create/edit/confirm → `Dialog` (the default) · inspect beside a list that must stay visible → `Drawer`
- **Loading:** unknown duration → `Spinner` · known progress → `Progress` · region structure → `Skeleton`
- **Tables:** static/small → `Table` · sortable/filterable records → `DataTable`
- **Disclosure:** in-app → `Accordion` · marketing FAQ → `FAQAccordion`
- **Labels:** status (semantic tones) → `Badge` · category (categorical palette) → `Tag`
- **Heroes:** product site → `MarketingHero` · local service → `BrochureHero` · case study → `CaseStudyHero`

> **Component inventory note:** no source defined an inventory, so this is a standard from-scratch set sized to the profile's layout playbook (buttons, outlined inputs, selection controls, cards, badges/tags, dialog, tooltip, nav, boxed tabs, hairline table). **Intentional addition:** `Icon` / `IconButton` wrappers for the Heroicons-solid set (needed to enforce the one-set / currentColor rule).

## Templates

Full-screen, high-fidelity starting points composing the primitives — under `templates/`. Consuming projects copy one and edit; don't compose a page frame from scratch when a template fits.

- **billing-app/** — **Slate Billing**, a three-pane billing product: `LoginScreen` (split auth), `AppShell` (nav rail + top bar), `OverviewScreen` (dashboard + annotated chart), `InvoicesScreen` (master–detail), `SettingsScreen` (anchored sections), plus a New-Invoice modal. Start here for dashboards and internal tools. See `templates/billing-app/README.md`.
- **landing-page/** — a long-scroll landing page: editorial hero, features, tiered pricing, testimonials, dark CTA, footer. Uses `.sds-reading` (16px body). See `templates/landing-page/README.md`.

No slide template was supplied, so no sample slides were created.

---

## Root manifest / index

| Path | What it is |
|---|---|
| `styles.css` | Global entry point — `@import` manifest only. Consumers link this. |
| `tokens/` | `colors.css`, `typography.css` (incl. `.sds-reading`), `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `layout.css` (z-index / breakpoints / containers), `fonts.css` — all CSS custom properties + font loading. `theme-dark.css` is the opt-in dark remap, deliberately outside `styles.css`. |
| `components/components.css` | Class-based component styling (`sds-*`), shipped globally. |
| `components/{core,forms,feedback,navigation,data}/` | React primitives (`.jsx` + `.d.ts` + `.prompt.md` + card). |
| `guidelines/` | Foundation specimen cards (Colors, Type, Spacing, Foundations, Responsive Rules, Brand). |
| `templates/billing-app/`, `templates/landing-page/` | Copyable starting points for consuming projects. |
| `SKILL.md` | Agent Skill wrapper for use in Claude Code. |
| `_ds_bundle.js`, `_ds_manifest.json` | Auto-generated by the compiler — do not edit. |

## Caveats & how to make this perfect
- **How strict is all this?** Strong defaults with documented escape hatches. The color policy, spacing scale, and type system are load-bearing — breaking them breaks the brand. Documented exceptions exist (stars in brochure reviews, one deliberate marketing-hero gradient, solid danger badge) — an escape hatch is legitimate only if it's written down here; a one-off in a project is a bug.
- **Fonts & icons:** Geist loads from the Google Fonts CDN (intended family, not a fallback). Icons are **inline Heroicons-solid path data** embedded in `Icon.jsx` (`ICON_PATHS`) — self-contained, no network; the set grows on demand (add the path data when a new glyph earns its place). Vendor Geist locally for fully offline/production use.
- **No real brand.** The wordmark is plain type ("Slate."). Supply a real logo, name, and brand voice to replace the placeholder.
- Several profile signals are **low-confidence forks** (Title vs sentence case; motion depth; overall design language at only 4 duels). The choices here follow the profile's stated defaults — flag any you'd like to duel further.
