# Icon

Solid glyph from the Heroicons (solid) set, tinted with `currentColor` so it inherits text color.

```jsx
<Icon name="magnifying-glass" size={18} />
<span style={{ color: 'var(--accent)' }}><Icon name="check-circle" /></span>
```

`name` is any Heroicons v2 solid name present in `ICON_PATHS` (self-contained inline SVG, no network). Default `size` 20. Add glyphs to the map as needed.
