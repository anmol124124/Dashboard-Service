import { useState } from 'react'
import { apiFetch } from '../api.js'

export default function CreateModal({ token, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function doCreate() {
    if (!name.trim() || !domain.trim()) {
      return setError('Project name and domain are required.')
    }
    setLoading(true); setError('')
    try {
      await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), domain: domain.trim().toLowerCase() }),
      }, token)
      onCreated()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h2>New Project</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="error-box">{error}</div>}
          <div className="form-group">
            <label>Project Name</label>
            <input type="text" placeholder="e.g. Customer Support Room" maxLength={255}
              value={name} onChange={e => setName(e.target.value)}
              autoFocus />
          </div>
          <div className="form-group">
            <label>Allowed Domain</label>
            <input type="text" placeholder="e.g. https://www.xyz.com" maxLength={255}
              value={domain} onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doCreate()} />
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={doCreate} disabled={loading}>
            {loading && <span className="spin" />}
            Create Project
          </button>
        </div>
      </div>
    </div>
  )
}
