// OverviewScreen — spacious dashboard: stat cards + annotated chart + recent table.
const { Badge, Button, IconButton } = window.SlateDesignSystem_59ffb3;

function OverviewScreen() {
  const stats = [
    { label: 'Outstanding', value: '$28,420', delta: '+4.2%', hue: 'blue' },
    { label: 'Paid this month', value: '$41,200', delta: '+12.8%', hue: 'teal' },
    { label: 'Overdue', value: '$1,664', delta: '2 invoices', hue: 'amber' },
    { label: 'Avg. days to pay', value: '12 days', delta: '−6 days', hue: 'violet' },
  ];
  const tint = { blue: 'var(--cat-blue-bg)', teal: 'var(--cat-teal-bg)', amber: 'var(--cat-amber-bg)', violet: 'var(--cat-violet-bg)' };
  const tintFg = { blue: 'var(--cat-blue-fg)', teal: 'var(--cat-teal-fg)', amber: 'var(--cat-amber-fg)', violet: 'var(--cat-violet-fg)' };
  const bars = [
    { m: 'Jan', v: 32 }, { m: 'Feb', v: 41 }, { m: 'Mar', v: 38 }, { m: 'Apr', v: 47 },
    { m: 'May', v: 44 }, { m: 'Jun', v: 52 },
  ];
  const max = 60;
  const invoices = window.SlateAppData.invoices.slice(0, 5);
  const money = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div style={{ padding: 32, maxWidth: 1080, margin: '0 auto' }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map((s) => (
          <div key={s.label} className="sds-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 6px', letterSpacing: '-0.01em' }}>{s.value}</div>
            <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: tint[s.hue], color: tintFg[s.hue] }}>{s.delta}</span>
          </div>
        ))}
      </div>

      {/* Chart + revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginTop: 16 }}>
        <div className="sds-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Revenue Collected</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>Last 6 months · thousands USD</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--series-1)' }} />Collected
            </div>
          </div>
          {/* Annotated bar chart */}
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 160, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
              <span>$60k</span><span>$40k</span><span>$20k</span><span>$0</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 160, borderBottom: '1px solid var(--border-strong)', borderLeft: '1px solid var(--border)', paddingLeft: 8 }}>
                {bars.map((b) => (
                  <div key={b.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: `calc(${100 - (b.v / max) * 100}% - 18px)`, fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>${b.v}k</span>
                    <div style={{ width: '100%', maxWidth: 40, height: `${(b.v / max) * 100}%`, background: b.m === 'Jun' ? 'var(--accent)' : 'var(--blue-200)', borderRadius: '3px 3px 0 0' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, paddingLeft: 8, marginTop: 6 }}>
                {bars.map((b) => <span key={b.m} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>{b.m}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="sds-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Collection Rate</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Paid on time, this quarter</p>
          <div style={{ fontSize: 44, fontWeight: 700, color: 'var(--text-primary)', margin: '16px 0 4px', letterSpacing: '-0.02em' }}>94.2%</div>
          <div style={{ height: 8, borderRadius: 4, background: 'var(--surface-sunken)', overflow: 'hidden', marginTop: 8 }}>
            <div style={{ width: '94.2%', height: '100%', background: 'var(--series-2)' }} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 16, lineHeight: 1.5 }}>Up from <strong style={{ color: 'var(--text-primary)' }}>88.1%</strong> last quarter. 6 invoices still awaiting payment.</p>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="sds-card" style={{ marginTop: 16 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Recent Invoices</h3>
          <Button variant="ghost" size="sm" trailingIcon="chevron-right">View all</Button>
        </div>
        <table className="sds-table">
          <thead><tr><th>Invoice</th><th>Customer</th><th>Status</th><th style={{ textAlign: 'right' }}>Amount</th><th></th></tr></thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{inv.id}</td>
                <td style={{ fontWeight: 500 }}>{inv.customer}</td>
                <td><Badge tone={inv.tone} dot={inv.tone !== 'neutral'}>{inv.status}</Badge></td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{money(inv.amount)}</td>
                <td style={{ textAlign: 'right' }}><IconButton icon="ellipsis-horizontal" label="Actions" size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
window.OverviewScreen = OverviewScreen;
