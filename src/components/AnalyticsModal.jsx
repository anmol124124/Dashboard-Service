import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

export default function AnalyticsModal({ project, token, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch(`/projects/${project.id}/analytics`, {}, token)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [project.id, token])

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '700px', width: '95%' }}>
        <div className="modal-header">
          <h2 className="modal-title">Analytics — {project.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading && <p style={{ color: '#9aa0a6', textAlign: 'center', padding: '32px 0' }}>Loading…</p>}
          {error && <p style={{ color: '#ea4335', textAlign: 'center' }}>{error}</p>}
          {data && <AnalyticsContent data={data} />}
        </div>
      </div>
    </div>
  )
}

function AnalyticsContent({ data }) {
  const { total, meetings } = data

  // Build meetings-per-day for last 14 days
  const today = new Date()
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (13 - i))
    return d.toISOString().slice(0, 10)
  })

  const countByDay = {}
  days.forEach(d => { countByDay[d] = 0 })
  meetings.forEach(m => {
    const day = m.created_at.slice(0, 10)
    if (countByDay[day] !== undefined) countByDay[day]++
  })

  const counts = days.map(d => countByDay[d])
  const maxCount = Math.max(...counts, 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Stat card */}
      <div style={styles.statRow}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{total}</div>
          <div style={styles.statLabel}>Total Meetings</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {meetings.length > 0
              ? new Date(meetings[0].created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : '—'}
          </div>
          <div style={styles.statLabel}>Last Meeting</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {counts.reduce((a, b) => a + b, 0)}
          </div>
          <div style={styles.statLabel}>Last 14 Days</div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={styles.chartBox}>
        <div style={styles.chartTitle}>Meetings per Day (last 14 days)</div>
        <div style={styles.chart}>
          {days.map((day, i) => (
            <div key={day} style={styles.barCol} title={`${day}: ${counts[i]} meeting(s)`}>
              <div style={{ ...styles.bar, height: `${Math.round((counts[i] / maxCount) * 100)}%`, minHeight: counts[i] > 0 ? 4 : 0 }} />
              {i % 2 === 0 && (
                <div style={styles.barLabel}>
                  {new Date(day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Meetings list */}
      <div>
        <div style={styles.sectionTitle}>All Meetings</div>
        {meetings.length === 0 ? (
          <p style={{ color: '#9aa0a6', fontSize: 14 }}>No meetings yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Room</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map(m => (
                <tr key={m.id} style={styles.tr}>
                  <td style={styles.td}>{m.title}</td>
                  <td style={{ ...styles.td, color: '#9aa0a6', whiteSpace: 'nowrap' }}>
                    {new Date(m.created_at).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12, color: '#5f6368' }}>
                    {m.room_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const styles = {
  statRow: { display: 'flex', gap: 16 },
  statCard: {
    flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 12, padding: '20px 16px', textAlign: 'center',
  },
  statValue: { fontSize: 32, fontWeight: 700, color: '#1a73e8' },
  statLabel: { fontSize: 12, color: '#9aa0a6', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },
  chartBox: {
    background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)',
    borderRadius: 12, padding: '20px 16px',
  },
  chartTitle: { fontSize: 13, color: '#9aa0a6', marginBottom: 16, fontWeight: 500 },
  chart: { display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  bar: { width: '100%', background: 'linear-gradient(180deg,#4d94ff,#1a73e8)', borderRadius: '3px 3px 0 0', transition: 'height .3s' },
  barLabel: { fontSize: 9, color: '#5f6368', marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap' },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#9aa0a6', borderBottom: '1px solid rgba(255,255,255,.07)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,.05)' },
  td: { padding: '11px 12px', fontSize: 14, color: '#e8eaed', verticalAlign: 'middle' },
}
