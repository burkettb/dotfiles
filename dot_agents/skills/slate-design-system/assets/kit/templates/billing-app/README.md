# App UI kit — Slate Billing

A high-fidelity, click-through recreation of the Slate billing product. Composes the design-system primitives (no re-implementation).

## Screens
- **LoginScreen** — split auth layout (form left, brand testimonial right).
- **AppShell** — icon+label nav rail, top bar with persistent search + avatar.
- **OverviewScreen** — dashboard: tinted stat cards, annotated bar chart, collection-rate panel, recent-invoices table.
- **InvoicesScreen** — master–detail: compact selectable list + full invoice detail with line-item table and totals.
- **SettingsScreen** — one scrollable page, section headers + anchor rail, forms, danger zone.
- **NewInvoiceDialog** (in `index.html`) — centered modal for a short create form.

## Run
Open `index.html`. Sign in (prefilled) → Overview. Navigate via the rail; "New Invoice" opens the modal. Requires the compiled `_ds_bundle.js` at the project root.

## Playbook applied
Three-pane app shell · master–detail records · centered modal for short forms · one solid primary per view · nav active = leading accent bar · hairline table rows with muted caps header · fully annotated chart · functional color only (status tones + categorical tags).
