# TopNavShell

The default app frame: logo + horizontal nav in a hairline top bar, content in a centered `--container-page` column below (or `wide` for full-width). Active item gets a 2px accent underline.

```jsx
<TopNavShell
  logo="Slate."
  nav={[
    { label: 'Overview', active: true },
    { label: 'Invoices', badge: 12 },
    { label: 'Customers' },
    { label: 'Settings' },
  ]}
  actions={<Button variant="primary" size="sm">New Invoice</Button>}
  user={<UserMenu name="Ana Torres" items={[{ label: 'Sign Out' }]} />}
  onNavigate={(item) => go(item)}
>
  {content}
</TopNavShell>
```

Prefer this over `DashboardShell` for ≤6 top-level destinations; switch to the sidebar shell only when sections multiply or need grouping.
