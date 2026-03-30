export default function TeamPage({ user }) {
  const initials = user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Team Management</h1>
        <p>Manage your team members and their access to RoomLy projects.</p>
      </div>

      <div className="section-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>1 teammate</div>
          <button className="btn btn-primary btn-sm" disabled style={{ opacity: 0.5 }} title="Coming soon">
            Invite teammates
          </button>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr auto',
          borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 4,
        }}>
          {['NAME', 'EMAIL', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
          ))}
        </div>

        {/* Current user row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr auto',
          alignItems: 'center', padding: '14px 0',
          borderBottom: '1px solid rgba(255,255,255,.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--primary-g)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
            }}>{initials}</div>
            <span style={{ fontSize: 14 }}>(me) {user?.email?.split('@')[0] || 'User'}</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>{user?.email || ''}</div>
          <div>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: 20,
              background: 'rgba(108,99,255,.15)', color: 'var(--primary)',
              fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px',
            }}>Owner</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(108,99,255,.06)', border: '1px solid rgba(108,99,255,.2)', borderRadius: 10, fontSize: 13, color: 'var(--muted)' }}>
        <strong style={{ color: 'var(--text)' }}>Coming soon:</strong> Invite teammates with role-based access — Admin, Editor, or Viewer.
      </div>
    </div>
  )
}
