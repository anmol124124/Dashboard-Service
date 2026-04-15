// Runtime config injected by entrypoint.sh via /config.js
// Fallback: VITE_BACKEND_URL from .env (local dev), then localhost
const BACKEND_URL =
  window.BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:8000'

export const API_BASE = `${BACKEND_URL}/api/v1`

export async function apiFetch(path, opts = {}, token = '') {
  const res = await fetch(API_BASE + path, {
    ...opts,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export async function createCheckoutSession(plan, token) {
  return apiFetch('/payments/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  }, token)
}

export async function verifySession(sessionId, token) {
  return apiFetch(`/payments/verify-session?session_id=${encodeURIComponent(sessionId)}`, {}, token)
}

export async function activatePlan(plan, token) {
  return apiFetch('/payments/activate-plan', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  }, token)
}

export async function submitContactInquiry(data) {
  return apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
