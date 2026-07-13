# Alert (inline)

An in-flow message tied to a region — not a floating toast. Tinted by tone; hue carries the meaning so it sits quietly against slate.

```jsx
<Alert tone="info" title="Heads up">Your trial ends in 5 days.</Alert>
<Alert tone="success" title="Saved" onDismiss={close}>Changes are live.</Alert>
<Alert tone="warning">This slug is already taken.</Alert>
<Alert tone="danger" title="Payment failed"
  actions={<Button size="sm" variant="ghost">Retry</Button>}>
  We couldn't charge your card ending 4242.
</Alert>
```

Tones: `info | success | warning | danger`. Use for persistent, contextual messages; use `Toast` for transient confirmations.
