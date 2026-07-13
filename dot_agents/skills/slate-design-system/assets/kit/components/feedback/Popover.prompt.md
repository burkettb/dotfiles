# Popover

Floating panel anchored to a trigger, for arbitrary content — filter forms, pickers, contextual help. Handles click-away and Escape.

```jsx
<Popover align="right" trigger={<Button variant="secondary">Filters</Button>}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Select label="Status" options={['All', 'Paid', 'Overdue']} />
    <Button variant="primary" size="sm">Apply</Button>
  </div>
</Popover>
```

Decision guide: list of actions → `Menu`; short text hint → `Tooltip`; blocking task → `Dialog`.
