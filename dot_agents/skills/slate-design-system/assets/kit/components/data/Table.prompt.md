# Table

Data table with hairline row separators, a muted uppercase header, and a hover tint. Put row actions in a single kebab (⋯) menu.

```jsx
<Table
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status', render: (r) => <Badge tone={r.tone}>{r.status}</Badge> },
    { key: 'actions', header: '', align: 'right', render: () => <IconButton icon="ellipsis-horizontal" label="Actions" size="sm" /> },
  ]}
  rows={rows}
/>
```
