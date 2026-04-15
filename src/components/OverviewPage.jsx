import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

/* ── Component ────────────────────────────────────────────────────────────── */
export default function OverviewPage({ project, token, onToast, user }) {
  const [embedData, setEmbedData] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [copied, setCopied] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)

  useEffect(() => {
    setEmbedData(null); setAnalytics(null)
    Promise.all([
      apiFetch(`/projects/${project.id}/embed`, {}, token),
      apiFetch(`/projects/${project.id}/analytics`, {}, token),
    ]).then(([e, a]) => { setEmbedData(e); setAnalytics(a) })
      .catch(e => onToast('Failed to load: ' + e.message))
  }, [project.id, token])

  function copy() {
    if (!embedData?.html) return
    navigator.clipboard.writeText(embedData.html).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
      onToast('Copied to clipboard!')
    })
  }

  function download() {
    if (!embedData?.html) return
    const blob = new Blob([embedData.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: `${project.room_name}.html` }).click()
    URL.revokeObjectURL(url)
    onToast('Downloaded!')
  }

  const lastMeetingDate = analytics?.meetings?.[0]
    ? new Date(analytics.meetings[0].created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1 className="glitch-title" data-text={project.name}>{project.name}</h1>
        <p>Embed code and quick stats for your project.</p>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-value">{analytics ? analytics.total : '—'}</div>
          <div className="stat-label">Total Meetings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: 15, paddingTop: 4 }}>{lastMeetingDate}</div>
          <div className="stat-label">Last Meeting</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--muted)', wordBreak: 'break-all' }}>
            {project.room_name}
          </div>
          <div className="stat-label">Room Name</div>
        </div>
      </div>

      {/* Host embed code */}
      <div className="section-card">
        <div className="section-card-title">Embed Code</div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Paste this into your website to embed the meeting room. This gives you the <strong style={{ color: 'var(--text)' }}>host view</strong> with full controls.
        </p>

        {embedData ? (
          <div className="sh-container">
            {/* Top bar with buttons */}
            <div className="sh-topbar">
              <span className="sh-lang">HTML</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="sh-btn" onClick={copy}>
                  {copied ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copy
                    </>
                  )}
                </button>
                <button className="sh-btn" onClick={download}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download
                </button>
              </div>
            </div>

            {/* Plain text — no dangerouslySetInnerHTML to avoid XSS */}
            <pre className="sh-pre">{embedData.html}</pre>
          </div>
        ) : (
          <div style={{ height: 200, background: '#1e2a3a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Loading…</p>
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text)' }}>How to use:</strong> Copy this snippet and paste it anywhere in your website's HTML.
          The embed is self-contained — no additional setup required. Go to <strong style={{ color: 'var(--text)' }}>API Keys</strong> to get your raw token.
        </div>
      </div>

      {scheduleOpen && (
        <ScheduleProjectMeetingModal
          project={project}
          token={token}
          onClose={() => setScheduleOpen(false)}
          onToast={onToast}
        />
      )}
    </div>
  )
}
