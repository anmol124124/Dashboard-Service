const PLAN_FEATURES = [
  { label: 'Monthly Active Users',  value: '100 MAU',     included: true },
  { label: 'Projects',              value: 'Unlimited',   included: true },
  { label: 'Meeting recordings',    value: 'Included',    included: true },
  { label: 'Analytics dashboard',   value: 'Included',    included: true },
  { label: 'Embed codes',           value: 'Included',    included: true },
  { label: 'Domain allowlist',      value: 'Included',    included: true },
  { label: 'Team members',          value: 'Coming soon', included: false },
  { label: 'Webhooks',              value: 'Coming soon', included: false },
  { label: 'Priority support',      value: 'Not included', included: false },
]

export default function MyPlanPage() {
  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>My Plan</h1>
        <p>Your current subscription and included features.</p>
      </div>

      {/* Current plan card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(108,99,255,.12), rgba(108,99,255,.04))',
        border: '1px solid rgba(108,99,255,.35)',
        borderRadius: 14,
        padding: '28px 28px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            Current Plan
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Free</div>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>100 MAU/month · Unlimited projects</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>$0<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--muted)' }}>/month</span></div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>No credit card required</div>
          <button className="btn btn-primary" style={{ marginTop: 12 }} disabled>
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="section-card">
        <div className="section-card-title">What's included</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PLAN_FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 0',
              borderBottom: i < PLAN_FEATURES.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {f.included ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                )}
                <span style={{ fontSize: 14, color: f.included ? 'var(--text)' : 'var(--muted)' }}>{f.label}</span>
              </div>
              <span style={{ fontSize: 13, color: f.included ? 'var(--green)' : 'var(--muted)', fontWeight: f.included ? 500 : 400 }}>
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(52,211,153,.06)', border: '1px solid rgba(52,211,153,.2)', borderRadius: 10, fontSize: 13, color: 'var(--muted)' }}>
        <strong style={{ color: 'var(--green)' }}>You are on the Free plan.</strong> Upgrade options will be available soon with higher MAU limits, webhooks, and priority support.
      </div>
    </div>
  )
}
