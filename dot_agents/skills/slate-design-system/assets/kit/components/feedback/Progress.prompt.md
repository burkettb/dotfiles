# Progress

Determinate linear bar. Accent-colored by default; `tone` only when the outcome itself is good/bad (storage nearly full → `danger`).

```jsx
<Progress label="Uploading invoice.pdf" value={64} showValue />
<Progress label="Storage used" value={92} tone="danger" showValue />
```

Unknown duration → `Spinner`. Loading page structure → `Skeleton`.
