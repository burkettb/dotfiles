// AppShell — icon-and-label nav rail + top bar. Wraps every in-app screen.
const { NavItem, IconButton, Icon, Button } = window.SlateDesignSystem_59ffb3;

function AppShell({ active, onNavigate, title, actions, children, onLogout }) {
  const nav = window.SlateAppData.nav;
  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--surface-page)' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, flex: 'none', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--surface-muted)' }}>
        <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Slate<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Billing</span>
        </div>
        <nav style={{ padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {nav.map((n) => (
            <NavItem key={n.label} icon={n.icon} active={active === n.label} onClick={() => onNavigate(n.label)}>
              {n.label}
            </NavItem>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--slate-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flex: 'none' }}>JD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Jordan Diaz</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>jordan@acme.co</div>
          </div>
          <IconButton icon="arrow-right-on-rectangle" label="Sign out" size="sm" onClick={onLogout} />
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: 60, flex: 'none', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px' }}>
          <h1 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{title}</h1>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative', width: 260 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}><Icon name="magnifying-glass" size={16} /></span>
            <input className="sds-input" placeholder="Search invoices, customers…" style={{ paddingLeft: 34, height: 34 }} />
          </div>
          {actions}
        </header>
        <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}
window.AppShell = AppShell;
