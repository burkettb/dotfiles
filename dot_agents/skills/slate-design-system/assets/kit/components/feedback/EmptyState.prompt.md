# EmptyState

The considered zero-data view: muted icon in a soft slate disc, plain title, one specific sentence of guidance, and usually one primary action. Copy says what will appear here — never "Nothing here" or "Oops".

```jsx
<EmptyState
  icon="document-text"
  title="No invoices yet"
  description="Invoices you create will show up here, with their status and due date."
  action={<Button variant="primary" leadingIcon="plus">Create Invoice</Button>}
/>
```

Sizes: `sm | md`. Drop inside a Card body or an empty table region.
