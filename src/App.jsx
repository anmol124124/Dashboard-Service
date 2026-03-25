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
      verifySession(sessionId, storedToken)
        .then(({ plan, email }) => {
          window.history.replaceState({}, '', window.location.pathname)
          setToken(storedToken)
          setUser({ email, plan })
          setView('dashboard')
        })
        .catch(() => {
          window.history.replaceState({}, '', window.location.pathname)
          setView('pricing')
        })
      return
    }

    // Restore existing session
    if (storedToken) {
      apiFetch('/auth/me', {}, storedToken)
        .then(me => {
          setToken(storedToken)
          setUser(me)
          setView(me.plan ? 'dashboard' : 'pricing')
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
    setView(plan ? 'dashboard' : 'pricing')
  }

  function handleLogout() {
    localStorage.removeItem('wrtc_token')
    setToken('')
    setUser(null)
    setSelectedPlan(null)
    setView('pricing')
  }

  if (view === 'loading') return null

  if (view === 'pricing') return <PricingView onSelectPlan={handleSelectPlan} />

  if (view === 'auth') return <AuthView onLogin={handleLogin} selectedPlan={selectedPlan} />

  return <Dashboard user={user} token={token} onLogout={handleLogout} />
}
