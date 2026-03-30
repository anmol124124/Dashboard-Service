const RELEASES = [
  {
    version: 'v1.2.0',
    date: 'March 30, 2026',
    eol: 'September 30, 2026',
    current: true,
    notes: ['SVG line chart in Activity dashboard', 'Recording upload to backend storage', 'JaaS-style sidebar navigation', 'Guest embed code support'],
  },
  {
    version: 'v1.1.0',
    date: 'March 15, 2026',
    eol: 'September 15, 2026',
    current: false,
    notes: ['Analytics modal with meeting history', 'Participant tracking (join/leave)', 'Domain allowlist for embed security', 'CSV export for meetings'],
  },
  {
    version: 'v1.0.0',
    date: 'March 1, 2026',
    eol: 'September 1, 2026',
    current: false,
    notes: ['Initial release', 'WebRTC meetings via MediaSoup', 'Host & guest embed codes', 'JWT-based authentication'],
  },
]

export default function ReleasesPage() {
  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Releases</h1>
        <p>
          RoomLy always uses the latest release by default. Each release is supported until its end-of-life date.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {RELEASES.map(r => (
          <div key={r.version} style={{
            border: `1px solid ${r.current ? 'rgba(108,99,255,.4)' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '20px 24px',
            background: r.current ? 'rgba(108,99,255,.04)' : 'rgba(255,255,255,.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: r.current ? 14 : 10 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                Release {r.version} — {r.date}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>End of life: {r.eol}</div>
            </div>

            {r.current && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(108,99,255,.15)', border: '1px solid rgba(108,99,255,.3)',
                borderRadius: 6, padding: '4px 12px', fontSize: 13, color: 'var(--primary)',
                fontWeight: 500, marginBottom: 14,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                This is the release you are currently using.
              </div>
            )}

            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {r.notes.map((n, i) => (
                <li key={i} style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4, lineHeight: 1.5 }}>{n}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <span style={{ fontSize: 13, color: 'var(--primary)', cursor: 'default' }}>More release notes coming soon →</span>
      </div>
    </div>
  )
}
