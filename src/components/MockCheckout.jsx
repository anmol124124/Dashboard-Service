import { useState } from 'react'
import { activatePlan } from '../api.js'

const PLAN_INFO = {
  basic: { name: 'Basic', price: '$9.99',  color: '#1a73e8' },
  pro:   { name: 'Pro',   price: '$29.99', color: '#6c63ff' },
}

export default function MockCheckout({ plan, token, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const info = PLAN_INFO[plan] || PLAN_INFO.basic

  async function handlePay() {
    setLoading(true)
    setError('')
    try {
      const result = await activatePlan(plan, token)
      onSuccess(result.plan, result.email)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.icon}>💳</div>
          <h2 style={s.title}>Complete your purchase</h2>
          <p style={s.subtitle}>Sandbox — no real charge</p>
        </div>

        <div style={s.summary}>
          <div style={s.row}>
            <span style={s.label}>Plan</span>
            <span style={s.value}>{info.name}</span>
          </div>
          <div style={s.row}>
            <span style={s.label}>Billing</span>
            <span style={s.value}>Monthly</span>
          </div>
          <div style={s.divider} />
          <div style={s.row}>
            <span style={{ ...s.label, fontWeight: 600, color: '#e8eaed' }}>Total today</span>
            <span style={{ ...s.value, fontWeight: 700, fontSize: '20px', color: '#e8eaed' }}>{info.price}</span>
          </div>
        </div>

        <div style={s.sandboxNote}>
          🧪 This is a sandbox environment. Click "Pay Now" to simulate a successful payment.
        </div>

        {error && <div style={s.error}>{error}</div>}

        <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={handlePay} disabled={loading}>
          {loading ? 'Processing…' : `Pay ${info.price}`}
        </button>

        <button style={s.cancelBtn} onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#202124',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    background: '#2d2e31',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 40px rgba(0,0,0,.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#e8eaed',
    margin: '0 0 6px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#9aa0a6',
    margin: 0,
  },
  summary: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '14px',
    color: '#9aa0a6',
  },
  value: {
    fontSize: '14px',
    color: '#bdc1c6',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  divider: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  sandboxNote: {
    fontSize: '13px',
    color: '#9aa0a6',
    background: 'rgba(26,115,232,0.1)',
    borderLeft: '3px solid #1a73e8',
    borderRadius: '6px',
    padding: '10px 14px',
    marginBottom: '20px',
  },
  error: {
    color: '#ea4335',
    fontSize: '13px',
    marginBottom: '12px',
  },
  btn: {
    background: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    width: '100%',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  cancelBtn: {
    background: 'transparent',
    color: '#9aa0a6',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    fontSize: '14px',
    width: '100%',
    cursor: 'pointer',
  },
}
