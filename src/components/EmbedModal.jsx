import { useState } from 'react'

export default function EmbedModal({ project, onClose, onToast }) {
  const [copied, setCopied] = useState(false)

  function doCopy() {
    if (!project.html) return
    navigator.clipboard.writeText(project.html).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onToast('Copied to clipboard!')
    })
  }

  function doDownload() {
    if (!project.html) return
    const blob = new Blob([project.html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), {
      href: url,
      download: `${project.room_name}.html`,
    }).click()
    URL.revokeObjectURL(url)
    onToast('Downloaded!')
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <div className="modal-head">
          <h2>Embed Code — {project.name}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {/* How-to note */}
          <div style={{
            background: 'rgba(26,115,232,0.08)',
            border: '1px solid rgba(26,115,232,0.25)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            lineHeight: 1.6,
            marginBottom: 14,
            color: 'var(--muted)',
          }}>
            <strong style={{ color: 'var(--text)' }}>How to use:</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              <li>Deploy this HTML file on your allowed domain.</li>
              <li><strong style={{ color: 'var(--text)' }}>Guests</strong> visit the plain URL → they must wait for host approval.</li>
              <li><strong style={{ color: 'var(--text)' }}>You (host/admin)</strong> open the same URL with <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4 }}>?role=host</code> appended → direct join, can admit guests.</li>
            </ul>
          </div>

          <div className="code-block">
            {project.html ?? 'Loading…'}
          </div>
          {copied && (
            <span className="copy-success">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied!
            </span>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-ghost" onClick={doCopy} disabled={!project.html}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            Copy Code
          </button>
          <button className="btn btn-primary" onClick={doDownload} disabled={!project.html}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download HTML
          </button>
        </div>
      </div>
    </div>
  )
}
