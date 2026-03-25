const PLANS = [
  {
    key: 'basic',
    name: 'Basic',
    price: '$9.99',
    features: ['5 meetings / month', 'Up to 10 participants', 'HD video', 'Email support'],
    highlighted: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$29.99',
    features: ['Unlimited meetings', 'Up to 50 participants', 'HD video + recording', 'Priority support', 'Custom branding'],
    highlighted: true,
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '$99.99',
    features: ['Unlimited meetings', 'Up to 500 participants', '4K video + recording', 'Dedicated support', 'Custom branding', 'SLA guarantee'],
    highlighted: false,
  },
]

export default function PricingView({ onSelectPlan }) {
  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2">
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
          </svg>
          <span style={s.logoText}>WebRTC Platform</span>
        </div>
        <h1 style={s.title}>Choose your plan</h1>
        <p style={s.subtitle}>Start with a one-time sandbox payment. Upgrade anytime.</p>
      </div>

      <div style={s.cards}>
        {PLANS.map(plan => (
          <div key={plan.key} style={{ ...s.card, ...(plan.highlighted ? s.cardHighlighted : {}) }}>
            {plan.highlighted && <div style={s.badge}>Most Popular</div>}
            <div style={s.planName}>{plan.name}</div>
            <div style={s.planPrice}>
              {plan.price}
              <span style={s.planPeriod}>/mo</span>
            </div>
            <ul style={s.features}>
              {plan.features.map(f => (
                <li key={f} style={s.feature}>
                  <span style={s.check}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              style={{ ...s.btn, ...(plan.highlighted ? s.btnHighlighted : {}) }}
              onClick={() => onSelectPlan(plan.key)}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      <p style={s.testNote}>
        Test card: <strong>4242 4242 4242 4242</strong> · any future date · any CVC
      </p>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#202124',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 24px 60px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '24px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#e8eaed',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#e8eaed',
    margin: '0 0 12px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#9aa0a6',
    margin: 0,
  },
  cards: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '960px',
  },
  card: {
    background: '#2d2e31',
    borderRadius: '16px',
    padding: '32px 28px',
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    border: '1.5px solid rgba(255,255,255,0.08)',
    position: 'relative',
  },
  cardHighlighted: {
    border: '1.5px solid #1a73e8',
    background: '#263952',
  },
  badge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a73e8',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 14px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
  planName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#e8eaed',
    marginBottom: '8px',
  },
  planPrice: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#e8eaed',
    marginBottom: '24px',
  },
  planPeriod: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#9aa0a6',
  },
  features: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  feature: {
    fontSize: '14px',
    color: '#bdc1c6',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  check: {
    color: '#34a853',
    fontWeight: '700',
    fontSize: '14px',
  },
  btn: {
    background: 'rgba(26,115,232,0.15)',
    color: '#1a73e8',
    border: '1.5px solid #1a73e8',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
  },
  btnHighlighted: {
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
  },
  testNote: {
    marginTop: '40px',
    fontSize: '13px',
    color: '#9aa0a6',
    background: 'rgba(26,115,232,0.1)',
    borderLeft: '3px solid #1a73e8',
    padding: '10px 16px',
    borderRadius: '6px',
  },
}
