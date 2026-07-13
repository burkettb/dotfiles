# Breadcrumbs

Trail of links; the last item is the current page (not a link). Lives in the dashboard top bar, but works on any page with hierarchy.

```jsx
<Breadcrumbs items={[
  { label: 'Invoices', href: '/invoices' },
  { label: 'INV-2041' },
]} onNavigate={(item) => go(item.href)} />
```

Don't use for a 1-level site — breadcrumbs earn their place at depth ≥ 2.
