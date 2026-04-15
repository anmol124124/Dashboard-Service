import { useState, useEffect } from 'react'
import { apiFetch, verifySession, createCheckoutSession } from './api.js'
import AuthView from './components/AuthView.jsx'
import Dashboard from './components/Dashboard.jsx'
import PricingView from './components/PricingView.jsx'

export default function App() {
  // Token lives in React state only (never localStorage).
  // The httpOnly cookie is the durable session — apiFetch sends it automatically
  // via credentials:'include'. The in-memory token is kept for endpoints that
  // still accept Bearer (SDK embed flows, Stripe callbacks within the same session).
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)
  const [view, setView] = useState('loading') // 'loading'|'pricing'|'auth'|'dashboard'
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [fromUpgrade, setFromUpgrade] = useState(false)
  const [initialPage, setInitialPage] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    const isUpgrade = params.get('upgrade') === '1'
    const isMyPlan  = params.get('myplan') === '1'

    // Always restore session via httpOnly cookie (no localStorage read needed).
    apiFetch('/auth/me')
      .then(me => {
        // ── Authenticated ────────────────────────────────────────────────

        // Returning from Stripe — verify payment
        if (sessionId) {
          window.history.replaceState({}, '', window.location.pathname)
          verifySession(sessionId, token)
            .then(({ plan, email }) => { setUser({ email, plan }); setView('dashboard') })
            .catch(() => { setUser(me); setView('dashboard') })
          return
        }

        // Coming from meeting "Upgrade Plan" → open My Plan tab
        if (isMyPlan) {
          window.history.replaceState({}, '', window.location.pathname)
          setUser(me); setInitialPage('my-plan'); setView('dashboard')
          return
        }

        setUser(me)
        setView('dashboard')
      })
      .catch(() => {
        // ── Not authenticated ────────────────────────────────────────────
        if (sessionId) window.history.replaceState({}, '', window.location.pathname)
        if (isUpgrade) {
          window.history.replaceState({}, '', window.location.pathname)
          setFromUpgrade(true)
          setView('auth')
          return
        }
        if (isMyPlan) {
          window.history.replaceState({}, '', window.location.pathname)
          setView('auth')
          return
        }
        setView('auth')
      })
  }, [])

  function handleSelectPlan(plan) {
    if (token && user) {
      // Already logged in (e.g. after signup) → go straight to checkout
      createCheckoutSession(plan, token).then(({ checkout_url }) => {
        window.location.href = checkout_url
      }).catch(() => {})
    } else {
      setSelectedPlan(plan)
      setView('auth')
    }
  }

  function handleLogin(accessToken, email, plan, isSignup = false) {
    // Token stays in memory only — the httpOnly cookie was set by the server on login.
    setToken(accessToken)
    setUser({ email, plan })
    setFromUpgrade(false)
    // New signup → must purchase a plan before accessing dashboard
    if (isSignup) {
      setView('pricing')
    } else {
      setView('dashboard')
    }
  }

  function handleLogout() {
    // Tell the server to clear the httpOnly cookie, then wipe local state.
    apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
    setToken('')
    setUser(null)
    setSelectedPlan(null)
    setView('auth')
  }

  function handlePlanUpgrade(plan, email) {
    setUser(prev => ({ ...prev, plan, email: email || prev?.email }))
  }

  if (view === 'loading') return null

  if (view === 'pricing') return <PricingView onSelectPlan={handleSelectPlan} currentPlan={user?.plan ?? null} />

  if (view === 'auth') return <AuthView onLogin={handleLogin} selectedPlan={selectedPlan} />

  return <Dashboard user={user} token={token} onLogout={handleLogout} onPlanUpgrade={handlePlanUpgrade} initialPage={initialPage} />
}
