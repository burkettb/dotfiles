# Badge

Status as a colored **round dot + plain text — no container** (the Apple treatment; quiet reads as expensive). `danger` also reddens the text. Round dot = state; Tag's square swatch = category.

```jsx
<Badge tone="success">Active</Badge>
<Badge tone="warning">Past Due</Badge>
<Badge tone="danger">Suspended</Badge>
<Badge tone="success" boxed>Active</Badge>  // hairline chip for dense contexts
```

Tones: `neutral | info | success | warning | danger`. Status → Badge; category → Tag.
