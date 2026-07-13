# Accordion

Generic disclosure list — settings groups, help sections, progressive detail.

```jsx
<Accordion defaultOpen={0} items={[
  { title: 'Billing Address', content: <AddressForm /> },
  { title: 'Tax Settings', content: <TaxForm /> },
]} />
```

On marketing pages use `FAQAccordion` (larger type, question styling). Don't hide primary tasks inside an accordion.
