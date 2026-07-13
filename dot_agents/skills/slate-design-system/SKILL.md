---
name: slate-design-system
description: Apply Brandon's Slate design system to frontend and web UI work, including greenfield apps, dashboards, internal tools, landing pages, portfolios, service sites, prototypes, component creation, visual polish, and design-system audits. Use automatically for frontend work when the project has no stronger existing design system, or whenever Brandon asks for Slate, his design preferences, UI consistency, or a less generic visual direction. Defer to established project design systems and native-platform conventions unless Brandon explicitly requests a Slate redesign.
---

# Apply Slate

Use Slate as Brandon's default web design language without forcing it onto an established product or a native application.

## Start with context

1. Inspect the repository for existing tokens, components, design documentation, screenshots, and framework conventions.
2. If the project already has a coherent design system, preserve it unless Brandon asks to migrate or restyle it. Use Slate only to fill genuine gaps.
3. If the target is native macOS, Windows, iOS, or Android, follow platform-native controls and layout. Borrow at most Slate's accent and content voice.
4. Read `references/design-system.md` before making visual decisions. It is the canonical design reference.

If a generic frontend-design skill also applies, Slate is authoritative for visual language, tokens, component choices, and voice. Use the generic skill only for implementation craft, accessibility, and framework-specific execution.

## Choose the smallest useful Slate surface

- Inspect `assets/kit/_ds_manifest.json` for the component and starting-point inventory.
- Prefer an existing starter in `assets/kit/templates/` for dashboards or landing pages instead of inventing a new shell.
- For a specific component, inspect its `.prompt.md`, `.d.ts`, and `.jsx` files under `assets/kit/components/`.
- For category composition, read the matching category prompt: dashboard, marketing, brochure, portfolio, or tool.
- Use `assets/kit/tokens/` and `assets/kit/styles.css` as the source of truth for visual tokens.

Copy only the assets the project needs. Do not dump the full kit into a repository by default.

## Adapt to the delivery context

### Production code

- Integrate with the project's framework, dependency versions, component conventions, and accessibility primitives.
- Treat the JSX as reference implementations when direct copying would fight the codebase.
- Use installed React and build-tool dependencies; do not add CDN React, Babel, or unpkg scripts to production.
- Vendor Geist or use the project's existing font-loading system when offline behavior, privacy, performance, or CSP matters.
- Preserve semantic HTML, keyboard behavior, focus visibility, reduced motion, responsive states, and contrast.

### Prototype or visual artifact

- Static HTML specimen cards and `_ds_bundle.js` are acceptable for fast, disposable previews.
- External CDN assets require network access; disclose that dependency and keep integrity attributes intact.
- Clearly distinguish prototype scaffolding from production-ready code.

## Preserve the load-bearing rules

- Use cool slate neutrals for structure and one blue accent for emphasis.
- Use functional color only when hue communicates information.
- Keep one solid primary action per view.
- Use 1px hairlines for structure; reserve shadows for floating layers.
- Use 6px cards, 4px controls, the 4/8 spacing scale, semantic z-index tokens, and the documented 1024/768/640 breakpoints.
- Default to light theme. Treat dark tokens as opt-in and not fully audited.
- Use 14px body for applications and `.sds-reading` for 16px reading surfaces.
- Prefer `TopNavShell` over a sidebar and `Dialog` over `Drawer` unless information architecture requires otherwise.
- Use plain, specific, actionable copy. Avoid hype, decorative color, gradients, emoji, and ornamental shortcut chrome.

Document any deliberate exception rather than introducing a silent one-off.

## Verify visually and behaviorally

1. Run the application or render the artifact.
2. Check the relevant desktop, tablet, and mobile breakpoints.
3. Exercise loading, empty, error, disabled, focus, hover, and reduced-motion states where relevant.
4. Check console errors, overflow, keyboard use, accessible names, and contrast.
5. Report which Slate assets were reused, which rules were intentionally adapted, and any remaining visual uncertainty.
