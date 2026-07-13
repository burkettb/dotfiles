// Fake data for the Slate billing app UI kit.
window.SlateAppData = {
  invoices: [
    { id: 'INV-0421', customer: 'Northwind Traders', amount: 4820.00, status: 'Paid', tone: 'success', date: 'Jun 28, 2026', due: 'Jul 12, 2026', hue: 'blue', category: 'Retainer' },
    { id: 'INV-0420', customer: 'Globex Corp', amount: 1284.00, status: 'Past due', tone: 'warning', date: 'Jun 24, 2026', due: 'Jul 08, 2026', hue: 'amber', category: 'Usage' },
    { id: 'INV-0419', customer: 'Initech', amount: 640.00, status: 'Draft', tone: 'neutral', date: 'Jun 22, 2026', due: '—', hue: 'violet', category: 'One-off' },
    { id: 'INV-0418', customer: 'Umbrella Inc', amount: 9600.00, status: 'Paid', tone: 'success', date: 'Jun 20, 2026', due: 'Jul 04, 2026', hue: 'blue', category: 'Retainer' },
    { id: 'INV-0417', customer: 'Stark Industries', amount: 2200.00, status: 'Sent', tone: 'info', date: 'Jun 18, 2026', due: 'Jul 02, 2026', hue: 'teal', category: 'Usage' },
    { id: 'INV-0416', customer: 'Wayne Enterprises', amount: 15400.00, status: 'Paid', tone: 'success', date: 'Jun 15, 2026', due: 'Jun 29, 2026', hue: 'blue', category: 'Retainer' },
    { id: 'INV-0415', customer: 'Hooli', amount: 380.00, status: 'Suspended', tone: 'danger', date: 'Jun 12, 2026', due: 'Overdue', hue: 'rose', category: 'One-off' },
  ],
  lineItems: [
    { desc: 'Platform subscription — Team (12 seats)', qty: 12, rate: 320.00 },
    { desc: 'API overage — 1.2M requests', qty: 1, rate: 640.00 },
    { desc: 'Priority support add-on', qty: 1, rate: 180.00 },
  ],
  nav: [
    { icon: 'home', label: 'Overview' },
    { icon: 'document-text', label: 'Invoices' },
    { icon: 'users', label: 'Customers' },
    { icon: 'chart-bar', label: 'Reports' },
    { icon: 'cog-6-tooth', label: 'Settings' },
  ],
};
