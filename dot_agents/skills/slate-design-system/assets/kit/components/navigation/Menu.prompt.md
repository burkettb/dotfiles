# Menu

Dropdown anchored to a trigger. Handles open state, click-away, and Escape. Reserve `danger` for destructive items and keep it last, after a divider.

```jsx
<Menu
  align="right"
  trigger={<IconButton icon="ellipsis-horizontal" label="Row actions" />}
  items={[
    { label: 'Edit', icon: 'pencil-square' },
    { label: 'Duplicate' },
    { divider: true },
    { label: 'Delete', icon: 'trash', danger: true },
  ]}
  onSelect={(item) => act(item.label)}
/>
```

For the top-bar account menu use `UserMenu` (dashboard); for arbitrary content in a floating panel use `Popover`.
