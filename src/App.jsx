import { useState, useEffect } from 'react'
import { apiFetch, verifySession } from './api.js'
import AuthView from './components/AuthView.jsx'
import Dashboard from './components/Dashboard.jsx'
import PricingView from './components/PricingView.jsx'

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('wrtc_token') || '')
  const [user, setUser] = useState(null)
  const [view, setView] = useState('loading') // 'loading'|'pricing'|'auth'|'dashboard'
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
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
          // Verification failed (e.g. Stripe keys not set on server).
          // Still load the user so they can access the dashboard.
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
      setView('pricing')
    }
  }, [])

  function handleSelectPlan(plan) {
    setSelectedPlan(plan)
    setView('auth')
  }

  function handleLogin(accessToken, email, plan) {
    localStorage.setItem('wrtc_token', accessToken)
    setToken(accessToken)
    setUser({ email, plan })
    setView('dashboard')
  }

  function handleLogout() {
    localStorage.removeItem('wrtc_token')
    setToken('')
    setUser(null)
    setSelectedPlan(null)
    setView('pricing')
  }

  function handlePlanUpgrade(plan, email) {
    setUser(prev => ({ ...prev, plan, email: email || prev?.email }))
  }

  if (view === 'loading') return null

  if (view === 'pricing') return <PricingView onSelectPlan={handleSelectPlan} />

  if (view === 'auth') return <AuthView onLogin={handleLogin} selectedPlan={selectedPlan} />

  return <Dashboard user={user} token={token} onLogout={handleLogout} onPlanUpgrade={handlePlanUpgrade} />
}
