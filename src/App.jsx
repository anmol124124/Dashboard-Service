import { useState, useEffect } from 'react'
import { apiFetch } from './api.js'
import AuthView from './components/AuthView.jsx'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('wrtc_token') || '')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!token) return
    apiFetch('/auth/me', {}, token)
      .then(me => setUser(me))
      .catch(() => {
        setToken('')
        localStorage.removeItem('wrtc_token')
      })
  }, [token])

  function handleLogin(accessToken, email) {
    localStorage.setItem('wrtc_token', accessToken)
    setToken(accessToken)
    setUser({ email })
  }

  function handleLogout() {
    localStorage.removeItem('wrtc_token')
    setToken('')
    setUser(null)
  }

  if (!token || !user) {
    return <AuthView onLogin={handleLogin} />
  }

  return <Dashboard user={user} token={token} onLogout={handleLogout} />
}
