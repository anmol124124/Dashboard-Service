import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

export default function AnalyticsModal({ project, token, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMeeting, setSelectedMeeting] = useState(null)

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
          <h2 className="modal-title">
            {selectedMeeting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setSelectedMeeting(null)} style={styles.backBtn} title="Back">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                {selectedMeeting.title}
              </span>
            ) : (
              `Analytics — ${project.name}`
            )}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {loading && <p style={{ color: '#9aa0a6', textAlign: 'center', padding: '32px 0' }}>Loading…</p>}
          {error && <p style={{ color: '#ea4335', textAlign: 'center' }}>{error}</p>}
          {data && !selectedMeeting && (
            <AnalyticsContent
              data={data}
              projectId={project.id}
              token={token}
              onSelectMeeting={setSelectedMeeting}
            />
          )}
          {selectedMeeting && (
            <MeetingDetail
              meeting={selectedMeeting}
              projectId={project.id}
              token={token}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function fmtDuration(secs) {
  if (secs == null) return '—'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function downloadCSV(meetings) {
  const header = ['Title', 'Date & Time', 'Duration', 'Participants', 'Room']
  const rows = meetings.map(m => [
    `"${m.title.replace(/"/g, '""')}"`,
    `"${new Date(m.created_at).toLocaleString()}"`,
    fmtDuration(m.duration_seconds),
    m.participant_count,
    m.room_name,
  ])
  const csv = [header, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `meetings-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function AnalyticsContent({ data, projectId, token, onSelectMeeting }) {
  const { total, meetings } = data

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
          <div style={styles.statValue}>{counts.reduce((a, b) => a + b, 0)}</div>
          <div style={styles.statLabel}>Last 14 Days</div>
        </div>
      </div>

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

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={styles.sectionTitle}>All Meetings</div>
          {meetings.length > 0 && (
            <button onClick={() => downloadCSV(meetings)} style={styles.csvBtn}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 5 }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download CSV
            </button>
          )}
        </div>
        {meetings.length === 0 ? (
          <p style={{ color: '#9aa0a6', fontSize: 14 }}>No meetings yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Participants</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map(m => (
                <MeetingRow
                  key={m.id}
                  meeting={m}
                  projectId={projectId}
                  token={token}
                  onSelect={onSelectMeeting}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function MeetingRow({ meeting, projectId, token, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const detail = await apiFetch(`/projects/${projectId}/meetings/${meeting.id}`, {}, token)
      onSelect(detail)
    } catch (e) {
      console.error('Failed to load meeting detail', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr
      style={{ ...styles.tr, background: hovered ? 'rgba(255,255,255,.04)' : 'transparent', cursor: 'pointer' }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={styles.td}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {loading
            ? <span style={{ fontSize: 12, color: '#9aa0a6' }}>Loading…</span>
            : meeting.title
          }
          {!loading && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" style={{ opacity: hovered ? 1 : 0, transition: 'opacity .15s' }}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
        </span>
      </td>
      <td style={{ ...styles.td, color: '#9aa0a6', whiteSpace: 'nowrap' }}>
        {new Date(meeting.created_at).toLocaleString(undefined, {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })}
      </td>
      <td style={{ ...styles.td, color: '#9aa0a6' }}>{fmtDuration(meeting.duration_seconds)}</td>
      <td style={{ ...styles.td, color: '#9aa0a6' }}>{meeting.participant_count}</td>
    </tr>
  )
}

function MeetingDetail({ meeting }) {
  const fmtTime = iso => iso
    ? new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Summary cards */}
      <div style={styles.statRow}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, fontSize: 18, wordBreak: 'break-all' }}>{meeting.admin.email}</div>
          <div style={styles.statLabel}>Host</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{fmtDuration(meeting.duration_seconds)}</div>
          <div style={styles.statLabel}>Duration</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{meeting.participants.length}</div>
          <div style={styles.statLabel}>Participants</div>
        </div>
      </div>

      {/* Time row */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ ...styles.statCard, flex: 1, textAlign: 'left', padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Started</div>
          <div style={{ fontSize: 14, color: '#e8eaed' }}>{fmtTime(meeting.created_at)}</div>
        </div>
        <div style={{ ...styles.statCard, flex: 1, textAlign: 'left', padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Ended</div>
          <div style={{ fontSize: 14, color: meeting.ended_at ? '#e8eaed' : '#fbbc04' }}>
            {meeting.ended_at ? fmtTime(meeting.ended_at) : 'Ongoing'}
          </div>
        </div>
      </div>

      {/* Participants table */}
      <div>
        <div style={styles.sectionTitle}>Participants</div>
        {meeting.participants.length === 0 ? (
          <p style={{ color: '#9aa0a6', fontSize: 14 }}>No participant data recorded yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Left</th>
              </tr>
            </thead>
            <tbody>
              {meeting.participants.map((p, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.td}>{p.display_name}</td>
                  <td style={styles.td}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: p.role === 'host' ? 'rgba(26,115,232,.2)' : 'rgba(255,255,255,.07)',
                      color: p.role === 'host' ? '#4d94ff' : '#9aa0a6',
                    }}>
                      {p.role}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: '#9aa0a6', whiteSpace: 'nowrap' }}>{fmtTime(p.joined_at)}</td>
                  <td style={{ ...styles.td, color: p.left_at ? '#9aa0a6' : '#fbbc04', whiteSpace: 'nowrap' }}>
                    {p.left_at ? fmtTime(p.left_at) : 'Active'}
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
  backBtn: {
    background: 'none', border: 'none', cursor: 'pointer', color: '#9aa0a6',
    padding: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: 4,
  },
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
  sectionTitle: { fontSize: 13, fontWeight: 600, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 0 },
  csvBtn: {
    display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,.06)',
    border: '1px solid rgba(255,255,255,.12)', borderRadius: 8,
    color: '#e8eaed', fontSize: 13, fontWeight: 500, padding: '6px 12px',
    cursor: 'pointer', transition: 'background .15s',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#9aa0a6', borderBottom: '1px solid rgba(255,255,255,.07)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,.05)' },
  td: { padding: '11px 12px', fontSize: 14, color: '#e8eaed', verticalAlign: 'middle' },
}
