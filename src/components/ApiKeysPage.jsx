import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

export default function ApiKeysPage({ project, token, onToast }) {
  const [embedData, setEmbedData] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setEmbedData(null)
    apiFetch(`/projects/${project.id}/embed`, {}, token)
      .then(setEmbedData)
      .catch(e => onToast('Failed to load: ' + e.message))
  }, [project.id, token])

  function copyToken() {
    if (!embedData?.host_token) return
    navigator.clipboard.writeText(embedData.host_token).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onToast('Token copied!')
    })
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>API Keys</h1>
        <p>Your project embed token (JWT). Use this key to authenticate with RoomLy in your app.</p>
      </div>

      <div className="section-card">
        <div className="section-card-title">Embed Token (Host JWT)</div>
        <div style={{
          background: 'rgba(108,99,255,.06)',
          border: '1px solid rgba(108,99,255,.2)',
          borderRadius: 10,
          padding: '12px 16px',
          fontSize: 13,
          lineHeight: 1.6,
          color: 'var(--muted)',
          marginBottom: 18,
        }}>
          <strong style={{ color: 'var(--text)' }}>How to use:</strong> Add this token as <code style={{ background: 'rgba(255,255,255,.07)', padding: '1px 5px', borderRadius: 4, fontSize: 12, color: '#a8c0d6' }}>data-token</code> in your embed script tag.
          It authenticates you as the host and unlocks meeting controls. Keep it secret — treat it like a password.
        </div>

        {embedData ? (
          <>
            <div className="api-key-block">
              <div className="api-key-value">{embedData.host_token}</div>
              <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }} onClick={copyToken}>
                {copied ? (
                  <span className="copy-success">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Copied!
                  </span>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div style={{ marginTop: 24 }}>
              <div className="section-card-title">Usage Example</div>
              <div className="code-block">{`<!-- Add to your website HTML -->
<div id="roomly-meet"></div>
<script src="${window.location.origin.replace(':5173', ':8000')}/public/js/app.js"></script>
<script>
  new WebRTCMeetingAPI('#roomly-meet', {
    token: '${embedData.host_token.slice(0, 40)}...',
  });
</script>`}</div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="section-card-title">Token Details</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div className="stat-card" style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--muted)', wordBreak: 'break-all' }}>{project.room_name}</div>
                  <div className="stat-label" style={{ marginTop: 6 }}>Room Name</div>
                </div>
                <div className="stat-card" style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 13, color: '#34d399', fontWeight: 600 }}>host</div>
                  <div className="stat-label" style={{ marginTop: 6 }}>Role</div>
                </div>
                <div className="stat-card" style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>Never</div>
                  <div className="stat-label" style={{ marginTop: 6 }}>Expires</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Loading…</p>
        )}
      </div>
    </div>
  )
}
