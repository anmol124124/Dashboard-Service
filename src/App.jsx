import { useState, useEffect } from 'react'
import { apiFetch, verifySession, createCheckoutSession } from './api.js'
import AuthView from './components/AuthView.jsx'
import Dashboard from './components/Dashboard.jsx'
import PricingView from './components/PricingView.jsx'

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('wrtc_token') || '')
  const [user, setUser] = useState(null)
  const [view, setView] = useState('loading') // 'loading'|'pricing'|'auth'|'dashboard'
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [fromUpgrade, setFromUpgrade] = useState(false)
  const [initialPage, setInitialPage] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId  = params.get('session_id')
    const isUpgrade  = params.get('upgrade') === '1'
    const isMyPlan   = params.get('myplan') === '1'
    const storedToken = localStorage.getItem('wrtc_token')

    // Returning from Stripe — verify payment
    if (sessionId && storedToken) {
      window.history.replaceState({}, '', window.location.pathname)
      verifySession(sessionId, storedToken)
        .then(({ plan, email }) => {
          setToken(storedToken)
          setUser({ email, plan })
          setView('dashboard')
        })
        .catch(() => {
          apiFetch('/auth/me', {}, storedToken)
            .then(me => {
              setToken(storedToken)
              setUser(me)
              setView('dashboard')
            })
            .catch(() => {
              localStorage.removeItem('wrtc_token')
              setView('pricing')
            })
        })
      return
    }

    // Coming from dashboard-service meeting "Upgrade Plan" → go to My Plan section
    if (isMyPlan) {
      window.history.replaceState({}, '', window.location.pathname)
      if (storedToken) {
        apiFetch('/auth/me', {}, storedToken)
          .then(me => { setToken(storedToken); setUser(me); setInitialPage('my-plan'); setView('dashboard') })
          .catch(() => { localStorage.removeItem('wrtc_token'); setView('auth') })
      } else {
        setView('auth')
      }
      return
    }

    // Coming from public-meet "Upgrade Plan" button → auth → pricing
    if (isUpgrade) {
      window.history.replaceState({}, '', window.location.pathname)
      if (storedToken) {
        // Already logged in = already purchased → go to dashboard
        apiFetch('/auth/me', {}, storedToken)
          .then(me => { setToken(storedToken); setUser(me); setView('dashboard') })
          .catch(() => { localStorage.removeItem('wrtc_token'); setFromUpgrade(true); setView('auth') })
      } else {
        // Not logged in → show auth; signup will land on pricing
        setFromUpgrade(true)
        setView('auth')
      }
      return
    }

    // Restore existing session
    if (storedToken) {
      apiFetch('/auth/me', {}, storedToken)
        .then(me => {
          setToken(storedToken)
          setUser(me)
          setView('dashboard')
        })
        .catch(() => {
          localStorage.removeItem('wrtc_token')
          setView('pricing')
        })
    } else {
      setView('auth')
    }
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
    localStorage.setItem('wrtc_token', accessToken)
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
    localStorage.removeItem('wrtc_token')
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
