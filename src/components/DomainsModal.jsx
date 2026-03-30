import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

export default function DomainsModal({ project, token, onClose, onToast }) {
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [newDomain, setNewDomain] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => { loadDomains() }, [])

  async function loadDomains() {
    setLoading(true)
    try {
      const data = await apiFetch(`/projects/${project.id}/domains`, {}, token)
      setDomains(data)
    } catch (e) {
      onToast('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function doAdd() {
    if (!newDomain.trim()) return
    setAdding(true)
    try {
      await apiFetch(`/projects/${project.id}/domains`, {
        method: 'POST',
        body: JSON.stringify({ domain: newDomain.trim().toLowerCase() }),
      }, token)
      setNewDomain('')
      await loadDomains()
      onToast('Domain added.')
    } catch (e) {
      onToast('Error: ' + e.message)
    } finally {
      setAdding(false)
    }
  }

  async function doDelete(domainId) {
    try {
      await apiFetch(`/projects/${project.id}/domains/${domainId}`, { method: 'DELETE' }, token)
      setDomains(prev => prev.filter(d => d.id !== domainId))
      onToast('Domain removed.')
    } catch (e) {
      onToast('Error: ' + e.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <h2>Allowed Domains — {project.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
            Only these domains may host your embed HTML. If the list is empty, all requests are blocked.
          </p>
          <div className="domain-list">
            {loading ? (
              <div className="domain-empty">Loading…</div>
            ) : domains.length === 0 ? (
              <div className="domain-empty">No domains added — all requests are blocked.</div>
            ) : domains.map(d => (
              <div key={d.id} className="domain-item">
                <span className="domain-item-host">{d.domain}</span>
                <button className="btn btn-danger btn-sm" onClick={() => doDelete(d.id)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="domain-add-row">
            <input
              type="text"
              placeholder="https://www.example.com"
              maxLength={255}
              value={newDomain}
              onChange={e => setNewDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doAdd()}
              autoFocus
            />
            <button className="btn btn-primary btn-sm" onClick={doAdd} disabled={adding}>Add</button>
          </div>
          <p className="domain-hint">
            Enter full URL or hostname, e.g. <code style={{ color: 'var(--text)' }}>https://www.example.com</code>
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}
