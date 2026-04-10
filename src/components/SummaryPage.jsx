import { useState, useEffect, useMemo } from 'react'
import { apiFetch } from '../api.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDuration(seconds) {
  if (seconds == null) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`
  return `${s}s`
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtShortDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── CSV Export ────────────────────────────────────────────────────────────────

function exportCSV(meetings, projectName) {
  const rows = [
    ['Meeting Title', 'Room', 'Date', 'Started At', 'Ended At', 'Duration', 'Participants', 'Status'],
    ...meetings.map(m => [
      m.title || m.room_name,
      m.room_name,
      new Date(m.created_at).toLocaleDateString(),
      m.started_at ? new Date(m.started_at).toLocaleString() : new Date(m.created_at).toLocaleString(),
      m.ended_at ? new Date(m.ended_at).toLocaleString() : '',
      m.duration_seconds != null ? fmtDuration(m.duration_seconds) : '',
      m.participant_count || 0,
      m.ended_at ? 'Ended' : 'Live',
    ])
  ]
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${projectName.replace(/\s+/g, '_')}_meetings_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accentBg, accentText }) {
  return (
    <div style={{
      background: accentBg || 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '18px 22px',
      flex: 1, minWidth: 140,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ fontSize: 11, color: accentText || 'var(--muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: accentText || 'var(--text)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: accentText || 'var(--muted)', marginTop: 5, opacity: 0.8 }}>{sub}</div>}
    </div>
  )
}

// ── Full-screen Meeting Detail ────────────────────────────────────────────────

function MeetingDetail({ meeting, projectId, token, onBack }) {
  const [detail, setDetail]           = useState(null)
  const [loading, setLoading]         = useState(true)
  const [participantSearch, setParticipantSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    setParticipantSearch('')
    apiFetch(`/projects/${projectId}/meetings/${meeting.id}`, {}, token)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [meeting.id, projectId, token])

  const live = !meeting.ended_at
  const allParticipants = detail?.participants || []

  const participants = useMemo(() => {
    if (!participantSearch.trim()) return allParticipants
    const q = participantSearch.trim().toLowerCase()
    return allParticipants.filter(p =>
      (p.display_name || '').toLowerCase().includes(q) ||
      (p.role || '').toLowerCase().includes(q)
    )
  }, [allParticipants, participantSearch])

  return (
    <div className="page-content">
      {/* Top bar with back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: 'var(--text)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a202c', margin: 0 }}>
              {meeting.title || meeting.room_name}
            </h1>
            {live && (
              <span style={{
                background: '#dcfce7', color: '#16a34a',
                fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                textTransform: 'uppercase', letterSpacing: 1,
              }}>● Live</span>
            )}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
            {meeting.room_name} &nbsp;·&nbsp; {fmtDate(meeting.created_at)}
          </div>
        </div>
      </div>

      {/* Summary stat cards */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatCard
          label="Meeting Duration"
          value={live ? 'Ongoing' : fmtDuration(meeting.duration_seconds)}
          sub={live ? 'still active' : 'total time'}
          accentBg={live ? '#dcfce7' : undefined}
          accentText={live ? '#16a34a' : undefined}
        />
        <StatCard
          label="Total Participants"
          value={allParticipants.length || meeting.participant_count || 0}
          sub="joined"
        />
        <StatCard
          label="Started At"
          value={fmtTime(detail?.started_at || meeting.started_at || meeting.created_at)}
          sub={new Date(detail?.started_at || meeting.started_at || meeting.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        />
        <StatCard
          label="Ended At"
          value={meeting.ended_at ? fmtTime(meeting.ended_at) : '—'}
          sub={meeting.ended_at
            ? new Date(meeting.ended_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : live ? 'still running' : 'unknown'}
        />
      </div>

      {/* Participants table */}
      <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table header bar with search */}
        <div style={{
          padding: '12px 22px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#f8fafc', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1a202c' }}>Participants</span>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            {loading ? '…' : `${allParticipants.length} total`}
          </span>
          {/* Participant search */}
          {!loading && allParticipants.length > 0 && (
            <div style={{ position: 'relative', marginLeft: 'auto' }}>
              <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search participants…"
                value={participantSearch}
                onChange={e => setParticipantSearch(e.target.value)}
                style={{
                  background: '#fff', border: '1px solid #e2e8f0',
                  borderRadius: 7, padding: '6px 10px 6px 28px',
                  fontSize: 12, color: '#1a202c', outline: 'none', width: 200,
                }}
              />
            </div>
          )}
        </div>

        {/* Column headers */}
        {!loading && allParticipants.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 80px 160px 160px 120px',
            padding: '9px 22px', borderBottom: '1px solid var(--border)',
            fontSize: 11, fontWeight: 700, color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: 0.5,
            background: '#fff',
          }}>
            <span>Name</span>
            <span>Role</span>
            <span>Joined At</span>
            <span>Left At</span>
            <span>Attended</span>
          </div>
        )}

        {loading && (
          <div style={{ padding: '32px 22px', color: '#64748b', fontSize: 14 }}>Loading…</div>
        )}

        {!loading && allParticipants.length === 0 && (
          <div style={{ padding: '40px 22px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            No participant data recorded for this meeting.
          </div>
        )}

        {!loading && allParticipants.length > 0 && participants.length === 0 && (
          <div style={{ padding: '32px 22px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            No participants match "{participantSearch}".
          </div>
        )}

        {!loading && participants.map((p, i) => {
          const staySeconds = p.left_at && p.joined_at
            ? Math.round((new Date(p.left_at) - new Date(p.joined_at)) / 1000)
            : null
          const isHost = p.role === 'host'
          const initial = (p.display_name || '?')[0].toUpperCase()
          const isLast = i === participants.length - 1

          return (
            <div
              key={i}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 80px 160px 160px 120px',
                padding: '14px 22px', alignItems: 'center',
                borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                background: '#fff',
              }}
            >
              {/* Name + avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: isHost ? '#ede9fe' : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700,
                  color: isHost ? '#6c63ff' : '#64748b',
                }}>
                  {initial}
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 600, color: '#1a202c',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {p.display_name || 'Unknown'}
                </span>
              </div>

              {/* Role */}
              <div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                  textTransform: 'uppercase', letterSpacing: 0.5,
                  background: isHost ? '#ede9fe' : '#f1f5f9',
                  color: isHost ? '#6c63ff' : '#64748b',
                }}>
                  {p.role}
                </span>
              </div>

              {/* Joined At */}
              <div style={{ fontSize: 13, color: '#1a202c' }}>
                {fmtShortDate(p.joined_at)}
              </div>

              {/* Left At */}
              <div style={{ fontSize: 13, color: p.left_at ? '#1a202c' : '#94a3b8' }}>
                {p.left_at ? fmtShortDate(p.left_at) : (live ? 'Still in meeting' : '—')}
              </div>

              {/* Attended duration */}
              <div>
                {staySeconds != null ? (
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: '#1a202c',
                    background: '#f1f5f9', padding: '4px 10px', borderRadius: 6,
                  }}>
                    {fmtDuration(staySeconds)}
                  </span>
                ) : (
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>
                    {live ? 'Active' : '—'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

// A meeting is "scheduled" (never started) if it has a scheduled_at, no ended_at, and 0 participants.
function meetingStatus(m) {
  if (m.ended_at) return 'ended'
  if (m.scheduled_at && (m.participant_count || 0) === 0) return 'scheduled'
  return 'live'
}

export default function SummaryPage({ project, token }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch]       = useState('')
  const [sortBy, setSortBy]       = useState('date_desc')
  const [selected, setSelected]   = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const loadAnalytics = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else { setAnalytics(null); setLoading(true); setSelected(null) }
    apiFetch(`/projects/${project.id}/analytics`, {}, token)
      .then(setAnalytics)
      .catch(() => setAnalytics({ total: 0, meetings: [] }))
      .finally(() => { setLoading(false); setRefreshing(false) })
  }

  useEffect(() => { loadAnalytics() }, [project.id, token])

  // All hooks must be called unconditionally before any early return
  const allMeetings = analytics?.meetings || []

  // Split into scheduled (never started) vs started (live + ended)
  const scheduledMeetings = allMeetings.filter(m => meetingStatus(m) === 'scheduled')
  const startedMeetings   = allMeetings.filter(m => meetingStatus(m) !== 'scheduled')

  const totalMeetings     = startedMeetings.length
  const liveMeetings      = startedMeetings.filter(m => !m.ended_at).length
  const totalParticipants = startedMeetings.reduce((s, m) => s + (m.participant_count || 0), 0)
  const endedWithDuration = startedMeetings.filter(m => m.duration_seconds != null)
  const avgDuration = endedWithDuration.length
    ? Math.round(endedWithDuration.reduce((s, m) => s + m.duration_seconds, 0) / endedWithDuration.length)
    : null
  const longestMeeting = endedWithDuration.length
    ? Math.max(...endedWithDuration.map(m => m.duration_seconds))
    : null

  const filtered = useMemo(() => {
    let list = [...startedMeetings]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(m =>
        (m.title || '').toLowerCase().includes(q) ||
        (m.room_name || '').toLowerCase().includes(q)
      )
    }
    if (filterStatus === 'live')  list = list.filter(m => !m.ended_at)
    if (filterStatus === 'ended') list = list.filter(m => !!m.ended_at)
    switch (sortBy) {
      case 'date_asc':     list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break
      case 'duration':     list.sort((a, b) => (b.duration_seconds || 0) - (a.duration_seconds || 0)); break
      case 'participants': list.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0)); break
      default:             list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break
    }
    return list
  }, [startedMeetings, search, sortBy, filterStatus])

  const filteredScheduled = useMemo(() => {
    if (!search.trim()) return scheduledMeetings
    const q = search.trim().toLowerCase()
    return scheduledMeetings.filter(m =>
      (m.title || '').toLowerCase().includes(q) ||
      (m.room_name || '').toLowerCase().includes(q)
    )
  }, [scheduledMeetings, search])

  // Show full-screen detail when a meeting is selected
  if (selected) {
    return (
      <MeetingDetail
        meeting={selected}
        projectId={project.id}
        token={token}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="page-content">
      {/* Page heading with refresh button */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="page-heading" style={{ margin: 0 }}>
          <h1 style={{ margin: 0 }}>Summary</h1>
          <p style={{ margin: '4px 0 0' }}>Overview of all meetings and activity for {project.name}.</p>
        </div>
        <button
          onClick={() => loadAnalytics(true)}
          disabled={refreshing || loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '7px 14px', cursor: refreshing ? 'default' : 'pointer',
            fontSize: 13, fontWeight: 600, color: 'var(--text)',
            boxShadow: 'var(--shadow-sm)', opacity: refreshing ? 0.6 : 1,
            marginTop: 4,
          }}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
          >
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}

      {!loading && (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <StatCard label="Total Meetings"     value={totalMeetings}              sub="all time" />
            <StatCard label="Total Participants" value={totalParticipants}           sub="join sessions" />
            <StatCard label="Avg Duration"       value={fmtDuration(avgDuration)}   sub="per meeting" />
            <StatCard label="Longest Meeting"    value={fmtDuration(longestMeeting)} sub="ever" />
            {liveMeetings > 0 && (
              <StatCard label="Live Now" value={liveMeetings} sub="active"
                accentBg="#dcfce7" accentText="#16a34a" />
            )}
            {scheduledMeetings.length > 0 && (
              <StatCard label="Scheduled" value={scheduledMeetings.length} sub="upcoming"
                accentBg="#eff6ff" accentText="#3b82f6" />
            )}
          </div>

          {/* ── Scheduled Meetings Section ──────────────────────────────── */}
          {filteredScheduled.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>Scheduled Meetings</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                  background: '#eff6ff', color: '#3b82f6',
                }}>{filteredScheduled.length}</span>
              </div>
              <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 160px 160px',
                  padding: '9px 20px', borderBottom: '1px solid var(--border)',
                  fontSize: 11, fontWeight: 700, color: 'var(--muted)',
                  textTransform: 'uppercase', letterSpacing: 0.5, background: '#f8fafc',
                }}>
                  <span>Meeting</span>
                  <span>Created</span>
                  <span>Scheduled For</span>
                </div>
                {filteredScheduled.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'grid', gridTemplateColumns: '1fr 160px 160px',
                    padding: '13px 20px', alignItems: 'center',
                    borderBottom: i < filteredScheduled.length - 1 ? '1px solid #f1f5f9' : 'none',
                    background: '#fff',
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a202c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.title || m.room_name}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{m.room_name}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{fmtShortDate(m.created_at)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6' }}>{fmtDate(m.scheduled_at)}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                        background: '#eff6ff', color: '#3b82f6',
                        textTransform: 'uppercase', letterSpacing: 0.5,
                      }}>Upcoming</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Toolbar ─────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text" placeholder="Search meetings…" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '8px 12px 8px 33px',
                  color: 'var(--text)', fontSize: 13, outline: 'none',
                }}
              />
            </div>

            {/* Status filter */}
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              {[['all','All'],['live','Live'],['ended','Ended']].map(([val, label]) => (
                <button key={val} onClick={() => setFilterStatus(val)} style={{
                  background: filterStatus === val ? 'var(--primary)' : 'var(--surface)',
                  color: filterStatus === val ? '#fff' : 'var(--muted)',
                  border: 'none', padding: '7px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer',
                }}>{label}</button>
              ))}
            </div>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '7px 12px', color: 'var(--text)',
                fontSize: 12, cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
              <option value="duration">Longest first</option>
              <option value="participants">Most participants</option>
            </select>

            {/* Export CSV */}
            {startedMeetings.length > 0 && (
              <button
                onClick={() => exportCSV(filtered.length > 0 ? filtered : startedMeetings, project.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '7px 13px', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, color: 'var(--text)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export CSV
              </button>
            )}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="section-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                style={{ color: 'var(--muted)', marginBottom: 12 }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
                {search || filterStatus !== 'all' ? 'No meetings match your filter.' : 'No meetings started yet.'}
              </p>
            </div>
          )}

          {/* Meetings table */}
          {filtered.length > 0 && (
            <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 140px 100px 72px 80px',
                padding: '9px 20px', borderBottom: '1px solid var(--border)',
                fontSize: 11, fontWeight: 700, color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: 0.5, background: '#f8fafc',
              }}>
                <span>Meeting</span>
                <span>Date</span>
                <span>Duration</span>
                <span style={{ textAlign: 'center' }}>People</span>
                <span style={{ textAlign: 'center' }}>Status</span>
              </div>

              {filtered.map((m, i) => {
                const live = !m.ended_at
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelected(m)}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr 140px 100px 72px 80px',
                      padding: '13px 20px',
                      borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
                      cursor: 'pointer', alignItems: 'center',
                      transition: 'background .12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 600, color: '#1a202c',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {m.title || m.room_name}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{m.room_name}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{fmtShortDate(m.created_at)}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: live ? '#16a34a' : '#1a202c' }}>
                      {live ? 'Ongoing' : fmtDuration(m.duration_seconds)}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#1a202c' }}>
                      {m.participant_count || 0}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                        textTransform: 'uppercase', letterSpacing: 0.5,
                        background: live ? '#dcfce7' : '#f1f5f9',
                        color: live ? '#16a34a' : '#64748b',
                      }}>
                        {live ? 'Live' : 'Ended'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {filtered.length > 0 && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, textAlign: 'right' }}>
              {filtered.length} of {totalMeetings} meeting{totalMeetings !== 1 ? 's' : ''}
            </div>
          )}
        </>
      )}
    </div>
  )
}
