# Web frontend checks

These need the app running on a free localhost port, against local or mock data only, never production APIs. A plain static site gets served with `python3 -m http.server`. A built app runs its preview script (`build` then `preview` beats a dev server). Drive it with Playwright when it's available (`npx playwright` or a repo script). If the build fails, that's `general.build-pass`. If the build passes but the server won't start or the page won't load, file it as **web.start** (severity high) and skip the rest. Stop the server when done.

Pick the routes from the router or the sitemap: the home page plus at most 5 main pages. Don't crawl.

- **web.console**: Load each route at 1280 and 390 wide. Finding: console errors, uncaught exceptions, or failed requests (4xx or 5xx on the app's own assets or APIs). Severity: high on the home page, otherwise medium.
- **web.mobile-overflow**: At 390px, check `document.documentElement.scrollWidth > 390`. Finding: horizontal scroll, or primary content cut off or overlapping. Name the element. Severity: medium.
- **web.a11y**: Inject axe-core (`@axe-core/playwright`, or the CDN build) and run it on each route. Finding: violations with impact `serious` or `critical`, grouped by rule. Severity: medium. Not a finding: `moderate` or `minor` on their own.
- **web.keyboard**: Judgment, home page and the main flow. Finding: interactive controls you can't reach or use from the keyboard, focus that gets lost, or a modal with no escape. Severity: medium.
- **web.meta**: Finding: a missing or duplicate `<title>`, a missing meta description, missing Open Graph tags on public marketing pages, no favicon, or `lang` missing on `<html>`. One ticket per repo. Severity: low.
- **web.links**: Collect internal `href`s from the visited routes and request each one, at most 50 per repo. Finding: internal links that return 404 and external links to the project's own accounts that are dead. Severity: medium.
- **web.bundle**: Read the build output's size report, or measure the gzip size of the initial-route JS. Finding: initial JS over 250 KB gzipped, or a single dependency over 100 KB gzipped that you could lazy-load. Name the chunk and the package. Severity: low, or medium on a public landing page.
- **web.images**: Finding: images over 500 KB served to the first viewport, or images with no width and height that shift the layout. Severity: low.
