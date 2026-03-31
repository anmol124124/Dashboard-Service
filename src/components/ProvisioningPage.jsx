import { useState, useRef, useEffect } from 'react'
import { API_BASE } from '../api.js'

export default function ProvisioningPage({ project, token, onToast }) {
  const [logoUrl, setLogoUrl]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInputRef            = useRef(null)

  // Load current logo from embed data
  useEffect(() => {
    fetch(`${API_BASE}/projects/${project.id}/embed`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d.logo_url) setLogoUrl(d.logo_url) })
      .catch(() => {})
  }, [project.id, token])

  async function uploadFile(file) {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      onToast('Only PNG, JPG, GIF, WebP, or SVG allowed.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      onToast('Logo must be under 3 MB.')
      return
    }
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_BASE}/projects/${project.id}/logo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Upload failed')
      }
      const data = await res.json()
      setLogoUrl(data.logo_url + '?t=' + Date.now())
      onToast('Logo uploaded successfully!')
    } catch (e) {
      onToast('Upload failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function removeLogo() {
    setLoading(true)
    try {
      await fetch(`${API_BASE}/projects/${project.id}/logo`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setLogoUrl(null)
      onToast('Logo removed.')
    } catch {
      onToast('Failed to remove logo.')
    } finally {
      setLoading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Provisioning</h1>
        <p>Customize branding for meetings created from this project.</p>
      </div>

      {/* Logo upload card */}
      <div className="section-card" style={{ marginBottom: 24 }}>
        <div className="section-card-title">Meeting Logo</div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Upload your brand logo. It will appear in the top-left corner of every meeting
          launched from this project's embed code. Supported: PNG, JPG, GIF, WebP, SVG — max 3 MB.
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Drop zone */}
          <div
            style={{
              flex: 1, minWidth: 240,
              border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 12,
              padding: '36px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 12,
              background: dragging ? 'rgba(108,99,255,.06)' : 'var(--surface2)',
              cursor: 'pointer',
              transition: 'border-color .2s, background .2s',
            }}
            onClick={() => !loading && fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <path d="M3 9l4-4 4 4M7 5v10M14 15l3 3 3-3M17 18V8"/>
            </svg>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                {loading ? 'Uploading…' : 'Click or drag & drop'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>PNG, JPG, GIF, WebP, SVG up to 3 MB</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = '' }}
            />
          </div>

          {/* Preview */}
          <div style={{
            width: 220,
            background: 'var(--surface2)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            padding: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Preview
            </div>
            <div style={{
              width: '100%', height: 100,
              background: '#1a1d28',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  style={{ maxWidth: '80%', maxHeight: '70%', objectFit: 'contain', borderRadius: 4 }}
                />
              ) : (
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.25)' }}>No logo uploaded</span>
              )}
            </div>

            {logoUrl && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger)', opacity: loading ? 0.5 : 1 }}
                disabled={loading}
                onClick={removeLogo}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Remove Logo
              </button>
            )}

            {!logoUrl && (
              <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
                Upload a logo to preview it here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="section-card" style={{ background: 'rgba(108,99,255,.06)', borderColor: 'rgba(108,99,255,.2)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text)' }}>How it works:</strong> The logo will automatically appear in the top-left corner of
            meetings launched from your <strong style={{ color: 'var(--text)' }}>Embed Code</strong> (host view).
            It is scoped to this project only and will <strong style={{ color: 'var(--text)' }}>not</strong> appear
            in public meetings or other projects. Regenerate or re-copy your embed code after uploading to apply the change.
          </div>
        </div>
      </div>
    </div>
  )
}
