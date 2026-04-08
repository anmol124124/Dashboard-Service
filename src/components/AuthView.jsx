import { useState } from 'react'
import { apiFetch, createCheckoutSession } from '../api.js'

export default function AuthView({ onLogin, selectedPlan }) {
  const [tab, setTab] = useState(selectedPlan ? 'signup' : 'login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')

  async function doLogin() {
    if (!loginEmail || !loginPassword) return setError('Please fill in all fields.')
    setLoading(true); setError('')
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const me = await apiFetch('/auth/me', {}, data.access_token)
      onLogin(data.access_token, me.email, me.plan)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function doSignup() {
    if (!signupEmail || !signupPassword) return setError('Please fill in all fields.')
    setLoading(true); setError('')
    try {
      // 1. Create account
      await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email: signupEmail, password: signupPassword }),
      })

      // 2. Auto-login to get token
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: signupEmail, password: signupPassword }),
      })
      const token = data.access_token

      // 3. If a paid plan was selected, redirect to Stripe Checkout
      //    'starter' is free — skip payment and go straight to dashboard
      const isFree = !selectedPlan || selectedPlan === 'starter'
      if (!isFree) {
        const { checkout_url } = await createCheckoutSession(selectedPlan, token)
        localStorage.setItem('wrtc_token', token)
        window.location.href = checkout_url
        return
      }

      const me = await apiFetch('/auth/me', {}, token)
      onLogin(token, me.email, me.plan)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
          </svg>
          <div>
            <span>WebRTC Platform</span>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400, letterSpacing: 0.2, marginTop: 1 }}>Embeddable video meetings</div>
          </div>
        </div>

        {selectedPlan && (
          <div className="plan-hint">
            Selected plan: <strong style={{ textTransform: 'capitalize' }}>{selectedPlan}</strong>
          </div>
        )}

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError('') }}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setError('') }}>
            Sign Up
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        {tab === 'login' ? (
          <>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doLogin()} />
            </div>
            <button className="btn btn-primary btn-full" onClick={doLogin} disabled={loading}>
              {loading && <span className="spin" />}
              Sign In
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password <span style={{ color: 'var(--muted)', fontSize: 11 }}>(min 8 characters)</span></label>
              <input type="password" placeholder="••••••••" value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSignup()} />
            </div>
            <button className="btn btn-primary btn-full" onClick={doSignup} disabled={loading}>
              {loading && <span className="spin" />}
              {selectedPlan && selectedPlan !== 'starter' ? 'Create Account & Pay' : 'Create Account'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
