# Tag

Category as a **square hue swatch + plain text — no container**. The swatch uses the same solids as chart series, so a category keeps one color from tag to chart. `boxed` adds a hairline chip — use it for removable filter chips.

```jsx
<Tag hue="violet">Engineering</Tag>
<Tag hue="rose" boxed onRemove={clear}>Sales</Tag>
```

Hues: `blue | teal | violet | amber | rose` — one stable meaning per hue. Status → Badge (round dot); category → Tag (square swatch).
