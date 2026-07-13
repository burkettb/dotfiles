# Dashboard components — when to use what

For app/product surfaces: dense 14px base, white cards on `--surface-muted`, hairline structure.

**App frame — pick in this order:**
1. **TopNavShell** (preferred) — logo + horizontal nav + actions in a hairline top bar, centered content. Right for ≤6 top-level destinations, which is most apps.
2. **DashboardShell + TopBar** — collapsible sidebar. Only when sections multiply or need grouping/nesting.

**Overlays — default to Dialog:**
- **Dialog** is the default for create/edit/confirm tasks.
- **Drawer** only when the user needs the list/context underneath to stay visible (master–detail inspection). It floats: `--shadow-drawer` + hairline edge.

The rest:
- **DataTable** — sortable records; `filterable` gives a toolbar with one global search (default pattern; `filterable="columns"` for the per-column row, rarely). Small static table → `Table` (data/).
- **StatCard + Sparkline** — KPI row, 3–4 max; every number real.
- **Chart** (`LineChart`, `BarChart`, `AreaChart`, `DonutChart`) — near-monochrome `--chart-*` sequence, blue marks the series that matters. Hovering shows exact values by default (`tooltip={false}` to disable, `tooltipFormat` for currency etc.). Label everything.
- **FilterBar + DateRangePicker + MultiSelectFilter** — above tables/charts; also slot into DataTable's `toolbar`.
- **SettingsSection + DangerZone** — anchored settings pages; destructive actions live only in DangerZone.
- **ActivityFeed** — chronological history on detail pages.
- **Breadcrumbs** — shared primitive in `navigation/`, same bundle import.

Start from the `billing-app` template rather than composing a shell from scratch.
