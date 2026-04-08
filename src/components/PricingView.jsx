import { useState } from 'react'
import { submitContactInquiry } from '../api'

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    monthlyPrice: null,
    tagline: 'Free for individuals getting started.',
    cta: 'Get started free',
    popular: false,
    color: '#6b7280',
    inherits: null,
    groups: [
      {
        icon: '🎥',
        label: 'Meetings',
        items: ['40-minute meetings', 'Up to 100 participants'],
      },
      {
        icon: '📹',
        label: 'Video & Audio',
        items: ['HD video quality', 'Noise cancellation'],
      },
      {
        icon: '☁️',
        label: 'Recording',
        items: ['Cloud recording included'],
      },
      {
        icon: '💬',
        label: 'Chat',
        items: ['In-meeting messaging', 'Screen share'],
      },
      {
        icon: '📁',
        label: 'Projects',
        items: ['1 project', '5 monthly active users'],
      },
    ],
  },
  {
    key: 'basic',
    name: 'Basic',
    monthlyPrice: 9.99,
    tagline: 'Best for individuals and small teams.',
    cta: 'Get Basic',
    popular: false,
    color: '#1a73e8',
    inherits: 'Starter',
    groups: [
      {
        icon: '🎥',
        label: 'Meetings',
        items: ['Up to 24-hour meetings', 'Up to 100 participants'],
      },
      {
        icon: '☁️',
        label: 'Recording',
        items: ['Cloud recording with 5 GB storage'],
      },
      {
        icon: '📁',
        label: 'Projects',
        items: ['1 project', '5 monthly active users'],
      },
      {
        icon: '🎧',
        label: 'Support',
        items: ['Email support', 'Help centre access'],
      },
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    monthlyPrice: 29.99,
    tagline: 'Best for growing teams and professionals.',
    cta: 'Get Pro',
    popular: true,
    color: '#6c63ff',
    inherits: 'Basic',
    groups: [
      {
        icon: '🎥',
        label: 'Meetings',
        items: ['Unlimited meeting duration', 'Up to 300 participants'],
      },
      {
        icon: '☁️',
        label: 'Recording',
        items: ['Cloud recording with 50 GB storage', 'Recording transcripts'],
      },
      {
        icon: '🎨',
        label: 'Branding',
        items: ['Custom branding', 'Branded waiting room'],
      },
      {
        icon: '📊',
        label: 'Analytics',
        items: ['Full analytics dashboard', 'Meeting reports & exports'],
      },
      {
        icon: '🎧',
        label: 'Support',
        items: ['Priority support', '15 monthly active users'],
      },
    ],
  },
]

const ENTERPRISE_COLOR = '#f59e0b'
const ENTERPRISE_FEATURES = [
  { icon: '📁', label: 'Projects',    items: ['Unlimited projects', 'Unlimited monthly active users'] },
  { icon: '📹', label: 'Video',       items: ['4K video quality', '4K cloud recording', 'Unlimited storage'] },
  { icon: '🏷️', label: 'White-label', items: ['Full white-label solution', 'Custom domain & branding', 'Remove "Powered by RoomLy"'] },
  { icon: '🔒', label: 'Enterprise',  items: ['SSO & managed domains', 'Advanced security controls', 'Data retention policies', 'SLA guarantee (99.9%)'] },
  { icon: '🎧', label: 'Support',     items: ['Dedicated account manager', 'Custom integrations', '24/7 phone support'] },
]

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
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e8eaed', margin: '0 0 12px' }}>
              Thanks for reaching out!
            </h2>
            <p style={{ fontSize: 14, color: '#9aa0a6', margin: '0 0 28px', lineHeight: 1.6 }}>
              Our team will get back to you shortly to discuss how RoomLy Enterprise can work for your organisation.
            </p>
            <button
              onClick={onClose}
              style={{ padding: '10px 32px', background: `linear-gradient(135deg,${ENTERPRISE_COLOR},#d97706)`, border: 'none', borderRadius: 9, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: ENTERPRISE_COLOR, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Enterprise
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e8eaed', margin: '0 0 6px' }}>
                Contact Sales
              </h2>
              <p style={{ fontSize: 13, color: '#9aa0a6', margin: 0 }}>
                Tell us about your team and we'll put together a custom plan for you.
              </p>
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
                <select
                  style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                  value={form.employee_size}
                  onChange={e => set('employee_size', e.target.value)}
                >
                  <option value="">Select employee count</option>
                  {EMPLOYEE_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </div>

              <div>
                <label style={lbl}>Message (optional)</label>
                <textarea
                  style={{ ...inp, resize: 'vertical', minHeight: 90 }}
                  placeholder="Tell us about your use case, integrations needed, or any questions…"
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                />
              </div>

              {error && (
                <div style={{ background: 'rgba(234,67,53,.12)', border: '1px solid rgba(234,67,53,.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ff6b6b' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" onClick={onClose} style={{ padding: '10px 22px', background: 'transparent', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, color: '#9aa0a6', fontSize: 14, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '10px 28px', background: `linear-gradient(135deg,${ENTERPRISE_COLOR},#d97706)`, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                >
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

// Map backend plan names → pricing card keys
const PLAN_ORDER = ['starter', 'basic', 'pro', 'enterprise']
function normalizePlan(plan) {
  if (!plan || plan === 'free') return 'starter'
  if (plan === 'premium') return 'enterprise'
  return plan
}

export default function PricingView({ onSelectPlan, currentPlan = null }) {
  const [annual, setAnnual]         = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const activePlan = normalizePlan(currentPlan)

  function getPrice(plan) {
    if (!plan.monthlyPrice) return null
    return annual ? (plan.monthlyPrice * 0.8).toFixed(2) : plan.monthlyPrice.toFixed(2)
  }

  function getPlanStatus(planKey) {
    if (!currentPlan && planKey !== 'starter') return 'upgrade'
    const currentIdx = PLAN_ORDER.indexOf(activePlan)
    const planIdx    = PLAN_ORDER.indexOf(planKey)
    if (planIdx === currentIdx) return 'current'
    if (planIdx > currentIdx)  return 'upgrade'
    return 'downgrade'
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#13151c 0%,#1a1d26 100%)', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', color:'#e8eaed', paddingBottom:64 }}>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      {/* ── Nav ── */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 40px', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, background:'rgba(26,115,232,.15)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a73e8"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          </div>
          <span style={{ fontSize:17, fontWeight:700 }}>RoomLy</span>
        </div>
        <div style={{ display:'flex', gap:28 }}>
          {['Features','Docs','Contact'].map(l => (
            <span key={l} style={{ fontSize:14, color:'#9aa0a6', cursor:'pointer' }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ textAlign:'center', padding:'48px 24px 32px' }}>
        <h1 style={{ fontSize:40, fontWeight:800, margin:'0 0 12px', letterSpacing:'-0.02em', lineHeight:1.15 }}>
          Plans &amp; Pricing
        </h1>
        <p style={{ fontSize:16, color:'#9aa0a6', margin:'0 0 28px' }}>
          Start free, scale when ready. Includes: 🎥 Meetings &nbsp;💬 Chat &nbsp;☁️ Recording &nbsp;📊 Analytics — all at low price.
        </p>

        {/* Billing toggle */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'inline-flex', background:'rgba(255,255,255,.06)', borderRadius:12, padding:4, gap:4 }}>
            {[{ val: false, label: 'Monthly' }, { val: true, label: 'Annually' }].map(opt => (
              <button
                key={String(opt.val)}
                onClick={() => setAnnual(opt.val)}
                style={{
                  background: annual === opt.val ? '#2d2e31' : 'transparent',
                  border: 'none',
                  color: annual === opt.val ? '#e8eaed' : '#9aa0a6',
                  fontSize: 14, fontWeight: 500,
                  padding: '8px 20px', borderRadius: 9,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: annual === opt.val ? '0 1px 4px rgba(0,0,0,.4)' : 'none',
                  transition: 'all .15s',
                }}
              >
                {opt.label}
                {opt.val && (
                  <span style={{ background:'linear-gradient(90deg,#34a853,#1e8e3e)', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10 }}>
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
          <span style={{ fontSize:13, color:'#9aa0a6' }}>Prices in USD</span>
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={{ maxWidth:1140, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, overflow:'hidden' }}>

          {/* ── Paid plans (Starter, Basic, Pro) ── */}
          {PLANS.map((plan, idx) => {
            const price      = getPrice(plan)
            const status     = getPlanStatus(plan.key)
            const isCurrent  = status === 'current'
            return (
              <div
                key={plan.key}
                style={{
                  borderRight: '1px solid rgba(255,255,255,.08)',
                  display: 'flex', flexDirection: 'column',
                  background: plan.popular
                    ? `linear-gradient(180deg,${plan.color}15 0%,transparent 140px)`
                    : 'transparent',
                }}
              >
                {isCurrent ? (
                  <div style={{ background:'rgba(52,168,83,.2)', borderBottom:'1px solid rgba(52,168,83,.3)', color:'#34a853', textAlign:'center', fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'7px 0' }}>
                    Your Current Plan
                  </div>
                ) : plan.popular ? (
                  <div style={{ background:plan.color, color:'#fff', textAlign:'center', fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'7px 0' }}>
                    Most Popular
                  </div>
                ) : (
                  <div style={{ height:0 }} />
                )}

                <div style={{ padding:'22px 20px 28px', flex:1, display:'flex', flexDirection:'column' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:plan.color, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>
                    {plan.name}
                  </div>
                  <p style={{ fontSize:12, color:'#9aa0a6', margin:'0 0 16px', lineHeight:1.5 }}>
                    {plan.tagline}
                  </p>

                  <div style={{ marginBottom:18 }}>
                    {price ? (
                      <>
                        <div style={{ display:'flex', alignItems:'flex-end', gap:2 }}>
                          <span style={{ fontSize:14, fontWeight:600, color:'#9aa0a6', paddingBottom:5 }}>$</span>
                          <span style={{ fontSize:38, fontWeight:800, lineHeight:1, color:'#e8eaed' }}>{price}</span>
                        </div>
                        <div style={{ fontSize:11, color:'#9aa0a6', marginTop:4 }}>
                          /user per month · {annual ? 'billed annually' : 'billed monthly'}
                        </div>
                        {annual && (
                          <div style={{ fontSize:11, color:'#34a853', fontWeight:600, marginTop:3 }}>
                            Save ${(plan.monthlyPrice * 12 * 0.2).toFixed(2)} per year
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize:38, fontWeight:800, lineHeight:1, color:'#e8eaed' }}>Free</div>
                        <div style={{ fontSize:11, color:'#9aa0a6', marginTop:4 }}>No credit card required</div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => !isCurrent && onSelectPlan(plan.key)}
                    disabled={isCurrent}
                    style={{
                      background: isCurrent
                        ? 'rgba(52,168,83,.12)'
                        : plan.popular ? `linear-gradient(135deg,${plan.color},${plan.color}cc)` : 'transparent',
                      color: isCurrent ? '#34a853' : plan.popular ? '#fff' : plan.color,
                      border: isCurrent
                        ? '1.5px solid rgba(52,168,83,.35)'
                        : `1.5px solid ${plan.popular ? 'transparent' : plan.color + '80'}`,
                      borderRadius: 9, padding: '10px 0', fontSize: 13, fontWeight: 600,
                      cursor: isCurrent ? 'default' : 'pointer', width: '100%', marginBottom: 18,
                      boxShadow: (!isCurrent && plan.popular) ? `0 4px 16px ${plan.color}40` : 'none',
                      transition: 'opacity .15s',
                    }}
                    onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.opacity = '0.82' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  >
                    {isCurrent ? '✓ Current Plan' : status === 'upgrade' ? `Upgrade to ${plan.name}` : plan.cta}
                  </button>

                  <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', marginBottom:16 }} />

                  {plan.inherits && (
                    <p style={{ fontSize:12, fontWeight:600, color:'#9aa0a6', margin:'0 0 14px' }}>
                      All of {plan.inherits}, and:
                    </p>
                  )}

                  <div style={{ display:'flex', flexDirection:'column', gap:14, flex:1 }}>
                    {plan.groups.map((group, gi) => (
                      <div key={gi}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                          <span style={{ fontSize:13 }}>{group.icon}</span>
                          <span style={{ fontSize:12, fontWeight:600, color:'#bdc1c6' }}>{group.label}</span>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:5, paddingLeft:4 }}>
                          {group.items.map((item, ii) => (
                            <div key={ii} style={{ display:'flex', alignItems:'flex-start', gap:7 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:1 }}>
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              <span style={{ fontSize:12, color:'#bdc1c6', lineHeight:1.45 }}>{item}</span>
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

          {/* ── Enterprise card ── */}
          <div style={{ display:'flex', flexDirection:'column', background:`linear-gradient(180deg,${ENTERPRISE_COLOR}10 0%,transparent 140px)` }}>
            <div style={{ height:0 }} />

            <div style={{ padding:'22px 20px 28px', flex:1, display:'flex', flexDirection:'column' }}>
              <div style={{ fontSize:13, fontWeight:700, color:ENTERPRISE_COLOR, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>
                Enterprise
              </div>
              <p style={{ fontSize:12, color:'#9aa0a6', margin:'0 0 16px', lineHeight:1.5 }}>
                Custom pricing for large-scale deployments.
              </p>

              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:28, fontWeight:800, lineHeight:1.2, color:'#e8eaed' }}>Custom</div>
                <div style={{ fontSize:11, color:'#9aa0a6', marginTop:4 }}>Tailored to your needs</div>
              </div>

              <button
                onClick={() => setContactOpen(true)}
                style={{
                  background: `linear-gradient(135deg,${ENTERPRISE_COLOR},#d97706)`,
                  color: '#fff', border: 'none', borderRadius: 9,
                  padding: '10px 0', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', width: '100%', marginBottom: 18,
                  boxShadow: `0 4px 16px ${ENTERPRISE_COLOR}40`,
                  transition: 'opacity .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.82' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                Contact Sales
              </button>

              <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', marginBottom:16 }} />

              <p style={{ fontSize:12, fontWeight:600, color:'#9aa0a6', margin:'0 0 14px' }}>
                All of Pro, and:
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:14, flex:1 }}>
                {ENTERPRISE_FEATURES.map((group, gi) => (
                  <div key={gi}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:13 }}>{group.icon}</span>
                      <span style={{ fontSize:12, fontWeight:600, color:'#bdc1c6' }}>{group.label}</span>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:5, paddingLeft:4 }}>
                      {group.items.map((item, ii) => (
                        <div key={ii} style={{ display:'flex', alignItems:'flex-start', gap:7 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ENTERPRISE_COLOR} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:1 }}>
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          <span style={{ fontSize:12, color:'#bdc1c6', lineHeight:1.45 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Trust bar ── */}
      <div style={{ display:'flex', gap:32, flexWrap:'wrap', justifyContent:'center', padding:'18px 32px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:14, maxWidth:620, margin:'32px auto 0' }}>
        {[
          { icon:'🔒', text:'SSL encrypted payments' },
          { icon:'↩️', text:'30-day money-back guarantee' },
          { icon:'🌍', text:'Cancel anytime, no lock-in' },
        ].map(t => (
          <div key={t.text} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:15 }}>{t.icon}</span>
            <span style={{ fontSize:13, color:'#9aa0a6' }}>{t.text}</span>
          </div>
        ))}
      </div>

      {/* ── Sandbox note ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'12px 20px', background:'rgba(26,115,232,.08)', border:'1px solid rgba(26,115,232,.2)', borderRadius:10, maxWidth:520, margin:'16px auto 0', fontSize:13, color:'#9aa0a6', textAlign:'center' }}>
        <span style={{ fontSize:15 }}>🧪</span>
        <span>
          <strong style={{ color:'#e8eaed' }}>Sandbox mode</strong> — Use test card&nbsp;
          <code style={{ background:'rgba(255,255,255,.08)', padding:'2px 7px', borderRadius:5, fontFamily:'monospace', color:'#4d94ff', letterSpacing:'0.05em' }}>4242 4242 4242 4242</code>, any future date, any CVC
        </span>
      </div>

    </div>
  )
}
