const PLANS = {
  basic: {
    name: 'Basic',
    price: '$9.99',
    mauLimit: 5,
    mauLabel: '5 MAU / month',
    projectLimit: '1 project',
    color: '#6c63ff',
    features: [
      { label: 'Monthly Active Users',  value: '5 MAU / month',    included: true },
      { label: 'Projects',              value: '1 project',        included: true },
      { label: 'Meetings',              value: 'Unlimited',        included: true },
      { label: 'HD video quality',      value: 'Included',         included: true },
      { label: 'Chat & screen share',   value: 'Included',         included: true },
      { label: 'Cloud recording',       value: 'Included',         included: true },
      { label: 'Email support',         value: 'Included',         included: true },
      { label: 'Custom branding',       value: 'Not included',     included: false },
      { label: 'Priority support',      value: 'Not included',     included: false },
      { label: 'Analytics dashboard',   value: 'Not included',     included: false },
    ],
  },
  pro: {
    name: 'Pro',
    price: '$29.99',
    mauLimit: 15,
    mauLabel: '15 MAU / month',
    projectLimit: '1 project',
    color: '#1a73e8',
    features: [
      { label: 'Monthly Active Users',  value: '15 MAU / month',   included: true },
      { label: 'Projects',              value: '1 project',        included: true },
      { label: 'Meetings',              value: 'Unlimited',        included: true },
      { label: 'HD video + recording',  value: 'Included',         included: true },
      { label: 'Chat & screen share',   value: 'Included',         included: true },
      { label: 'Custom branding',       value: 'Included',         included: true },
      { label: 'Priority support',      value: 'Included',         included: true },
      { label: 'Analytics dashboard',   value: 'Included',         included: true },
      { label: 'Unlimited projects',    value: 'Not included',     included: false },
      { label: 'White-label solution',  value: 'Not included',     included: false },
    ],
  },
  premium: {
    name: 'Premium',
    price: '$99.99',
    mauLimit: null,
    mauLabel: 'Unlimited MAU',
    projectLimit: 'Unlimited projects',
    color: '#f59e0b',
    features: [
      { label: 'Monthly Active Users',  value: 'Unlimited',        included: true },
      { label: 'Projects',              value: 'Unlimited',        included: true },
      { label: 'Meetings',              value: 'Unlimited',        included: true },
      { label: '4K video + recording',  value: 'Included',         included: true },
      { label: 'Chat & screen share',   value: 'Included',         included: true },
      { label: 'Custom branding',       value: 'Included',         included: true },
      { label: 'White-label solution',  value: 'Included',         included: true },
      { label: 'Analytics dashboard',   value: 'Included',         included: true },
      { label: 'Dedicated account mgr', value: 'Included',         included: true },
      { label: 'SLA guarantee (99.9%)', value: 'Included',         included: true },
    ],
  },
}

export default function MyPlanPage({ user, onUpgrade }) {
  const planKey = user?.plan || 'basic'
  const plan = PLANS[planKey] || PLANS.basic
  const isPremium = planKey === 'premium'
  const isPro = planKey === 'pro'

  // Next upgrade target
  const upgradeTarget = planKey === 'basic' ? 'pro' : planKey === 'pro' ? 'premium' : null
  const upgradePrice = upgradeTarget === 'pro' ? '$29.99' : upgradeTarget === 'premium' ? '$99.99' : null

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>My Plan</h1>
        <p>Your current subscription and what's included.</p>
      </div>

      {/* Current plan banner */}
      <div style={{
        background: `linear-gradient(135deg, ${plan.color}18, ${plan.color}08)`,
        border: `1px solid ${plan.color}40`,
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
          <div style={{ fontSize: 12, color: plan.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            Current Plan
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 6, color: 'var(--text)' }}>
            {plan.name}
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>
            {plan.mauLabel} · {plan.projectLimit}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>
            {plan.price}
            <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--muted)' }}>/month</span>
          </div>
          {!isPremium && upgradeTarget && (
            <button
              className="btn btn-primary"
              style={{ marginTop: 14 }}
              onClick={() => onUpgrade && onUpgrade()}
            >
              Upgrade to {PLANS[upgradeTarget].name} — {upgradePrice}/mo →
            </button>
          )}
          {isPremium && (
            <div style={{ fontSize: 13, color: plan.color, fontWeight: 600, marginTop: 8 }}>
              ✓ You're on the highest tier
            </div>
          )}
        </div>
      </div>

      {/* MAU usage bar */}
      <div className="section-card" style={{ marginBottom: 20 }}>
        <div className="section-card-title">Monthly Active Users</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: 'var(--text)' }}>
            {plan.mauLimit === null ? 'Unlimited — no restrictions' : `Limit: ${plan.mauLimit} unique users / month`}
          </span>
          {plan.mauLimit !== null && (
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Resets monthly</span>
          )}
        </div>
        {plan.mauLimit !== null && (
          <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 99 }}>
            <div style={{
              height: '100%',
              width: '100%',
              borderRadius: 99,
              background: `linear-gradient(90deg, ${plan.color}, ${plan.color}aa)`,
            }} />
          </div>
        )}
        <p style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
          MAU = unique participants who join meetings in a calendar month.
          The same person joining multiple meetings counts as <strong style={{ color: 'var(--text)' }}>1 MAU</strong>.
        </p>
      </div>

      {/* Features list */}
      <div className="section-card">
        <div className="section-card-title">What's included in {plan.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {plan.features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 0',
              borderBottom: i < plan.features.length - 1 ? '1px solid var(--border)' : 'none',
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

      {/* Upgrade nudge for non-premium */}
      {!isPremium && (
        <div style={{ marginTop: 16, padding: '16px 20px', background: `${plan.color}0d`, border: `1px solid ${plan.color}30`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <strong style={{ color: 'var(--text)', fontSize: 14 }}>
              Want more {upgradeTarget === 'premium' ? 'unlimited MAU + unlimited projects' : 'MAU and features'}?
            </strong>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>
              Upgrade to {PLANS[upgradeTarget]?.name} for {upgradePrice}/mo
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => onUpgrade && onUpgrade()}>
            View upgrade options →
          </button>
        </div>
      )}
    </div>
  )
}
