// InvoicesScreen — master–detail: compact selectable list + full-height detail.
const { Badge, Tag, Button, IconButton, Icon } = window.SlateDesignSystem_59ffb3;

function money(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function InvoicesScreen({ onNewInvoice }) {
  const invoices = window.SlateAppData.invoices;
  const [selectedId, setSelectedId] = React.useState(invoices[0].id);
  const selected = invoices.find((i) => i.id === selectedId);
  const items = window.SlateAppData.lineItems;
  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const tax = subtotal * 0.0875;
  const total = subtotal + tax;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Master list */}
      <div style={{ width: 340, flex: 'none', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>All Invoices · {invoices.length}</span>
          <Button variant="primary" size="sm" leadingIcon="plus" onClick={onNewInvoice}>New</Button>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          {invoices.map((inv) => {
            const on = inv.id === selectedId;
            return (
              <button key={inv.id} onClick={() => setSelectedId(inv.id)}
                style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', padding: '12px 16px',
                  border: 'none', borderBottom: '1px solid var(--border)', borderLeft: on ? '3px solid var(--accent)' : '3px solid transparent',
                  background: on ? 'var(--accent-subtle)' : 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{inv.customer}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{money(inv.amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{inv.id}</span>
                  <Badge tone={inv.tone} dot={inv.tone !== 'neutral'}>{inv.status}</Badge>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail pane */}
      <div style={{ flex: 1, overflow: 'auto', padding: 32, minWidth: 0 }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 style={{ fontSize: 25, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{selected.id}</h2>
                <Badge tone={selected.tone} dot={selected.tone !== 'neutral'}>{selected.status}</Badge>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                {selected.customer} · Issued {selected.date} · Due {selected.due}
              </p>
              <div style={{ marginTop: 10 }}><Tag hue={selected.hue}>{selected.category}</Tag></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="secondary" leadingIcon="paper-airplane">Send Reminder</Button>
              <IconButton icon="arrow-down-tray" label="Download PDF" outline />
              <IconButton icon="ellipsis-horizontal" label="More actions" outline />
            </div>
          </div>

          <div className="sds-card" style={{ marginTop: 24 }}>
            <table className="sds-table">
              <thead><tr><th>Description</th><th style={{ textAlign: 'right' }}>Qty</th><th style={{ textAlign: 'right' }}>Rate</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.desc}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{it.qty}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{money(it.rate)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{money(it.qty * it.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <Row label="Subtotal" value={money(subtotal)} />
              <Row label="Tax (8.75%)" value={money(tax)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', width: 240, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{money(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: 240 }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{value}</span>
    </div>
  );
}
window.InvoicesScreen = InvoicesScreen;
