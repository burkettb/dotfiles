# Tabs

Boxed, contained folder-style tabs attached to their panel — for genuinely separate workspaces. Controlled.

```jsx
const [tab, setTab] = React.useState('overview');
<Tabs
  value={tab}
  onChange={setTab}
  items={[{ value: 'overview', label: 'Overview' }, { value: 'activity', label: 'Activity' }]}
/>
```
