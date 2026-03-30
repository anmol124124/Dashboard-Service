import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

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

export default function AnalyticsPage({ project, token }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMeeting, setSelectedMeeting] = useState(null)

  useEffect(() => {
    setData(null)
    setLoading(true)
    setError('')
    setSelectedMeeting(null)
    apiFetch(`/projects/${project.id}/analytics`, {}, token)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [project.id, token])

  return (
    <div className="page-content">
      <div className="page-heading">
        {selectedMeeting ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setSelectedMeeting(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px', display: 'flex', alignItems: 'center', borderRadius: 6 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <h1>{selectedMeeting.title}</h1>
          </div>
        ) : (
          <>
            <h1>Analytics</h1>
            <p>Meeting history and usage statistics for {project.name}.</p>
          </>
        )}
      </div>

      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      {data && !selectedMeeting && (
        <AnalyticsContent
          data={data}
          projectId={project.id}
          token={token}
          onSelectMeeting={setSelectedMeeting}
        />
      )}
      {selectedMeeting && <MeetingDetail meeting={selectedMeeting} />}
    </div>
  )
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
  const totalParticipants = meetings.reduce((s, m) => s + (m.participant_count || 0), 0)

  return (
    <div>
      {/* Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Meetings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalParticipants}</div>
          <div className="stat-label">Total Participants</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{counts.reduce((a, b) => a + b, 0)}</div>
          <div className="stat-label">Last 14 Days</div>
        </div>
      </div>

      {/* Chart */}
      <div className="section-card">
        <div className="section-card-title">Meetings per Day — last 14 days</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100 }}>
          {days.map((day, i) => (
            <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }} title={`${day}: ${counts[i]}`}>
              <div style={{
                width: '100%',
                background: 'linear-gradient(180deg,#6c63ff,#4d3fc5)',
                borderRadius: '3px 3px 0 0',
                height: `${Math.round((counts[i] / maxCount) * 100)}%`,
                minHeight: counts[i] > 0 ? 4 : 0,
                transition: 'height .3s',
              }} />
              {i % 2 === 0 && (
                <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4, whiteSpace: 'nowrap' }}>
                  {new Date(day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="section-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="section-card-title" style={{ marginBottom: 0 }}>All Meetings</div>
          {meetings.length > 0 && (
            <button onClick={() => downloadCSV(meetings)} className="btn btn-ghost btn-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download CSV
            </button>
          )}
        </div>
        {meetings.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No meetings yet.</p>
        ) : (
          <table className="rec-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Participants</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map(m => (
                <MeetingRow key={m.id} meeting={m} projectId={projectId} token={token} onSelect={onSelectMeeting} />
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
      style={{ background: hovered ? 'rgba(255,255,255,.03)' : 'transparent', cursor: 'pointer' }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {loading ? <span style={{ fontSize: 12, color: 'var(--muted)' }}>Loading…</span> : meeting.title}
          {!loading && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" style={{ opacity: hovered ? 1 : 0, transition: 'opacity .15s' }}>
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
        </span>
      </td>
      <td style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>
        {new Date(meeting.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </td>
      <td style={{ color: 'var(--muted)' }}>{fmtDuration(meeting.duration_seconds)}</td>
      <td style={{ color: 'var(--muted)' }}>{meeting.participant_count}</td>
    </tr>
  )
}

function MeetingDetail({ meeting }) {
  const fmtTime = iso => iso
    ? new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—'

  return (
    <div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: 16, fontWeight: 600, wordBreak: 'break-all' }}>{meeting.admin?.email}</div>
          <div className="stat-label">Host</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{fmtDuration(meeting.duration_seconds)}</div>
          <div className="stat-label">Duration</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{meeting.participants.length}</div>
          <div className="stat-label">Participants</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
        <div className="stat-card" style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Started</div>
          <div style={{ fontSize: 14 }}>{fmtTime(meeting.created_at)}</div>
        </div>
        <div className="stat-card" style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Ended</div>
          <div style={{ fontSize: 14, color: meeting.ended_at ? 'var(--text)' : '#fbbc04' }}>
            {meeting.ended_at ? fmtTime(meeting.ended_at) : 'Ongoing'}
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-title">Participants</div>
        {meeting.participants.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No participant data recorded.</p>
        ) : (
          <table className="rec-table">
            <thead>
              <tr><th>Name</th><th>Role</th><th>Joined</th><th>Left</th></tr>
            </thead>
            <tbody>
              {meeting.participants.map((p, i) => (
                <tr key={i}>
                  <td>{p.display_name}</td>
                  <td>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 4,
                      fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                      background: p.role === 'host' ? 'rgba(108,99,255,.2)' : 'rgba(255,255,255,.07)',
                      color: p.role === 'host' ? 'var(--primary)' : 'var(--muted)',
                    }}>
                      {p.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)', whiteSpace: 'nowrap' }}>{fmtTime(p.joined_at)}</td>
                  <td style={{ color: p.left_at ? 'var(--muted)' : '#fbbc04', whiteSpace: 'nowrap' }}>
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
