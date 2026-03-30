export default function WebhooksPage() {
  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Webhooks</h1>
        <p>Get notified when events happen in your meetings.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="section-card">
          <div className="section-card-title">Webhook Attempts</div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Successful</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>0</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }} />
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Failed</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>0</div>
            </div>
          </div>
          {/* Placeholder chart */}
          <div style={{ height: 60, background: 'rgba(255,255,255,.02)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>No data</span>
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-title">Webhook Response Time</div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
            {[['Min', '0ms'], ['Avg', '0ms'], ['Max', '0ms']].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 60, background: 'rgba(255,255,255,.02)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>No data</span>
          </div>
        </div>
      </div>

      {/* Time filter */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginBottom: 20 }}>
        {['4h', '12h', '24h', '1w'].map((t, i) => (
          <button key={t} style={{
            padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: i === 3 ? 'var(--primary)' : 'rgba(255,255,255,.05)',
            border: i === 3 ? 'none' : '1px solid var(--border)',
            color: i === 3 ? '#fff' : 'var(--muted)',
          }}>{t}</button>
        ))}
      </div>

      {/* Endpoints */}
      <div className="section-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600 }}>Endpoints</h3>
          <button className="btn btn-primary btn-sm" disabled style={{ opacity: 0.5 }}>
            Add endpoint
          </button>
        </div>
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '20px 24px',
          background: 'rgba(255,255,255,.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Learn how to setup your first webhook</div>
              <div style={{ fontSize: 13, color: 'var(--primary)', cursor: 'default' }}>
                Webhooks are coming soon — stay tuned!
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(108,99,255,.06)', border: '1px solid rgba(108,99,255,.2)', borderRadius: 10, fontSize: 13, color: 'var(--muted)' }}>
        <strong style={{ color: 'var(--text)' }}>Coming soon:</strong> Subscribe to real-time events — meeting started, participant joined, recording saved — and receive HTTP POST notifications to your endpoint.
      </div>
    </div>
  )
}
