const INVOICES = [
  { no: 'ROOMLY-0001', status: 'Paid', amount: '$0.00', issued: 'Mar 1, 2026', due: 'Mar 1, 2026' },
]

export default function BillingPage() {
  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Billing</h1>
        <p>Invoices and payment details for your RoomLy subscription.</p>
      </div>

      {/* Upcoming bill */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 20, alignItems: 'start' }}>
        <div className="section-card">
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Your upcoming bill</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Total usage</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>$0.00</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              Your next bill will be sent on <strong style={{ color: 'var(--text)' }}>May 1, 2026</strong>
            </div>
          </div>
        </div>

        <div className="section-card" style={{ minWidth: 200 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button disabled style={{ background: 'none', border: 'none', cursor: 'default', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontSize: 13, padding: 0, opacity: 0.5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Add payment method
            </button>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <button disabled style={{ background: 'none', border: 'none', cursor: 'default', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontSize: 13, padding: 0, opacity: 0.5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              Change billing address
            </button>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <button disabled style={{ background: 'none', border: 'none', cursor: 'default', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)', fontSize: 13, padding: 0, opacity: 0.5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              Cancel subscription
            </button>
          </div>
        </div>
      </div>

      {/* Invoice table */}
      <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="rec-table">
          <thead>
            <tr>
              <th style={{ padding: '14px 20px' }}>Invoice No.</th>
              <th style={{ padding: '14px 12px' }}>Status</th>
              <th style={{ padding: '14px 12px' }}>Amount</th>
              <th style={{ padding: '14px 12px' }}>Issue Date</th>
              <th style={{ padding: '14px 12px' }}>Due Date</th>
              <th style={{ padding: '14px 20px' }} />
            </tr>
          </thead>
          <tbody>
            {INVOICES.map(inv => (
              <tr key={inv.no}>
                <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontSize: 13 }}>{inv.no}</td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(52,211,153,.12)', color: 'var(--green)',
                    fontSize: 12, fontWeight: 600,
                  }}>{inv.status}</span>
                </td>
                <td style={{ padding: '14px 12px', fontSize: 14 }}>{inv.amount}</td>
                <td style={{ padding: '14px 12px', color: 'var(--muted)', fontSize: 13 }}>{inv.issued}</td>
                <td style={{ padding: '14px 12px', color: 'var(--muted)', fontSize: 13 }}>{inv.due}</td>
                <td style={{ padding: '14px 20px' }}>
                  <button className="btn btn-ghost btn-sm" style={{ opacity: 0.5 }} disabled>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)' }}>
        Currently on the Free plan — $0.00/month. No charges will be made.
      </div>
    </div>
  )
}
