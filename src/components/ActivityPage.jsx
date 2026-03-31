import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

function fmtTime(iso) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function LineChart({ data, labels }) {
  const W = 600, H = 120, PAD = { t: 10, r: 10, b: 30, l: 30 }
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => {
    const x = PAD.l + (i / (data.length - 1)) * innerW
    const y = PAD.t + innerH - (v / max) * innerH
    return `${x},${y}`
  })
  const polyline = pts.join(' ')
  const area = `${PAD.l},${PAD.t + innerH} ` + pts.join(' ') + ` ${PAD.l + innerW},${PAD.t + innerH}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6c63ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.5, 1].map(f => (
        <line key={f} x1={PAD.l} y1={PAD.t + innerH * (1 - f)} x2={PAD.l + innerW} y2={PAD.t + innerH * (1 - f)}
          stroke="rgba(255,255,255,.06)" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      {/* Area fill */}
      <polygon points={area} fill="url(#chartGrad)" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#6c63ff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots */}
      {pts.map((pt, i) => {
        const [x, y] = pt.split(',').map(Number)
        return data[i] > 0 ? (
          <circle key={i} cx={x} cy={y} r="3.5" fill="#6c63ff" stroke="#090a10" strokeWidth="2" />
        ) : null
      })}
      {/* X labels — every other */}
      {labels.map((l, i) => i % 2 === 0 ? (
        <text key={i} x={PAD.l + (i / (data.length - 1)) * innerW} y={H - 4}
          textAnchor="middle" fontSize="9" fill="rgba(255,255,255,.35)">{l}</text>
      ) : null)}
    </svg>
  )
}

const EVENT_CFG = {
  meeting_started:    { cls: 'start', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> },
  meeting_ended:      { cls: 'end',   icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> },
  participant_joined: { cls: 'join',  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  participant_left:   { cls: 'leave', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> },
}

function eventText(ev) {
  switch (ev.type) {
    case 'meeting_started':    return <><strong>{ev.title}</strong> was started</>
    case 'meeting_ended':      return <><strong>{ev.title}</strong> ended</>
    case 'participant_joined': return <><strong>{ev.display_name}</strong> joined <span style={{ color: 'var(--muted)' }}>{ev.meeting_title}</span>{ev.role === 'host' && <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>host</span>}</>
    case 'participant_left':   return <><strong>{ev.display_name}</strong> left <span style={{ color: 'var(--muted)' }}>{ev.meeting_title}</span></>
    default: return ev.type
  }
}

export default function ActivityPage({ project, token, user }) {
  const [analytics, setAnalytics] = useState(null)
  const [events, setEvents]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [mauData, setMauData]     = useState(null)

  useEffect(() => {
    setAnalytics(null); setEvents([]); setLoading(true); setMauData(null)
    Promise.all([
      apiFetch(`/projects/${project.id}/analytics`, {}, token),
      apiFetch(`/projects/${project.id}/activity`, {}, token),
      apiFetch(`/projects/${project.id}/mau`, {}, token),
    ]).then(([a, act, m]) => {
      setAnalytics(a)
      setEvents(act.events || [])
      setMauData(m)
    }).finally(() => setLoading(false))
  }, [project.id, token])

  // Build daily chart data from meeting participant counts
  const today = new Date()
  const days14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (13 - i))
    return d.toISOString().slice(0, 10)
  })

  const countByDay = {}
  days14.forEach(d => { countByDay[d] = 0 })
  if (analytics) {
    analytics.meetings.forEach(m => {
      const day = m.created_at.slice(0, 10)
      if (countByDay[day] !== undefined) countByDay[day] += m.participant_count || 0
    })
  }

  const chartData   = days14.map(d => countByDay[d])
  const chartLabels = days14.map(d => { const dt = new Date(d); return `${dt.toLocaleString('default',{month:'short'})} ${dt.getDate()}` })

  // Real MAU from project_mau table (unique users, matches enforcement)
  const mau        = mauData?.current ?? 0
  const planLimit  = mauData ? (mauData.unlimited ? null : mauData.limit) : null
  const planName   = mauData ? (mauData.plan.charAt(0).toUpperCase() + mauData.plan.slice(1)) : (user?.plan || 'basic')
  const isUnlimited = planLimit === null
  const pct = isUnlimited ? 0 : Math.round((mau / planLimit) * 100)

  const monthLabel = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Activity</h1>
        <p>Usage and event activity for {project.name}.</p>
      </div>

      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}

      {!loading && (
        <>
          {/* Plan usage card */}
          <div className="section-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: 2, minWidth: 200 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                  Plan usage — {monthLabel}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{mau}</div>
                  <div style={{ fontSize: 14, color: 'var(--muted)' }}>MAU*</div>
                </div>
                {/* Progress bar */}
                {!isUnlimited && (
                  <>
                    <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 4, height: 6, marginBottom: 8, overflow: 'hidden' }}>
                      <div style={{ background: 'var(--primary-g)', height: '100%', width: `${Math.min(pct, 100)}%`, borderRadius: 4, transition: 'width .5s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
                      <span>{mau} sessions</span>
                      <span>{pct < 100 ? `${100 - pct}% remaining` : 'Limit reached'}</span>
                      <span>{planLimit} limit</span>
                    </div>
                  </>
                )}
                {isUnlimited && (
                  <div style={{ fontSize: 13, color: 'var(--green)' }}>Unlimited — no restrictions</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 140, background: 'rgba(108,99,255,.08)', border: '1px solid rgba(108,99,255,.2)', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 6 }}>{planName} Plan</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
                  {isUnlimited ? '∞' : planLimit}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>MAU* limit</div>
              </div>
            </div>
          </div>

          {/* Line chart */}
          <div className="section-card" style={{ marginBottom: 20 }}>
            <div className="section-card-title" style={{ marginBottom: 16 }}>Participant sessions — last 14 days</div>
            <LineChart data={chartData} labels={chartLabels} />
          </div>

          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
            *A Monthly Active User (MAU) is counted as one participant session in a meeting. Sessions are counted per meeting join.
          </p>

          {/* Event feed */}
          {events.length > 0 && (
            <div className="section-card" style={{ padding: '4px 24px' }}>
              <div className="section-card-title" style={{ padding: '16px 0 0' }}>Recent Events</div>
              <div className="activity-feed">
                {events.slice(0, 40).map((ev, i) => {
                  const cfg = EVENT_CFG[ev.type] || EVENT_CFG.participant_joined
                  return (
                    <div key={i} className="activity-event">
                      <div className={`activity-icon ${cfg.cls}`}>{cfg.icon}</div>
                      <div className="activity-body">
                        <div className="activity-text">{eventText(ev)}</div>
                        <div className="activity-time">{fmtTime(ev.timestamp)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {events.length === 0 && (
            <div className="section-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>No events yet. Start a meeting to see activity here.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
