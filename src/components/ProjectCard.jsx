export default function ProjectCard({ project, onEmbed, onDomains, onDelete, onJoinHost }) {
  const date = new Date(project.created_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
          </svg>
        </div>
      </div>
      <div className="project-name">{project.name}</div>
      <div className="project-room" title={project.room_name}>{project.room_name}</div>
      <div className="project-date">Created {date}</div>
      <div className="project-actions">
        <button className="btn btn-primary btn-sm" onClick={onJoinHost}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
          </svg>
          Join as Host
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onEmbed}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          Embed Code
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onDomains} title="Allowed Domains">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onDelete}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
