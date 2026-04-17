import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        position: 'relative',
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: enabled ? 'var(--primary)' : 'var(--border)',
        transition: 'background .2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: enabled ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  )
}

export default function AddOnsPage({ project, token, onToast }) {
  const [allowRecording, setAllowRecording] = useState(true)
  const [saving, setSaving]               = useState(false)
  const [dirty, setDirty]                 = useState(false)
  const [loaded, setLoaded]               = useState(false)

  useEffect(() => {
    setLoaded(false); setDirty(false)
    apiFetch(`/projects/${project.id}/settings`, {}, token)
      .then(d => { setAllowRecording(d.allow_recording ?? true); setLoaded(true) })
      .catch(() => { setLoaded(true) })
  }, [project.id, token])

  async function save() {
    setSaving(true)
    try {
      await apiFetch(`/projects/${project.id}/settings`, {
        method: 'PUT',
        body: JSON.stringify({ allow_recording: allowRecording }),
      }, token)
      setDirty(false)
      onToast('Add-on settings saved!')
    } catch (e) {
      onToast('Save failed: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Add-Ons</h1>
        <p>Enable or disable optional features for your meeting rooms.</p>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="section-card">
          <div className="section-card-title">Meeting Features</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.6 }}>
            Control which optional features are available to the host during meetings.
          </p>

          {/* Screen Recording row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 0',
            opacity: loaded ? 1 : 0.5, transition: 'opacity .2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: allowRecording ? 'rgba(108,99,255,.12)' : 'var(--surface2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .2s',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke={allowRecording ? 'var(--primary)' : 'var(--muted)'} strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                  Screen Recording
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                  Allows the host to record the meeting. Requires a paid plan to use in-meeting.
                </div>
              </div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <Toggle
                enabled={allowRecording}
                onChange={() => { setAllowRecording(v => !v); setDirty(true) }}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4 }}>
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={saving || !dirty}
              style={{ justifyContent: 'center', opacity: (!dirty || saving) ? 0.6 : 1 }}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
