# Avatar

A person/entity marker. Image when `src` loads, initials otherwise. Pill radius; optional presence `status` dot. `AvatarGroup` overlaps several with a `max` overflow chip.

```jsx
<Avatar name="Dana Ruiz" src="/dana.jpg" status="online" />
<Avatar name="Kai Okafor" />            {/* initials fallback */}
<Avatar name="System" size="sm" />

<AvatarGroup max={3}>
  <Avatar name="Dana Ruiz" />
  <Avatar name="Kai Okafor" />
  <Avatar name="Lea Bianchi" />
  <Avatar name="Priya Nair" />
</AvatarGroup>
```

Sizes: `xs | sm | md | lg | xl`. Status: `online | away | busy | offline`.
