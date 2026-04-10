import { useState, useEffect, useMemo } from 'react'
import { apiFetch } from '../api.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDuration(seconds) {
  if (seconds == null) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmtShortDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function isLive(meeting) {
  return !meeting.ended_at
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px 24px',
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: accent || 'var(--text)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

// ── Meeting Detail Panel ──────────────────────────────────────────────────────

function MeetingDetailPanel({ meeting, projectId, token, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    apiFetch(`/projects/${projectId}/meetings/${meeting.id}`, {}, token)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [meeting.id, projectId, token])

  const live = isLive(meeting)

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: 420, maxWidth: '95vw',
      background: '#1c1d21',
      borderLeft: '1px solid var(--border)',
      zIndex: 500,
      display: 'flex', flexDirection: 'column',
      boxShadow: '-8px 0 32px rgba(0,0,0,.4)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {live && (
              <span style={{
                background: 'rgba(52,199,89,.15)', color: '#34c759',
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                textTransform: 'uppercase', letterSpacing: 1,
              }}>● Live</span>
            )}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', wordBreak: 'break-word' }}>
            {meeting.title || meeting.room_name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            {fmtDate(meeting.created_at)}
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'var(--muted)',
          cursor: 'pointer', padding: 4, flexShrink: 0, lineHeight: 1,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Meta row */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid var(--border)',
      }}>
        {[
          { label: 'Duration',     value: live ? 'Ongoing' : fmtDuration(meeting.duration_seconds) },
          { label: 'Participants', value: meeting.participant_count ?? (detail?.participants?.length ?? '—') },
        ].map((item, i) => (
          <div key={i} style={{
            flex: 1, padding: '14px 20px',
            borderRight: i === 0 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Participants */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
          Participants
        </div>

        {loading && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>}

        {!loading && detail?.participants?.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No participant data recorded.</p>
        )}

        {!loading && detail?.participants?.map((p, i) => {
          const staySeconds = p.left_at && p.joined_at
            ? Math.round((new Date(p.left_at) - new Date(p.joined_at)) / 1000)
            : null
          const isHost = p.role === 'host'
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: i < detail.participants.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: isHost ? 'rgba(108,99,255,.2)' : 'rgba(255,255,255,.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: isHost ? 'var(--primary)' : 'var(--muted)',
                  flexShrink: 0,
                }}>
                  {(p.display_name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{p.display_name}</span>
                    {isHost && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: 'var(--primary)',
                        textTransform: 'uppercase', letterSpacing: 1,
                        background: 'rgba(108,99,255,.15)', padding: '1px 6px', borderRadius: 4,
                      }}>host</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    Joined {fmtShortDate(p.joined_at)}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: staySeconds ? 'var(--text)' : 'var(--muted)' }}>
                  {staySeconds ? fmtDuration(staySeconds) : (p.left_at ? '—' : 'Still in')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>stay</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SummaryPage({ project, token }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [sortBy, setSortBy]       = useState('date_desc')
  const [selected, setSelected]   = useState(null)
  const [filterStatus, setFilterStatus] = useState('all') // 'all' | 'live' | 'ended'

  useEffect(() => {
    setAnalytics(null); setLoading(true); setSelected(null)
    apiFetch(`/projects/${project.id}/analytics`, {}, token)
      .then(setAnalytics)
      .catch(() => setAnalytics({ total: 0, meetings: [] }))
      .finally(() => setLoading(false))
  }, [project.id, token])

  const meetings = analytics?.meetings || []

  // Stats
  const totalMeetings    = meetings.length
  const liveMeetings     = meetings.filter(m => !m.ended_at).length
  const totalParticipants = meetings.reduce((s, m) => s + (m.participant_count || 0), 0)
  const endedWithDuration = meetings.filter(m => m.duration_seconds != null)
  const avgDuration = endedWithDuration.length
    ? Math.round(endedWithDuration.reduce((s, m) => s + m.duration_seconds, 0) / endedWithDuration.length)
    : null
  const longestMeeting = endedWithDuration.length
    ? Math.max(...endedWithDuration.map(m => m.duration_seconds))
    : null

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...meetings]
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
      case 'date_asc':   list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break
      case 'duration':   list.sort((a, b) => (b.duration_seconds || 0) - (a.duration_seconds || 0)); break
      case 'participants': list.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0)); break
      default:           list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break
    }
    return list
  }, [meetings, search, sortBy, filterStatus])

  return (
    <div className="page-content" style={{ position: 'relative' }}>
      <div className="page-heading">
        <h1>Summary</h1>
        <p>Overview of all meetings and activity for {project.name}.</p>
      </div>

      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}

      {!loading && (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <StatCard label="Total Meetings"     value={totalMeetings}           sub="all time" />
            <StatCard label="Total Participants" value={totalParticipants}        sub="join sessions" />
            <StatCard label="Avg Duration"       value={fmtDuration(avgDuration)} sub="per meeting" />
            <StatCard label="Longest Meeting"    value={fmtDuration(longestMeeting)} sub="ever" />
            {liveMeetings > 0 && (
              <StatCard label="Live Now" value={liveMeetings} sub="meeting(s) active" accent="#34c759" />
            )}
          </div>

          {/* Toolbar */}
          <div style={{
            display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16,
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search meetings…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '8px 12px 8px 34px',
                  color: 'var(--text)', fontSize: 13, outline: 'none',
                }}
              />
            </div>

            {/* Status filter */}
            <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {[['all','All'],['live','Live'],['ended','Ended']].map(([val, label]) => (
                <button key={val} onClick={() => setFilterStatus(val)} style={{
                  background: filterStatus === val ? 'var(--primary)' : 'var(--surface)',
                  color: filterStatus === val ? '#fff' : 'var(--muted)',
                  border: 'none', padding: '7px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'background .15s',
                }}>{label}</button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
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
          </div>

          {/* Meetings List */}
          {filtered.length === 0 && (
            <div className="section-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                style={{ color: 'var(--muted)', marginBottom: 12 }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
                {search || filterStatus !== 'all' ? 'No meetings match your filter.' : 'No meetings yet. Start a meeting to see it here.'}
              </p>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 130px 100px 80px 80px',
                padding: '10px 20px',
                borderBottom: '1px solid var(--border)',
                fontSize: 11, fontWeight: 600, color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: 1,
              }}>
                <span>Meeting</span>
                <span>Date</span>
                <span>Duration</span>
                <span style={{ textAlign: 'center' }}>People</span>
                <span style={{ textAlign: 'center' }}>Status</span>
              </div>

              {/* Rows */}
              {filtered.map((m, i) => {
                const live = isLive(m)
                const isActive = selected?.id === m.id
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelected(isActive ? null : m)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 130px 100px 80px 80px',
                      padding: '14px 20px',
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none',
                      cursor: 'pointer',
                      background: isActive ? 'rgba(108,99,255,.08)' : 'transparent',
                      transition: 'background .12s',
                      alignItems: 'center',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,.03)' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 600, color: 'var(--text)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {m.title || m.room_name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                        {m.room_name}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {fmtShortDate(m.created_at)}
                    </div>
                    <div style={{ fontSize: 13, color: live ? '#34c759' : 'var(--text)', fontWeight: 600 }}>
                      {live ? 'Ongoing' : fmtDuration(m.duration_seconds)}
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                      {m.participant_count || 0}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                        textTransform: 'uppercase', letterSpacing: 0.5,
                        background: live ? 'rgba(52,199,89,.15)' : 'rgba(255,255,255,.07)',
                        color: live ? '#34c759' : 'var(--muted)',
                      }}>
                        {live ? 'Live' : 'Ended'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Summary footer */}
          {filtered.length > 0 && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, textAlign: 'right' }}>
              Showing {filtered.length} of {totalMeetings} meeting{totalMeetings !== 1 ? 's' : ''}
            </div>
          )}
        </>
      )}

      {/* Detail Panel */}
      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 499 }}
          />
          <MeetingDetailPanel
            meeting={selected}
            projectId={project.id}
            token={token}
            onClose={() => setSelected(null)}
          />
        </>
      )}
    </div>
  )
}
