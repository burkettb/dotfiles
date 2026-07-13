# Toast

A transient, floating confirmation. Because it genuinely floats it carries a soft popover shadow (the one place shadow is allowed alongside modals/popovers). Use for brief confirmations; use `Alert` for persistent, in-flow messages.

```jsx
// Driven — wrap the app once:
<ToastProvider position="bottom-right">
  <App />
</ToastProvider>

function SaveButton() {
  const { push } = useToasts();
  return <Button onClick={() => push({ tone: 'success', title: 'Saved', message: 'Invoice #1042 sent.' })}>Save</Button>;
}

// Presentational (static / demo):
<Toast tone="success" title="Saved" onDismiss={close}>Invoice #1042 sent.</Toast>
```

Tones: `neutral | info | success | warning | danger`. Positions: `bottom-right | bottom-left | top-right | top-left`.
