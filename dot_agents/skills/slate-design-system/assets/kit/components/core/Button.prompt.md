# Button

The action primitive. Use for anything the user clicks to act. Exactly one `primary` (solid) button per view.

```jsx
<Button variant="primary" leadingIcon="plus">Create Invoice</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" trailingIcon="chevron-right">View all</Button>
<Button variant="danger">Delete Project</Button>
```

Variants: `primary` (solid, one per view) · `secondary` (outline) · `ghost` · `danger` (outline-red). Sizes `sm | md | lg`. Props: `loading`, `fullWidth`, `leadingIcon`, `trailingIcon`.
