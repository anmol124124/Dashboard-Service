import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

/* ── Syntax highlighter ───────────────────────────────────────────────────── */
function syntaxHighlight(code) {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const lines = code.split('\n')
  return lines.map(line => {
    let result = ''
    let i = 0

    while (i < line.length) {
      // JS line comment
      if (line[i] === '/' && line[i + 1] === '/') {
        result += `<span class="sh-comment">${esc(line.slice(i))}</span>`
        i = line.length
      }
      // HTML tag
      else if (line[i] === '<') {
        const end = line.indexOf('>', i)
        if (end !== -1) {
          const raw = line.slice(i, end + 1)
          // Inside tag: highlight attr values separately
          let inner = ''
          let j = 0
          while (j < raw.length) {
            if (raw[j] === '"') {
              let k = j + 1
              while (k < raw.length && raw[k] !== '"') k++
              inner += `<span class="sh-string">${esc(raw.slice(j, k + 1))}</span>`
              j = k + 1
            } else {
              inner += esc(raw[j]); j++
            }
          }
          result += `<span class="sh-tag">${inner}</span>`
          i = end + 1
        } else {
          result += esc(line[i]); i++
        }
      }
      // Single or double quoted string
      else if (line[i] === '"' || line[i] === "'") {
        const q = line[i]; let j = i + 1
        while (j < line.length && line[j] !== q) j++
        result += `<span class="sh-string">${esc(line.slice(i, j + 1))}</span>`
        i = j + 1
      }
      // JS keywords
      else {
        const kw = line.slice(i).match(/^(const|let|var|function|new|return|window|document|onload)\b/)
        if (kw) {
          result += `<span class="sh-keyword">${esc(kw[0])}</span>`
          i += kw[0].length
        } else {
          result += esc(line[i]); i++
        }
      }
    }
    return result
  }).join('\n')
}

/* ── Component ────────────────────────────────────────────────────────────── */
export default function OverviewPage({ project, token, onToast, user }) {
  const [embedData, setEmbedData] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [copied, setCopied] = useState(false)

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

            {/* Code with syntax highlighting */}
            <pre
              className="sh-pre"
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(embedData.html) }}
            />
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
    </div>
  )
}
