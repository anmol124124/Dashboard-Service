import { useState } from 'react'
import { apiFetch } from '../api.js'

const TZ_OPTIONS = [
  { label: 'UTC',                   value: 'UTC' },
  { label: 'US/Eastern (ET)',        value: 'America/New_York' },
  { label: 'US/Central (CT)',        value: 'America/Chicago' },
  { label: 'US/Mountain (MT)',       value: 'America/Denver' },
  { label: 'US/Pacific (PT)',        value: 'America/Los_Angeles' },
  { label: 'London (GMT/BST)',       value: 'Europe/London' },
  { label: 'Paris/Berlin (CET)',     value: 'Europe/Paris' },
  { label: 'Moscow (MSK)',           value: 'Europe/Moscow' },
  { label: 'Dubai (GST)',            value: 'Asia/Dubai' },
  { label: 'India (IST)',            value: 'Asia/Kolkata' },
  { label: 'Bangladesh (BST)',       value: 'Asia/Dhaka' },
  { label: 'Singapore/KL (SGT)',     value: 'Asia/Singapore' },
  { label: 'Tokyo/Seoul (JST/KST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)',          value: 'Australia/Sydney' },
  { label: 'São Paulo (BRT)',        value: 'America/Sao_Paulo' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ScheduleProjectMeetingModal({ project, token, onClose, onToast }) {
  const [title, setTitle]               = useState(project.name)
  const [schedDate, setSchedDate]       = useState('')
  const [schedTime, setSchedTime]       = useState('')
  const [schedTz, setSchedTz]           = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  )
  const [inviteeInput, setInviteeInput] = useState('')
  const [invitees, setInvitees]         = useState([])
  const [loading, setLoading]           = useState(false)
  const [success, setSuccess]           = useState(false)
  const [error, setError]               = useState('')

  function addInvitee() {
    const email = inviteeInput.trim().toLowerCase()
    if (!EMAIL_RE.test(email)) { setError('Enter a valid email address'); return }
    if (invitees.includes(email)) { setError('Already added'); return }
    setInvitees(prev => [...prev, email])
    setInviteeInput('')
    setError('')
  }

  function removeInvitee(email) {
    setInvitees(prev => prev.filter(e => e !== email))
  }

  async function handleSend() {
    if (!title.trim()) { setError('Meeting title is required'); return }
    if (!schedDate || !schedTime) { setError('Please pick a date and time'); return }

    // Auto-add pending input
    let finalInvitees = [...invitees]
    const pending = inviteeInput.trim().toLowerCase()
    if (pending) {
      if (!EMAIL_RE.test(pending)) { setError('Enter a valid email address'); return }
      if (!finalInvitees.includes(pending)) finalInvitees = [...finalInvitees, pending]
    }
    if (finalInvitees.length === 0) { setError('Add at least one invitee'); return }

    setLoading(true)
    setError('')
    try {
      await apiFetch(`/projects/${project.id}/schedule-invite`, {
        method: 'POST',
        body: JSON.stringify({
          meeting_title: title.trim(),
          scheduled_at: `${schedDate}T${schedTime}:00`,
          timezone: schedTz,
          invitees: finalInvitees,
        }),
      }, token)
      setSuccess(true)
      onToast(`Invites sent to ${finalInvitees.length} recipient${finalInvitees.length > 1 ? 's' : ''}!`)
    } catch (e) {
      setError(e.message || 'Failed to send invites')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 32px', width: 480, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Schedule Meeting Invite</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>{project.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#48bb78" strokeWidth="1.5" style={{ marginBottom: 16 }}>
              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
            </svg>
            <h3 style={{ margin: '0 0 8px', color: '#48bb78' }}>Invites Sent!</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Invitation emails have been sent to all recipients.</p>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            {/* Meeting title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Meeting Title</label>
              <input
                className="input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Weekly Sync"
                style={{ width: '100%' }}
              />
            </div>

            {/* Date + Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Date</label>
                <input
                  className="input"
                  type="date"
                  value={schedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSchedDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Time</label>
                <input
                  className="input"
                  type="time"
                  value={schedTime}
                  onChange={e => setSchedTime(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Timezone */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Timezone</label>
              <select
                className="input"
                value={schedTz}
                onChange={e => setSchedTz(e.target.value)}
                style={{ width: '100%' }}
              >
                {TZ_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Invitees */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Invite Participants</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input"
                  type="email"
                  value={inviteeInput}
                  onChange={e => setInviteeInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInvitee() } }}
                  placeholder="email@example.com"
                  style={{ flex: 1 }}
                />
                <button className="btn btn-ghost btn-sm" onClick={addInvitee} style={{ whiteSpace: 'nowrap' }}>Add</button>
              </div>
              {invitees.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {invitees.map(email => (
                    <span key={email} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 20, padding: '3px 10px 3px 12px', fontSize: 12, color: 'var(--text)' }}>
                      {email}
                      <button onClick={() => removeInvitee(email)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 0, lineHeight: 1 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p style={{ color: '#fc8181', fontSize: 13, margin: '0 0 12px' }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Send Invites'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
