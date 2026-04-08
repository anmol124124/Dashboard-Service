const PLANS = [
  {
    key: 'free',
    name: 'Starter',
    price: null,
    priceLabel: 'Free',
    priceSub: 'No credit card required',
    color: '#6b7280',
    accentColor: '#6b7280',
    popular: false,
    cta: null,
    features: [
      { label: '1 project',                   included: true  },
      { label: '5 MAU / month',               included: true  },
      { label: 'Unlimited meetings',           included: true  },
      { label: 'HD video & audio',             included: true  },
      { label: 'Chat & screen share',          included: true  },
      { label: 'Cloud recording',              included: true  },
      { label: 'Email support',                included: true  },
      { label: 'Custom branding',              included: false },
      { label: 'Priority support',             included: false },
      { label: 'Analytics dashboard',          included: false },
      { label: 'Unlimited projects',           included: false },
      { label: 'White-label solution',         included: false },
    ],
  },
  {
    key: 'basic',
    name: 'Basic',
    price: '$9.99',
    priceLabel: '$9.99',
    priceSub: 'per month',
    color: '#1a73e8',
    accentColor: '#1a73e8',
    popular: false,
    cta: 'Upgrade',
    features: [
      { label: '1 project',                   included: true  },
      { label: '5 MAU / month',               included: true  },
      { label: 'Unlimited meetings',           included: true  },
      { label: 'HD video & audio',             included: true  },
      { label: 'Chat & screen share',          included: true  },
      { label: 'Cloud recording',              included: true  },
      { label: 'Email support',                included: true  },
      { label: 'Custom branding',              included: false },
      { label: 'Priority support',             included: false },
      { label: 'Analytics dashboard',          included: false },
      { label: 'Unlimited projects',           included: false },
      { label: 'White-label solution',         included: false },
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$29.99',
    priceLabel: '$29.99',
    priceSub: 'per month',
    color: '#6c63ff',
    accentColor: '#6c63ff',
    popular: true,
    cta: 'Upgrade',
    features: [
      { label: '1 project',                   included: true  },
      { label: '15 MAU / month',              included: true  },
      { label: 'Unlimited meetings',           included: true  },
      { label: 'HD video + recording',         included: true  },
      { label: 'Chat & screen share',          included: true  },
      { label: 'Custom branding',              included: true  },
      { label: 'Priority support',             included: true  },
      { label: 'Analytics dashboard',          included: true  },
      { label: 'Unlimited projects',           included: false },
      { label: 'White-label solution',         included: false },
      { label: 'Dedicated account manager',    included: false },
      { label: 'SLA guarantee (99.9%)',        included: false },
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '$99.99',
    priceLabel: '$99.99',
    priceSub: 'per month',
    color: '#f59e0b',
    accentColor: '#f59e0b',
    popular: false,
    cta: 'Upgrade',
    features: [
      { label: 'Unlimited projects',           included: true  },
      { label: 'Unlimited MAU',                included: true  },
      { label: 'Unlimited meetings',           included: true  },
      { label: '4K video + recording',         included: true  },
      { label: 'Chat & screen share',          included: true  },
      { label: 'Custom branding',              included: true  },
      { label: 'White-label solution',         included: true  },
      { label: 'Analytics dashboard',          included: true  },
      { label: 'Dedicated account manager',    included: true  },
      { label: 'SLA guarantee (99.9%)',        included: true  },
      { label: 'Priority support',             included: true  },
      { label: 'Custom integrations',          included: true  },
    ],
  },
]

const PLAN_ORDER = ['free', 'basic', 'pro', 'premium']

function CheckIcon({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color || '#34a853'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, opacity: 0.4 }}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

export default function MyPlanPage({ user, onUpgrade }) {
  const currentPlanKey = user?.plan || 'free'
  const currentIdx     = PLAN_ORDER.indexOf(currentPlanKey)

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Plans &amp; Pricing</h1>
        <p>Choose the plan that fits your needs. Upgrade or downgrade at any time.</p>
      </div>

      {/* Plan cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 0,
        border: '1px solid var(--border)',
        borderRadius: 18,
        overflow: 'hidden',
        background: 'var(--surface2)',
      }}>
        {PLANS.map((plan, idx) => {
          const isCurrent   = plan.key === currentPlanKey
          const canUpgrade  = PLAN_ORDER.indexOf(plan.key) > currentIdx
          const isDowngrade = PLAN_ORDER.indexOf(plan.key) < currentIdx && plan.key !== 'free'
          const isPopular   = plan.popular

          return (
            <div
              key={plan.key}
              style={{
                position: 'relative',
                borderRight: idx < PLANS.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                background: isPopular
                  ? `linear-gradient(180deg, ${plan.color}14 0%, var(--surface2) 120px)`
                  : 'transparent',
              }}
            >
              {/* Most Popular banner */}
              {isPopular && (
                <div style={{
                  background: plan.color,
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '6px 0',
                }}>
                  Most Popular
                </div>
              )}
              {!isPopular && <div style={{ height: 0 }} />}

              <div style={{ padding: '24px 22px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Plan name + current badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: plan.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    {plan.name}
                  </span>
                  {isCurrent && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: plan.color,
                      border: `1.5px solid ${plan.color}`,
                      borderRadius: 4,
                      padding: '2px 6px',
                      letterSpacing: '0.06em',
                    }}>
                      CURRENT
                    </span>
                  )}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 20 }}>
                  {plan.price ? (
                    <>
                      <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>
                        {plan.priceLabel}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                        {plan.priceSub}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>
                        Free
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                        {plan.priceSub}
                      </div>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                {isCurrent ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '10px 0',
                    fontSize: 13,
                    fontWeight: 600,
                    color: plan.color,
                    border: `1.5px solid ${plan.color}40`,
                    borderRadius: 8,
                    marginBottom: 20,
                  }}>
                    ✓ Your current plan
                  </div>
                ) : canUpgrade ? (
                  <button
                    onClick={() => onUpgrade && onUpgrade(plan.key)}
                    style={{
                      background: isPopular
                        ? `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`
                        : 'transparent',
                      color: isPopular ? '#fff' : plan.color,
                      border: `1.5px solid ${plan.color}`,
                      borderRadius: 8,
                      padding: '10px 0',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                      marginBottom: 20,
                      transition: 'all .15s',
                      boxShadow: isPopular ? `0 4px 16px ${plan.color}40` : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isPopular) {
                        e.currentTarget.style.background = `${plan.color}18`
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isPopular) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    Upgrade
                  </button>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '10px 0',
                    fontSize: 13,
                    color: 'var(--muted)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 8,
                    marginBottom: 20,
                    opacity: 0.5,
                  }}>
                    {plan.key === 'free' ? 'Included' : 'Downgrade'}
                  </div>
                )}

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border)', marginBottom: 16 }} />

                {/* Feature list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {plan.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      {f.included
                        ? <CheckIcon color={plan.color} />
                        : <XIcon />
                      }
                      <span style={{
                        fontSize: 13,
                        lineHeight: 1.4,
                        color: f.included ? 'var(--text)' : 'var(--muted)',
                        opacity: f.included ? 1 : 0.5,
                      }}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom note */}
      <p style={{ marginTop: 16, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        All plans include a sandbox environment. Payments are simulated — no real charges.
      </p>
    </div>
  )
}
