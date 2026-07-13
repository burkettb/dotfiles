// LoginScreen — split layout: form left, brand statement right (Auth playbook).
const { Button, Input, Checkbox } = window.SlateDesignSystem_59ffb3;

function LoginScreen({ onLogin }) {
  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--surface-page)' }}>
      {/* Form */}
      <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ width: '100%', maxWidth: 340 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 4 }}>
            Slate<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <h1 style={{ fontSize: 25, fontWeight: 700, color: 'var(--text-primary)', margin: '24px 0 6px' }}>Sign In to Billing</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 24px' }}>Manage invoices and customers for your team.</p>
          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Work email" type="email" placeholder="you@company.com" defaultValue="jordan@acme.co" required />
            <Input label="Password" type="password" placeholder="••••••••" defaultValue="password" required />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Checkbox label="Remember me" defaultChecked />
              <a href="#" style={{ fontSize: 13, fontWeight: 500 }}>Forgot password?</a>
            </div>
            <Button variant="primary" fullWidth type="submit">Sign In</Button>
          </form>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
            New to Slate? <a href="#" style={{ fontWeight: 500 }}>Create an account</a>
          </p>
        </div>
      </div>
      {/* Brand statement */}
      <div style={{ flex: '1 1 50%', background: 'var(--slate-900)', color: '#fff', display: 'flex', alignItems: 'center', padding: 48 }}>
        <div style={{ maxWidth: 380 }}>
          <div style={{ fontSize: 33, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Every invoice, paid on time.
          </div>
          <p style={{ fontSize: 16, color: 'var(--slate-300)', lineHeight: 1.6, marginTop: 20 }}>
            “We cut our average days-to-payment from 41 to 12 after switching to Slate. The reminders just work.”
          </p>
          <div style={{ marginTop: 20, fontSize: 14 }}>
            <div style={{ fontWeight: 600 }}>Priya Nair</div>
            <div style={{ color: 'var(--slate-400)' }}>Head of Finance, Northwind Traders</div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.LoginScreen = LoginScreen;
