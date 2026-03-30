import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

function fmtSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fmtTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function RecordingsPage({ project, token }) {
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setRecordings([])
    setLoading(true)
    setError('')
    apiFetch(`/projects/${project.id}/recordings`, {}, token)
      .then(setRecordings)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [project.id, token])

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Recordings</h1>
        <p>All recordings saved during meetings in {project.name}. Click Download to save a recording.</p>
      </div>

      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      {!loading && recordings.length === 0 && !error && (
        <div className="section-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--muted)', marginBottom: 14, opacity: 0.4 }}>
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            No recordings yet. Start the host embed, begin a meeting, and click the record button to save a recording here.
          </p>
        </div>
      )}

      {recordings.length > 0 && (
        <div className="section-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="rec-table">
            <thead>
              <tr>
                <th style={{ padding: '14px 20px' }}>Room</th>
                <th style={{ padding: '14px 12px' }}>Date</th>
                <th style={{ padding: '14px 12px' }}>Size</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map(r => (
                <tr key={r.id}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>{r.room_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', opacity: 0.6 }}>{r.filename}</div>
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--muted)', whiteSpace: 'nowrap', fontSize: 13 }}>
                    {fmtTime(r.created_at)}
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--muted)', fontSize: 13 }}>
                    {fmtSize(r.file_size)}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <a
                      href={r.url}
                      download
                      className="btn btn-ghost btn-sm"
                      style={{ textDecoration: 'none' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
