// Marketing site sections for Slate. Composes design-system primitives.
const { Button, Badge, Tag, Icon } = window.SlateDesignSystem_59ffb3;

function SiteNav() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', gap: 32 }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Slate<span style={{ color: 'var(--accent)' }}>.</span></span>
        <nav style={{ display: 'flex', gap: 24, flex: 1 }}>
          {['Product', 'Pricing', 'Customers', 'Docs'].map((l) => (
            <a key={l} href="#" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{l}</a>
          ))}
        </nav>
        <a href="#" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>Sign in</a>
        <Button variant="primary" size="sm">Start Free Trial</Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center', minHeight: 480 }}>
        <div style={{ padding: '64px 0' }}>
          <h1 style={{ fontSize: 59, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--text-primary)', margin: '0' }}>
            Get invoices paid<br />in days, not weeks.
          </h1>
          <p style={{ fontSize: 19, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '24px 0 0', maxWidth: 460 }}>
            Slate sends invoices, chases late payments, and reconciles receipts automatically — so your team stops doing it by hand.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <Button variant="primary" size="lg">Start Free Trial</Button>
            <Button variant="secondary" size="lg" trailingIcon="play">Watch Demo</Button>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>No credit card required · 14-day trial</p>
        </div>
        {/* Product visual stand-in */}
        <div style={{ position: 'relative', padding: '48px 0' }}>
          <div className="sds-card" style={{ boxShadow: 'var(--shadow-modal)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-muted)' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>INV-0421</span>
              <Badge tone="success" dot>Paid</Badge>
              <span style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>$4,820.00</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Platform subscription', '$3,840'], ['API overage', '$640'], ['Priority support', '$180']].map(([d, a]) => (
                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span>{d}</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{a}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                <span>Total</span><span style={{ fontFamily: 'var(--font-mono)' }}>$4,820.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: 'paper-airplane', title: 'Send in Seconds', body: 'Create and send branded invoices from a template or the API. Recurring billing runs itself.' },
    { icon: 'bell-alert', title: 'Automatic Reminders', body: 'Polite, escalating nudges go out on a schedule you set — no more awkward follow-up emails.' },
    { icon: 'arrow-path', title: 'Reconciliation', body: 'Payments match to invoices automatically across Stripe, ACH, and wire. Books stay clean.' },
    { icon: 'chart-bar', title: 'Cash-flow Reporting', body: 'See outstanding, overdue, and projected revenue in one dashboard — export anytime.' },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
      <h2 style={{ fontSize: 33, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0, maxWidth: 560 }}>
        Everything between "invoice sent" and "money in the bank."
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 40 }}>
        {items.map((f) => (
          <div key={f.title}>
            <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--accent-subtle)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={f.icon} size={20} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: '16px 0 6px' }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: 'Starter', price: '$0', cadence: '/mo', desc: 'For freelancers testing the waters.', cta: 'Start Free', promoted: false,
      feats: ['Up to 10 invoices / mo', 'Manual reminders', '1 team member', 'Email support'] },
    { name: 'Team', price: '$320', cadence: '/mo', desc: 'For growing finance teams.', cta: 'Start Free Trial', promoted: true,
      feats: ['Unlimited invoices', 'Automatic reminders', 'Up to 12 members', 'Reconciliation', 'Priority support'] },
    { name: 'Enterprise', price: 'Custom', cadence: '', desc: 'For high-volume billing.', cta: 'Contact Sales', promoted: false,
      feats: ['Everything in Team', 'SSO & SAML', 'Dedicated CSM', 'Custom contracts', 'SLA'] },
  ];
  return (
    <section style={{ background: 'var(--surface-muted)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontSize: 33, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>Pricing that scales with your invoices</h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginTop: 12 }}>Start free. Upgrade when reminders start paying for themselves.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40, alignItems: 'start' }}>
          {tiers.map((t) => (
            <div key={t.name} className="sds-card" style={{ padding: 28, background: 'var(--surface-card)',
              borderColor: t.promoted ? 'var(--accent)' : 'var(--border)', borderWidth: t.promoted ? 2 : 1, position: 'relative' }}>
              {t.promoted && <span style={{ position: 'absolute', top: -11, left: 28 }}><Badge tone="info">Most popular</Badge></span>}
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
              <div style={{ margin: '12px 0 4px' }}>
                <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{t.price}</span>
                <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>{t.cadence}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px' }}>{t.desc}</p>
              <Button variant={t.promoted ? 'primary' : 'secondary'} fullWidth>{t.cta}</Button>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.feats.map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent)', flex: 'none' }}><Icon name="check" size={16} /></span>{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13 }}><a href="#">Compare all features →</a></p>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    { q: 'Days-to-payment dropped from 41 to 12. The automatic reminders alone paid for the year.', n: 'Priya Nair', r: 'Head of Finance, Northwind Traders' },
    { q: 'We bill 2,400 invoices a month and reconciliation used to take three days. Now it takes none.', n: 'Marcus Lee', r: 'Controller, Globex Corp' },
    { q: 'Switched from spreadsheets and never looked back. Our overdue balance is down 60%.', n: 'Sofia Alvarez', r: 'Founder, Initech' },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {quotes.map((t) => (
          <div key={t.n} className="sds-card" style={{ padding: 24 }}>
            <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>“{t.q}”</p>
            <div style={{ marginTop: 20, fontSize: 13 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.n}</div>
              <div style={{ color: 'var(--text-muted)' }}>{t.r}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section style={{ background: 'var(--slate-900)', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
        <div>
          <h2 style={{ fontSize: 33, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Stop chasing payments by hand.</h2>
          <p style={{ fontSize: 16, color: 'var(--slate-300)', marginTop: 10 }}>Start a free 14-day trial. No credit card required.</p>
        </div>
        <Button variant="primary" size="lg">Start Free Trial</Button>
      </div>
    </section>
  );
}

function SiteFooter() {
  const cols = { Product: ['Features', 'Pricing', 'Integrations', 'Changelog'], Company: ['About', 'Customers', 'Careers', 'Contact'], Resources: ['Docs', 'API', 'Status', 'Security'] };
  return (
    <footer style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px', display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: 32 }}>
        <div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Slate<span style={{ color: 'var(--accent)' }}>.</span></span>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10, maxWidth: 240, lineHeight: 1.6 }}>Invoicing and payment collection for modern finance teams.</p>
        </div>
        {Object.entries(cols).map(([h, links]) => (
          <div key={h}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 12 }}>{h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.map((l) => <li key={l}><a href="#" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 32px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
        © 2026 Slate, Inc. · Placeholder brand for the design system.
      </div>
    </footer>
  );
}

function MarketingPage() {
  return (
    <div>
      <SiteNav /><Hero /><Features /><Pricing /><Testimonials /><CTA /><SiteFooter />
    </div>
  );
}
window.MarketingPage = MarketingPage;
