import { useState, useRef, useEffect } from 'react'
import { API_BASE, apiFetch } from '../api.js'

const DEFAULT_COLOR   = '#6c63ff'
const DEFAULT_LABEL   = 'Join Meeting'
const DEFAULT_WELCOME = 'Welcome! You are about to join a meeting.'

export default function ProvisioningPage({ project, token, onToast }) {
  // ── Logo state ───────────────────────────────────────────────────────────────
  const [logoUrl,   setLogoUrl]   = useState(null)
  const [logoLoading, setLogoLoading] = useState(false)
  const [dragging,  setDragging]  = useState(false)
  const fileInputRef = useRef(null)

  // ── Branding state ───────────────────────────────────────────────────────────
  const [color,   setColor]   = useState(DEFAULT_COLOR)
  const [label,   setLabel]   = useState(DEFAULT_LABEL)
  const [welcome, setWelcome] = useState(DEFAULT_WELCOME)
  const [theme,   setTheme]   = useState(null)   // null | 'dark' | 'light'
  const [saving,  setSaving]  = useState(false)
  const [dirty,   setDirty]   = useState(false)

  // ── Load existing branding ───────────────────────────────────────────────────
  useEffect(() => {
    apiFetch(`/projects/${project.id}/branding`, {}, token)
      .then(d => {
        if (d.logo_url)        setLogoUrl(d.logo_url)
        if (d.primary_color)   setColor(d.primary_color)
        if (d.button_label)    setLabel(d.button_label)
        if (d.welcome_message) setWelcome(d.welcome_message)
        if (d.theme)           setTheme(d.theme)
      })
      .catch(() => {})
  }, [project.id, token])

  function markDirty() { setDirty(true) }

  // ── Logo upload ──────────────────────────────────────────────────────────────
  async function uploadFile(file) {
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) { onToast('Only PNG, JPG, GIF, WebP, or SVG allowed.'); return }
    if (file.size > 3 * 1024 * 1024) { onToast('Logo must be under 3 MB.'); return }
    setLogoLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_BASE}/projects/${project.id}/logo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.detail || 'Upload failed') }
      const data = await res.json()
      setLogoUrl(data.logo_url + '?t=' + Date.now())
      onToast('Logo uploaded!')
    } catch (e) {
      onToast('Upload failed: ' + e.message)
    } finally {
      setLogoLoading(false)
    }
  }

  async function removeLogo() {
    setLogoLoading(true)
    try {
      await fetch(`${API_BASE}/projects/${project.id}/logo`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      setLogoUrl(null)
      onToast('Logo removed.')
    } catch {
      onToast('Failed to remove logo.')
    } finally {
      setLogoLoading(false)
    }
  }

  // ── Save branding ────────────────────────────────────────────────────────────
  async function saveBranding() {
    setSaving(true)
    try {
      await apiFetch(`/projects/${project.id}/branding`, {
        method: 'PUT',
        body: JSON.stringify({ primary_color: color, button_label: label, welcome_message: welcome, theme }),
      }, token)
      setDirty(false)
      onToast('Branding saved!')
    } catch (e) {
      onToast('Save failed: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  function resetDefaults() {
    setColor(DEFAULT_COLOR); setLabel(DEFAULT_LABEL); setWelcome(DEFAULT_WELCOME); setTheme(null)
    setDirty(true)
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Provisioning</h1>
        <p>Customize how your embed widget looks to guests joining from this project.</p>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ── Left: Controls ────────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Logo */}
          <div className="section-card">
            <div className="section-card-title">Meeting Logo</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
              Appears in the top-left corner of every meeting. PNG, JPG, GIF, WebP, SVG — max 3 MB.
            </p>
            <div
              style={{
                border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 10, padding: '28px 20px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                background: dragging ? 'rgba(108,99,255,.06)' : 'var(--surface2)',
                cursor: logoLoading ? 'default' : 'pointer',
                transition: 'border-color .2s, background .2s',
              }}
              onClick={() => !logoLoading && fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f) }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <path d="M3 9l4-4 4 4M7 5v10M14 15l3 3 3-3M17 18V8"/>
              </svg>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                {logoLoading ? 'Uploading…' : 'Click or drag & drop'}
              </div>
              <input ref={fileInputRef} type="file"
                accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = '' }}
              />
            </div>
            {logoUrl && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 10, color: 'var(--danger)', borderColor: 'var(--danger)', opacity: logoLoading ? 0.5 : 1 }}
                disabled={logoLoading}
                onClick={removeLogo}
              >
                Remove Logo
              </button>
            )}
          </div>

          {/* Primary Color */}
          <div className="section-card">
            <div className="section-card-title">Primary Color</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
              Used for the join button and accent elements.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="color"
                value={color}
                onChange={e => { setColor(e.target.value); markDirty() }}
                style={{
                  width: 48, height: 40, borderRadius: 8, border: '1px solid var(--border)',
                  cursor: 'pointer', padding: 2, background: 'var(--surface)',
                }}
              />
              <input
                type="text"
                value={color}
                onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) { setColor(e.target.value); markDirty() } }}
                style={{
                  flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--text)',
                  outline: 'none', fontFamily: 'monospace',
                }}
              />
              {/* Quick presets */}
              <div style={{ display: 'flex', gap: 6 }}>
                {['#6c63ff','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899'].map(c => (
                  <button key={c} onClick={() => { setColor(c); markDirty() }}
                    title={c}
                    style={{
                      width: 24, height: 24, borderRadius: '50%', background: c,
                      border: color === c ? '2px solid #1a202c' : '2px solid transparent',
                      cursor: 'pointer', padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Button Label */}
          <div className="section-card">
            <div className="section-card-title">Join Button Label</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
              Text shown on the join button guests see before entering.
            </p>
            <input
              type="text"
              value={label}
              maxLength={100}
              placeholder="Join Meeting"
              onChange={e => { setLabel(e.target.value); markDirty() }}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '9px 12px', fontSize: 13,
                color: 'var(--text)', outline: 'none',
              }}
            />
          </div>

          {/* Welcome Message */}
          <div className="section-card">
            <div className="section-card-title">Welcome Message</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
              Shown to guests on the pre-join screen.
            </p>
            <textarea
              value={welcome}
              maxLength={500}
              rows={3}
              placeholder="Welcome! You are about to join a meeting."
              onChange={e => { setWelcome(e.target.value); markDirty() }}
              style={{
                width: '100%', boxSizing: 'border-box', resize: 'vertical',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '9px 12px', fontSize: 13,
                color: 'var(--text)', outline: 'none', fontFamily: 'inherit',
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, textAlign: 'right' }}>
              {welcome.length}/500
            </div>
          </div>

          {/* Meeting Theme */}
          <div className="section-card">
            <div className="section-card-title">Meeting Theme</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
              Controls the appearance of the meeting room for all participants.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { value: 'dark',  label: 'Dark',  icon: '🌙' },
                { value: 'light', label: 'Light', icon: '☀️'  },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setTheme(theme === opt.value ? null : opt.value); markDirty() }}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                    border: theme === opt.value ? '2px solid var(--primary)' : '2px solid var(--border)',
                    background: theme === opt.value ? 'rgba(108,99,255,.1)' : 'var(--surface2)',
                    color: theme === opt.value ? 'var(--primary)' : 'var(--muted)',
                    fontWeight: theme === opt.value ? 700 : 500,
                    fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all .15s',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            {theme && (
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                Click the selected option again to revert to default.
              </p>
            )}
          </div>

          {/* Save / Reset */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-primary"
              onClick={saveBranding}
              disabled={saving || !dirty}
              style={{ flex: 1, justifyContent: 'center', opacity: (!dirty || saving) ? 0.6 : 1 }}
            >
              {saving ? 'Saving…' : 'Save Branding'}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={resetDefaults}
              style={{ whiteSpace: 'nowrap' }}
            >
              Reset Defaults
            </button>
          </div>
        </div>

        {/* ── Right: Live Preview ───────────────────────────────────────── */}
        <div style={{ width: 320, flexShrink: 0 }}>
          <div style={{
            position: 'sticky', top: 24,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
          }}>
            {/* Preview label */}
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid var(--border)',
              fontSize: 11, fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: 0.5,
              background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Live Preview
            </div>

            {/* Simulated embed widget */}
            <div style={{ background: theme === 'light' ? '#f1f3f4' : '#0f1117', padding: 0 }}>

              {/* Top bar */}
              <div style={{
                background: theme === 'light' ? '#ffffff' : '#1a1d28', padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: theme === 'light' ? '1px solid rgba(0,0,0,.08)' : '1px solid rgba(255,255,255,.08)',
              }}>
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" style={{ height: 28, maxWidth: 100, objectFit: 'contain', borderRadius: 3 }} />
                ) : (
                  <div style={{
                    height: 28, width: 28, borderRadius: 6,
                    background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, color: '#fff',
                  }}>
                    {project.name[0].toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: 13, fontWeight: 700, color: theme === 'light' ? '#202124' : '#fff' }}>{project.name}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                </div>
              </div>

              {/* Pre-join area */}
              <div style={{
                padding: '32px 24px 28px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 18, textAlign: 'center',
              }}>
                {/* Avatar placeholder */}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: '#1e2230', border: '2px solid rgba(255,255,255,.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>

                {/* Welcome message */}
                <p style={{
                  fontSize: 13, color: theme === 'light' ? 'rgba(0,0,0,.6)' : 'rgba(255,255,255,.65)', lineHeight: 1.6,
                  margin: 0, maxWidth: 220,
                }}>
                  {welcome || DEFAULT_WELCOME}
                </p>

                {/* Name input mockup */}
                <div style={{
                  width: '100%', background: theme === 'light' ? '#f1f3f4' : '#1e2230',
                  border: theme === 'light' ? '1px solid rgba(0,0,0,.12)' : '1px solid rgba(255,255,255,.12)',
                  borderRadius: 8, padding: '9px 12px',
                  fontSize: 13, color: theme === 'light' ? 'rgba(0,0,0,.35)' : 'rgba(255,255,255,.3)',
                  textAlign: 'left',
                }}>
                  Your name…
                </div>

                {/* Join button */}
                <button style={{
                  width: '100%', padding: '11px 0',
                  background: color, border: 'none', borderRadius: 9,
                  fontSize: 14, fontWeight: 700, color: '#fff',
                  cursor: 'default', letterSpacing: 0.3,
                  boxShadow: `0 4px 14px ${color}55`,
                }}>
                  {label || DEFAULT_LABEL}
                </button>

                {/* Powered by */}
                <div style={{ fontSize: 10, color: theme === 'light' ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.2)', marginTop: -4 }}>
                  Powered by RoomLy
                </div>
              </div>
            </div>

            {/* Note */}
            <div style={{ padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                This preview simulates the guest pre-join screen. Changes apply after saving.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
