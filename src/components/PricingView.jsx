import { useState } from 'react'

const PLANS = [
  {
    key: 'basic',
    name: 'Basic',
    price: '9.99',
    desc: 'Perfect for individuals and small teams getting started.',
    features: [
      '5 MAU / month',
      '1 project',
      'Unlimited meetings',
      'HD video quality',
      'Chat & screen share',
      'Cloud recording',
      'Email support',
    ],
    highlighted: false,
    icon: '🚀',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '29.99',
    desc: 'Everything you need to run a professional video platform.',
    features: [
      '15 MAU / month',
      '1 project',
      'Unlimited meetings',
      'HD video + cloud recording',
      'Custom branding',
      'Priority support',
      'Analytics dashboard',
    ],
    highlighted: true,
    icon: '⚡',
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '99.99',
    desc: 'Enterprise-grade power for large-scale deployments.',
    features: [
      'Unlimited MAU',
      'Unlimited projects',
      'Unlimited meetings',
      '4K video + cloud recording',
      'White-label solution',
      'Dedicated account manager',
      'SLA guarantee (99.9%)',
    ],
    highlighted: false,
    icon: '👑',
  },
]

const TRUST = [
  { icon: '🔒', text: 'SSL encrypted payments' },
  { icon: '↩️', text: '30-day money-back guarantee' },
  { icon: '🌍', text: 'Cancel anytime, no lock-in' },
]

export default function PricingView({ onSelectPlan }) {
  const [hovered, setHovered] = useState(null)
  const [billing, setBilling] = useState('monthly')

  return (
    <div style={s.page}>

      {/* ── Nav ── */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <div style={s.navLogo}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1a73e8">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </div>
          <span style={s.navBrandName}>WebRTC Platform</span>
        </div>
        <div style={s.navLinks}>
          <span style={s.navLink}>Features</span>
          <span style={s.navLink}>Docs</span>
          <span style={s.navLink}>Contact</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.heroBadge}>Simple, transparent pricing</div>
        <h1 style={s.heroTitle}>
          Choose the plan that<br />
          <span style={s.heroAccent}>fits your needs</span>
        </h1>
        <p style={s.heroSub}>
          Start free, scale when ready. No hidden fees. No surprises.
        </p>

        {/* Billing toggle */}
        <div style={s.toggle}>
          <button
            style={{ ...s.toggleBtn, ...(billing === 'monthly' ? s.toggleActive : {}) }}
            onClick={() => setBilling('monthly')}
          >Monthly</button>
          <button
            style={{ ...s.toggleBtn, ...(billing === 'annual' ? s.toggleActive : {}) }}
            onClick={() => setBilling('annual')}
          >
            Annual
            <span style={s.saveBadge}>Save 20%</span>
          </button>
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={s.cards}>
        {PLANS.map(plan => {
          const isHovered = hovered === plan.key
          const price = billing === 'annual'
            ? (parseFloat(plan.price) * 0.8).toFixed(2)
            : plan.price

          return (
            <div
              key={plan.key}
              style={{
                ...s.card,
                ...(plan.highlighted ? s.cardPro : {}),
                ...(isHovered && !plan.highlighted ? s.cardHover : {}),
              }}
              onMouseEnter={() => setHovered(plan.key)}
              onMouseLeave={() => setHovered(null)}
            >
              {plan.highlighted && (
                <div style={s.popularBanner}>
                  ⭐ Most Popular
                </div>
              )}

              <div style={s.cardTop}>
                <div style={s.planIcon}>{plan.icon}</div>
                <div style={s.planName}>{plan.name}</div>
                <p style={s.planDesc}>{plan.desc}</p>

                <div style={s.priceRow}>
                  <span style={s.dollar}>$</span>
                  <span style={s.price}>{price}</span>
                  <span style={s.period}>/ mo</span>
                </div>
                {billing === 'annual' && (
                  <div style={s.annualNote}>
                    Billed ${(parseFloat(price) * 12).toFixed(2)} / year
                  </div>
                )}
              </div>

              <div style={s.divider} />

              <ul style={s.featureList}>
                {plan.features.map(f => (
                  <li key={f} style={s.featureItem}>
                    <span style={s.checkIcon}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="7" fill={plan.highlighted ? '#1a73e8' : '#1e3a2f'} />
                        <path d="M4 7l2 2 4-4" stroke={plan.highlighted ? '#fff' : '#34a853'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span style={s.featureText}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                style={{
                  ...s.btn,
                  ...(plan.highlighted ? s.btnPro : {}),
                  ...(isHovered && !plan.highlighted ? s.btnHover : {}),
                }}
                onClick={() => onSelectPlan(plan.key)}
              >
                Get started with {plan.name}
                <span style={s.arrow}>→</span>
              </button>
            </div>
          )
        })}
      </div>

      {/* ── Trust bar ── */}
      <div style={s.trustBar}>
        {TRUST.map(t => (
          <div key={t.text} style={s.trustItem}>
            <span style={s.trustIcon}>{t.icon}</span>
            <span style={s.trustText}>{t.text}</span>
          </div>
        ))}
      </div>

      {/* ── Test card note ── */}
      <div style={s.testCard}>
        <span style={s.testCardIcon}>🧪</span>
        <span>
          <strong style={{ color: '#e8eaed' }}>Sandbox mode</strong> — Use test card&nbsp;
          <code style={s.code}>4242 4242 4242 4242</code>, any future date, any CVC
        </span>
      </div>

    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #1a1c22 0%, #202124 60%, #1c2333 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#e8eaed',
    paddingBottom: '60px',
  },

  // Nav
  nav: {
    width: '100%',
    maxWidth: '1100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '22px 32px',
    boxSizing: 'border-box',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo: {
    width: '36px', height: '36px',
    background: 'rgba(26,115,232,0.15)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  navBrandName: { fontSize: '16px', fontWeight: '700', color: '#e8eaed' },
  navLinks: { display: 'flex', gap: '28px' },
  navLink: { fontSize: '14px', color: '#9aa0a6', cursor: 'pointer' },

  // Hero
  hero: {
    textAlign: 'center',
    padding: '48px 24px 40px',
    maxWidth: '640px',
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(26,115,232,0.15)',
    border: '1px solid rgba(26,115,232,0.35)',
    color: '#4d94ff',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '5px 14px',
    borderRadius: '20px',
    marginBottom: '20px',
  },
  heroTitle: {
    fontSize: '44px',
    fontWeight: '800',
    lineHeight: '1.2',
    margin: '0 0 16px',
    letterSpacing: '-0.02em',
  },
  heroAccent: {
    background: 'linear-gradient(90deg, #1a73e8, #4d94ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    fontSize: '16px',
    color: '#9aa0a6',
    margin: '0 0 32px',
    lineHeight: '1.6',
  },

  // Billing toggle
  toggle: {
    display: 'inline-flex',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '4px',
    gap: '4px',
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9aa0a6',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 20px',
    borderRadius: '9px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  toggleActive: {
    background: '#2d2e31',
    color: '#e8eaed',
    boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
  },
  saveBadge: {
    background: 'linear-gradient(90deg, #34a853, #1e8e3e)',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '10px',
  },

  // Cards
  cards: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '1060px',
    padding: '0 24px',
    boxSizing: 'border-box',
  },
  card: {
    background: '#25262b',
    borderRadius: '20px',
    padding: '32px 28px',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255,255,255,0.07)',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
  },
  cardPro: {
    background: 'linear-gradient(160deg, #1c2e4a 0%, #1a2438 100%)',
    border: '1px solid rgba(26,115,232,0.4)',
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 60px rgba(26,115,232,0.2)',
  },
  popularBanner: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(90deg, #1a73e8, #4d94ff)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '5px 16px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
    letterSpacing: '0.03em',
    boxShadow: '0 4px 12px rgba(26,115,232,0.4)',
  },

  cardTop: { marginBottom: '20px' },
  planIcon: { fontSize: '28px', marginBottom: '12px' },
  planName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#e8eaed',
    marginBottom: '6px',
  },
  planDesc: {
    fontSize: '13px',
    color: '#9aa0a6',
    lineHeight: '1.5',
    margin: '0 0 20px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '2px',
    marginBottom: '4px',
  },
  dollar: { fontSize: '20px', fontWeight: '600', color: '#bdc1c6', paddingBottom: '6px' },
  price: { fontSize: '48px', fontWeight: '800', color: '#e8eaed', lineHeight: '1' },
  period: { fontSize: '15px', color: '#9aa0a6', paddingBottom: '8px', marginLeft: '4px' },
  annualNote: {
    fontSize: '12px',
    color: '#34a853',
    fontWeight: '500',
    marginBottom: '4px',
  },

  divider: {
    borderTop: '1px solid rgba(255,255,255,0.07)',
    margin: '20px 0',
  },

  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkIcon: { flexShrink: 0, display: 'flex' },
  featureText: {
    fontSize: '14px',
    color: '#bdc1c6',
    lineHeight: '1.4',
  },

  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.06)',
    color: '#e8eaed',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s',
  },
  btnHover: {
    background: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  btnPro: {
    background: 'linear-gradient(90deg, #1a73e8, #4d94ff)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 16px rgba(26,115,232,0.4)',
  },
  arrow: { fontSize: '16px' },

  // Trust bar
  trustBar: {
    display: 'flex',
    gap: '36px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '44px',
    padding: '20px 32px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  trustItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  trustIcon: { fontSize: '16px' },
  trustText: { fontSize: '13px', color: '#9aa0a6' },

  // Test card note
  testCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '28px',
    padding: '12px 20px',
    background: 'rgba(26,115,232,0.08)',
    border: '1px solid rgba(26,115,232,0.2)',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#9aa0a6',
    maxWidth: '600px',
    textAlign: 'center',
  },
  testCardIcon: { fontSize: '16px', flexShrink: 0 },
  code: {
    background: 'rgba(255,255,255,0.08)',
    padding: '2px 8px',
    borderRadius: '5px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#4d94ff',
    letterSpacing: '0.05em',
  },
}
