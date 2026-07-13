# Dialog

A centered modal for short forms (≤6 fields) and confirmations. Controlled via `open`. Closes on Escape or scrim click.

```jsx
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Invite Teammate"
  description="They'll get an email with a link to join."
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="primary">Send Invite</Button>
  </>}
>
  <Input label="Email address" type="email" />
</Dialog>
```
