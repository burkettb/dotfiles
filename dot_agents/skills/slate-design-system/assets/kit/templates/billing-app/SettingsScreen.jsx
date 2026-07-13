// SettingsScreen — one scrollable page, section headers, anchor rail (Settings playbook).
const { Input, Select, Switch, Button, Checkbox } = window.SlateDesignSystem_59ffb3;

function SettingsScreen() {
  const sections = [
    { id: 'profile', label: 'Profile' },
    { id: 'billing', label: 'Billing' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'danger', label: 'Danger Zone' },
  ];
  const [active, setActive] = React.useState('profile');

  return (
    <div style={{ display: 'flex', gap: 40, padding: 32, maxWidth: 960, margin: '0 auto' }}>
      {/* Anchor rail */}
      <nav style={{ width: 160, flex: 'none', position: 'sticky', top: 0, alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sections.map((s) => (
          <a key={s.id} href={'#' + s.id} onClick={() => setActive(s.id)}
            style={{ fontSize: 14, fontWeight: active === s.id ? 600 : 500, color: active === s.id ? 'var(--text-primary)' : 'var(--text-muted)',
              padding: '6px 12px', borderLeft: active === s.id ? '2px solid var(--accent)' : '2px solid var(--border)', textDecoration: 'none' }}>
            {s.label}
          </a>
        ))}
      </nav>

      {/* Sections */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40, minWidth: 0 }}>
        <Section id="profile" title="Profile" desc="This information appears on invoices you send.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
            <Input label="Company name" defaultValue="Acme Co" />
            <Input label="Billing email" type="email" defaultValue="billing@acme.co" helpText="Payment receipts are sent here." />
            <Select label="Default currency" options={['USD — US Dollar', 'EUR — Euro', 'GBP — Pound Sterling']} />
            <div><Button variant="primary">Save Changes</Button></div>
          </div>
        </Section>

        <Section id="billing" title="Billing" desc="Manage your plan and payment method.">
          <div className="sds-card" style={{ padding: 20, maxWidth: 420, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Team plan</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>$320 / month · renews Aug 1, 2026</div>
            </div>
            <Button variant="secondary">Change Plan</Button>
          </div>
        </Section>

        <Section id="notifications" title="Notifications" desc="Choose what Slate emails you about.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
            <Switch label="Email me when an invoice is paid" defaultChecked />
            <Switch label="Email me 3 days before an invoice is due" defaultChecked />
            <Switch label="Weekly revenue summary" />
          </div>
        </Section>

        <Section id="danger" title="Danger Zone" desc="Irreversible actions. Proceed carefully.">
          <div className="sds-card" style={{ padding: 20, maxWidth: 420, borderColor: 'var(--danger-border)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Delete workspace</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 14px', lineHeight: 1.5 }}>
              Permanently removes all invoices, customers, and reports. This cannot be undone.
            </p>
            <Button variant="danger">Delete Workspace</Button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ id, title, desc, children }) {
  return (
    <section id={id}>
      <h2 style={{ fontSize: 19, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{title}</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 20px' }}>{desc}</p>
      {children}
    </section>
  );
}
window.SettingsScreen = SettingsScreen;
