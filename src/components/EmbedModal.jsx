import { useState } from 'react'

export default function EmbedModal({ project, onClose, onToast }) {
  const [tab, setTab] = useState('host') // 'host' | 'guest'

  const code = tab === 'host' ? project.html : project.guest_html

  function doCopy() {
    if (!code) return
    navigator.clipboard.writeText(code).then(() => {
      onToast('Copied to clipboard!')
    })
  }

  function doDownload() {
    if (!code) return
    const suffix = tab === 'host' ? 'host' : 'guest'
    const blob = new Blob([code], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), {
      href: url,
      download: `${project.room_name}-${suffix}.html`,
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
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button
              className={`btn btn-sm ${tab === 'host' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTab('host')}
            >
              Host / Admin Code
            </button>
            <button
              className={`btn btn-sm ${tab === 'guest' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTab('guest')}
            >
              Guest / Participant Code
            </button>
          </div>

          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
            {tab === 'host'
              ? 'Use this code on the host/admin side. The host can admit or deny guests who knock.'
              : 'Share this code with participants. Guests must wait for the host to approve their join request.'}
          </p>

          <div className="code-block">
            {code ?? 'Loading…'}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-ghost" onClick={doCopy} disabled={!code}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            Copy Code
          </button>
          <button className="btn btn-primary" onClick={doDownload} disabled={!code}>
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
