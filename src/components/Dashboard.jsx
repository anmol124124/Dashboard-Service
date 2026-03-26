import { useState, useEffect, useCallback, useRef } from 'react'
import { apiFetch } from '../api.js'
import ProjectCard from './ProjectCard.jsx'
import CreateModal from './CreateModal.jsx'
import EmbedModal from './EmbedModal.jsx'
import DomainsModal from './DomainsModal.jsx'

export default function Dashboard({ user, token, onLogout }) {
  const [projects, setProjects] = useState([])
  const [createOpen, setCreateOpen] = useState(false)
  const [embedProject, setEmbedProject] = useState(null)   // { id, name, html, room_name }
  const [domainsProject, setDomainsProject] = useState(null) // { id, name }
  const [toast, setToast] = useState({ msg: '', show: false })
  const toastTimer = useRef(null)

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current)
    setToast({ msg, show: true })
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800)
  }, [])

  const loadProjects = useCallback(async () => {
    try {
      const data = await apiFetch('/projects', {}, token)
      setProjects(data)
    } catch (e) {
      showToast('Failed to load projects: ' + e.message)
    }
  }, [token, showToast])

  useEffect(() => { loadProjects() }, [loadProjects])

  async function openEmbedModal(id, name) {
    setEmbedProject({ id, name, html: null, room_name: null })
    try {
      const data = await apiFetch(`/projects/${id}/embed`, {}, token)
      setEmbedProject({ id, name, html: data.html, room_name: data.room_name })
    } catch (e) {
      showToast('Error: ' + e.message)
      setEmbedProject(null)
    }
  }

  async function deleteProject(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await apiFetch(`/projects/${id}`, { method: 'DELETE' }, token)
      showToast('Project deleted.')
      loadProjects()
    } catch (e) {
      showToast('Delete failed: ' + e.message)
    }
  }

  return (
    <>
      <div style={{ minHeight: '100vh' }}>
        <div className="topbar">
          <div className="topbar-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
            </svg>
            WebRTC Platform
          </div>
          <div className="topbar-right">
            <div className="user-badge">
              <div className="user-avatar">{user.email[0].toUpperCase()}</div>
              <span>{user.email}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>Sign Out</button>
          </div>
        </div>

        <div className="content">
          <div className="page-header">
            <div>
              <h1>My Projects</h1>
              <p>Each project generates a self-contained embed code with its own room and token.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Project
            </button>
          </div>

          <div className="projects-grid">
            {projects.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <h3>No projects yet</h3>
                <p>Create your first embeddable meeting room to get started.</p>
                <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setCreateOpen(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create your first project
                </button>
              </div>
            ) : projects.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onEmbed={() => openEmbedModal(p.id, p.name)}
                onDomains={() => setDomainsProject({ id: p.id, name: p.name })}
                onDelete={() => deleteProject(p.id, p.name)}
              />
            ))}
          </div>
        </div>
      </div>

      {createOpen && (
        <CreateModal
          token={token}
          onClose={() => setCreateOpen(false)}
          onCreated={() => { setCreateOpen(false); showToast('Project created!'); loadProjects() }}
        />
      )}

      {embedProject && (
        <EmbedModal
          project={embedProject}
          onClose={() => setEmbedProject(null)}
          onToast={showToast}
        />
      )}

      {domainsProject && (
        <DomainsModal
          project={domainsProject}
          token={token}
          onClose={() => setDomainsProject(null)}
          onToast={showToast}
        />
      )}

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
    </>
  )
}
