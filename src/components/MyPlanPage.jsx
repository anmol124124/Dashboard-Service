import { useState } from 'react'
import { submitContactInquiry } from '../api.js'

const ENTERPRISE_COLOR = '#f59e0b'
const EMPLOYEE_SIZES = ['1–10', '11–50', '51–200', '201–500', '501–1000', '1000+']

function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', employee_size:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return }
    setError('')
    setLoading(true)
    try {
      await submitContactInquiry(form)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 8, padding: '10px 14px', color: '#e8eaed', fontSize: 14,
    outline: 'none', fontFamily: 'inherit',
  }
  const lbl = { fontSize: 12, fontWeight: 600, color: '#9aa0a6', marginBottom: 6, display: 'block' }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#1e2029', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16,
        padding: '32px 36px', width: '100%', maxWidth: 520,
        boxShadow: '0 24px 64px rgba(0,0,0,.6)', maxHeight: '90vh', overflowY: 'auto',
      }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e8eaed', margin: '0 0 12px' }}>Thanks for reaching out!</h2>
            <p style={{ fontSize: 14, color: '#9aa0a6', margin: '0 0 28px', lineHeight: 1.6 }}>
              Our team will get back to you shortly to discuss how RoomLy Enterprise can work for your organisation.
            </p>
            <button onClick={onClose} style={{ padding: '10px 32px', background: `linear-gradient(135deg,${ENTERPRISE_COLOR},#d97706)`, border: 'none', borderRadius: 9, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: ENTERPRISE_COLOR, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Enterprise</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e8eaed', margin: '0 0 6px' }}>Contact Sales</h2>
              <p style={{ fontSize: 13, color: '#9aa0a6', margin: 0 }}>Tell us about your team and we'll put together a custom plan for you.</p>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Full Name *</label>
                  <input style={inp} placeholder="Jane Smith" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Work Email *</label>
                  <input style={inp} type="email" placeholder="jane@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={lbl}>Phone Number</label>
                  <input style={inp} placeholder="+1 555 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Company Name</label>
                  <input style={inp} placeholder="Acme Inc." value={form.company} onChange={e => set('company', e.target.value)} />
                </div>
              </div>
              <div>
                <label style={lbl}>Company Size</label>
                <select style={{ ...inp, appearance: 'none', cursor: 'pointer' }} value={form.employee_size} onChange={e => set('employee_size', e.target.value)}>
                  <option value="">Select employee count</option>
                  {EMPLOYEE_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Message (optional)</label>
                <textarea style={{ ...inp, resize: 'vertical', minHeight: 90 }} placeholder="Tell us about your use case…" value={form.message} onChange={e => set('message', e.target.value)} />
              </div>
              {error && (
                <div style={{ background: 'rgba(234,67,53,.12)', border: '1px solid rgba(234,67,53,.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ff6b6b' }}>{error}</div>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" onClick={onClose} style={{ padding: '10px 22px', background: 'transparent', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, color: '#9aa0a6', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '10px 28px', background: `linear-gradient(135deg,${ENTERPRISE_COLOR},#d97706)`, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Sending…' : 'Submit'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const PLANS = [
  {
    key: 'free',
    name: 'Starter',
    price: null,
    priceLabel: 'Free',
    priceSub: 'No credit card required',
    tagline: 'Free for individuals getting started.',
    color: '#6b7280',
    popular: false,
    inherits: null,
    groups: [
      { icon: '🎥', label: 'Meetings',      items: ['40-minute meetings', 'Up to 100 participants'] },
      { icon: '📹', label: 'Video & Audio', items: ['HD video quality', 'Noise cancellation'] },
      { icon: '☁️', label: 'Recording',     items: ['Cloud recording included'] },
      { icon: '💬', label: 'Chat',          items: ['In-meeting messaging', 'Screen share'] },
      { icon: '📁', label: 'Projects',      items: ['1 project', '5 monthly active users'] },
    ],
  },
  {
    key: 'basic',
    name: 'Basic',
    price: '$9.99',
    priceLabel: '$9.99',
    priceSub: 'per month',
    tagline: 'Best for individuals and small teams.',
    color: '#1a73e8',
    popular: false,
    inherits: 'Starter',
    groups: [
      { icon: '🎥', label: 'Meetings',  items: ['Up to 24-hour meetings', 'Up to 100 participants'] },
      { icon: '☁️', label: 'Recording', items: ['Cloud recording with 5 GB storage'] },
      { icon: '📁', label: 'Projects',  items: ['1 project', '5 monthly active users'] },
      { icon: '🎧', label: 'Support',   items: ['Email support', 'Help centre access'] },
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$29.99',
    priceLabel: '$29.99',
    priceSub: 'per month',
    tagline: 'Best for growing teams and professionals.',
    color: '#6c63ff',
    popular: true,
    inherits: 'Basic',
    groups: [
      { icon: '🎥', label: 'Meetings',   items: ['Unlimited meeting duration', 'Up to 300 participants'] },
      { icon: '☁️', label: 'Recording',  items: ['Cloud recording with 50 GB storage', 'Recording transcripts'] },
      { icon: '🎨', label: 'Branding',   items: ['Custom branding', 'Branded waiting room'] },
      { icon: '📊', label: 'Analytics',  items: ['Full analytics dashboard', 'Meeting reports & exports'] },
      { icon: '🎧', label: 'Support',    items: ['Priority support', '15 monthly active users'] },
    ],
  },
  {
    key: 'premium',
    name: 'Enterprise',
    price: 'Custom',
    priceLabel: 'Custom',
    priceSub: 'Tailored to your needs',
    tagline: 'Custom pricing for large-scale deployments.',
    color: '#f59e0b',
    popular: false,
    enterprise: true,
    inherits: null,
    groups: [
      { icon: '📁', label: 'Projects',    items: ['Unlimited projects', 'Unlimited monthly active users'] },
      { icon: '📹', label: 'Video',       items: ['4K video quality', '4K cloud recording', 'Unlimited storage'] },
      { icon: '🏷️', label: 'White-label', items: ['Full white-label solution', 'Custom domain & branding'] },
      { icon: '🔒', label: 'Enterprise',  items: ['SSO & managed domains', 'Advanced security controls', 'SLA guarantee (99.9%)'] },
      { icon: '🎧', label: 'Support',     items: ['Dedicated account manager', 'Custom integrations', '24/7 phone support'] },
    ],
  },
]

const PLAN_ORDER = ['free', 'basic', 'pro', 'premium']

export default function MyPlanPage({ user, onUpgrade }) {
  const currentPlanKey = user?.plan || 'free'
  const currentIdx     = PLAN_ORDER.indexOf(currentPlanKey)
  const [contactOpen, setContactOpen] = useState(false)

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
                  <div style={{ fontSize: plan.enterprise ? 28 : 36, fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>
                    {plan.priceLabel || 'Free'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                    {plan.priceSub}
                  </div>
                </div>

                {/* CTA Button */}
                {plan.enterprise ? (
                  <button
                    onClick={() => setContactOpen(true)}
                    style={{
                      background: isCurrent ? 'transparent' : `linear-gradient(135deg,${plan.color},#d97706)`,
                      color: isCurrent ? plan.color : '#fff',
                      border: `1.5px solid ${plan.color}`,
                      borderRadius: 8,
                      padding: '10px 0',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                      marginBottom: 20,
                      boxShadow: isCurrent ? 'none' : `0 4px 16px ${plan.color}40`,
                    }}
                  >
                    {isCurrent ? '✓ Your current plan' : 'Contact Sales'}
                  </button>
                ) : isCurrent ? (
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
                <div style={{ borderTop: '1px solid var(--border)', marginBottom: 14 }} />

                {/* Inherits label */}
                {plan.inherits && (
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', margin: '0 0 12px' }}>
                    All of {plan.inherits}, and:
                  </p>
                )}

                {/* Grouped features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  {plan.groups.map((group, gi) => (
                    <div key={gi}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 13 }}>{group.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{group.label}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 4 }}>
                        {group.items.map((item, ii) => (
                          <div key={ii} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.45 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      {/* Bottom note */}
      <p style={{ marginTop: 16, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        All plans include a sandbox environment. Payments are simulated — no real charges.
      </p>
    </div>
  )
}
