import { useState, useEffect, useCallback, useRef } from 'react'
import { apiFetch } from '../api.js'
import CreateModal from './CreateModal.jsx'
import OverviewPage from './OverviewPage.jsx'
import AnalyticsPage from './AnalyticsPage.jsx'
import ActivityPage from './ActivityPage.jsx'
import RecordingsPage from './RecordingsPage.jsx'
import ApiKeysPage from './ApiKeysPage.jsx'
import WebhooksPage from './WebhooksPage.jsx'
import ReleasesPage from './ReleasesPage.jsx'
import TeamPage from './TeamPage.jsx'
import MyPlanPage from './MyPlanPage.jsx'
import MockCheckout from './MockCheckout.jsx'
import StartGuidePage from './StartGuidePage.jsx'
import FAQPage from './FAQPage.jsx'
import ContactSupportPage from './ContactSupportPage.jsx'
import ProvisioningPage from './ProvisioningPage.jsx'

// null = separator line
const NAV_SECTIONS = [
  [
    { id: 'overview',   label: 'Overview',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: 'activity',   label: 'Activity',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { id: 'api-keys',   label: 'API Keys',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg> },
    { id: 'webhooks',   label: 'Webhooks',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>, hidden: true },
    { id: 'analytics',  label: 'Analytics',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id: 'releases',   label: 'Releases',   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
    { id: 'recordings',    label: 'Recordings',    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg> },
    { id: 'provisioning',  label: 'Provisioning',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/></svg> },
  ],
  [
    { id: 'team',     label: 'Team',     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'my-plan',  label: 'My Plan',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
  ],
  [
    { id: 'start-guide',      label: 'Start Guide',      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    { id: 'faq',              label: 'FAQ',              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { id: 'contact-support',  label: 'Contact Support',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  ],
]

export default function Dashboard({ user, token, onLogout, onPlanUpgrade }) {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [activePage, setActivePage] = useState(() => sessionStorage.getItem('dash_page') || 'overview')
  const [createOpen, setCreateOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [toast, setToast] = useState({ msg: '', show: false })
  const [checkoutPlan, setCheckoutPlan] = useState(null)
  const toastTimer = useRef(null)
  const dropdownRef = useRef(null)

  function navTo(page) { sessionStorage.setItem('dash_page', page); setActivePage(page) }

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current)
    setToast({ msg, show: true })
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800)
  }, [])

  const loadProjects = useCallback(async () => {
    try {
      const data = await apiFetch('/projects', {}, token)
      setProjects(data)
      setSelectedProject(prev => {
        if (prev) return data.find(p => p.id === prev.id) || data[0] || null
        return data[0] || null
      })
    } catch (e) {
      showToast('Failed to load projects: ' + e.message)
    }
  }, [token, showToast])

  useEffect(() => { loadProjects() }, [loadProjects])

  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function selectProject(p) { setSelectedProject(p); setDropdownOpen(false); navTo('overview') }

  const projectPages = ['overview','activity','api-keys','webhooks','analytics','releases','recordings','provisioning']
  const needsProject = projectPages.includes(activePage)
  const pageProps = { project: selectedProject, token, onToast: showToast, user }

  return (
    <div className="app-layout">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-row">
            <div className="sidebar-brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
            <div>
              <div className="sidebar-brand-name">RoomLy</div>
              <div className="sidebar-brand-tagline">Video as a Service</div>
            </div>
          </div>
        </div>

        {/* Project switcher */}
        <div className="project-switcher" ref={dropdownRef} onClick={() => setDropdownOpen(o => !o)}>
          <div className="project-avatar">{selectedProject ? selectedProject.name[0].toUpperCase() : '?'}</div>
          <div className="project-switcher-info">
            <div className="project-switcher-label">Project</div>
            <div className="project-switcher-name">{selectedProject ? selectedProject.name : 'No project'}</div>
          </div>
          <svg className={`project-switcher-chevron${dropdownOpen ? ' open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
          {dropdownOpen && (
            <div className="project-dropdown" onClick={e => e.stopPropagation()}>
              {projects.map(p => (
                <div key={p.id} className={`project-dropdown-item${selectedProject?.id === p.id ? ' active' : ''}`} onClick={() => selectProject(p)}>
                  <div className="project-avatar" style={{ width: 22, height: 22, fontSize: 10, borderRadius: 5 }}>{p.name[0].toUpperCase()}</div>
                  {p.name}
                </div>
              ))}
              {projects.length > 0 && <div className="project-dropdown-divider" />}
              {(user.plan === 'premium' || projects.length === 0) ? (
                <div className="project-dropdown-new" onClick={() => { setDropdownOpen(false); setCreateOpen(true) }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Project
                </div>
              ) : (
                <div className="project-dropdown-new" style={{ opacity: 0.5, cursor: 'not-allowed' }} onClick={() => { setDropdownOpen(false); navTo('my-plan'); showToast('Upgrade to Premium for unlimited projects'); }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Premium Only
                </div>
              )}
            </div>
          )}
        </div>

        {/* New project button — Premium can create unlimited; others get 1 */}
        {(user.plan === 'premium' || projects.length === 0) ? (
          <div style={{ padding: '6px 12px 2px' }}>
            <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setCreateOpen(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Project
            </button>
          </div>
        ) : (
          <div style={{ padding: '6px 12px 2px' }}>
            <button
              className="btn btn-sm"
              style={{ width: '100%', justifyContent: 'center', opacity: 0.5, cursor: 'not-allowed', background: 'var(--surface3)', color: 'var(--muted)', border: '1px solid var(--border)' }}
              title="Upgrade to Premium to create more projects"
              onClick={() => { navTo('my-plan'); showToast('Upgrade to Premium for unlimited projects'); }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Premium Only
            </button>
          </div>
        )}

        {/* Nav sections */}
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si}>
              {si > 0 && <div className="sidebar-sep" />}
              {section.map(item => (
                <button
                  key={item.id}
                  className={`nav-item${activePage === item.id ? ' active' : ''}`}
                  onClick={() => { navTo(item.id); if (item.id === 'overview') window.resizeTo(1512, 982); }}
                  style={item.hidden ? { display: 'none' } : undefined}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{user.email[0].toUpperCase()}</div>
            <div className="sidebar-user-email">{user.email}</div>
          </div>
          <button className="nav-item" style={{ color: 'var(--danger)' }} onClick={onLogout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="main-content">
        {needsProject && !selectedProject ? (
          <NoProjectState onCreateOpen={() => setCreateOpen(true)} />
        ) : (
          <>
            {activePage === 'overview'         && <OverviewPage        {...pageProps} />}
            {activePage === 'activity'         && <ActivityPage        {...pageProps} />}
            {activePage === 'api-keys'         && <ApiKeysPage         {...pageProps} />}
            {activePage === 'webhooks'         && <WebhooksPage        {...pageProps} />}
            {activePage === 'analytics'        && <AnalyticsPage       {...pageProps} />}
            {activePage === 'releases'         && <ReleasesPage />}
            {activePage === 'recordings'       && <RecordingsPage      {...pageProps} />}
            {activePage === 'provisioning'     && <ProvisioningPage    {...pageProps} />}
            {activePage === 'team'             && <TeamPage            {...pageProps} />}
            {activePage === 'my-plan'          && <MyPlanPage user={user} onUpgrade={(plan) => setCheckoutPlan(plan)} />}
            {activePage === 'start-guide'      && <StartGuidePage />}
            {activePage === 'faq'              && <FAQPage />}
            {activePage === 'contact-support'  && <ContactSupportPage />}
          </>
        )}
      </main>

      {createOpen && (
        <CreateModal token={token} onClose={() => setCreateOpen(false)}
          onCreated={() => { setCreateOpen(false); showToast('Project created!'); loadProjects() }} />
      )}
      {checkoutPlan && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <MockCheckout
            plan={checkoutPlan}
            token={token}
            onSuccess={(plan, email) => {
              setCheckoutPlan(null)
              onPlanUpgrade && onPlanUpgrade(plan, email)
              showToast(`Upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`)
            }}
            onCancel={() => setCheckoutPlan(null)}
          />
        </div>
      )}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
    </div>
  )
}

function NoProjectState({ onCreateOpen }) {
  return (
    <div className="page-content">
      <div className="empty-state" style={{ padding: '120px 20px' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        <h3>No projects yet</h3>
        <p>Create your first project to get an embeddable meeting room.</p>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={onCreateOpen}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Project
        </button>
      </div>
    </div>
  )
}
