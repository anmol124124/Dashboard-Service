export default function ContactSupportPage() {
  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Contact Support</h1>
        <p>We're here to help. Reach out any time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
        {/* Phone */}
        <div className="section-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: 'rgba(108,99,255,.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 6 }}>Phone</div>
            <a href="tel:+917206053500" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', textDecoration: 'none', letterSpacing: '0.3px' }}>
              +91 7206053500
            </a>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
              Mon–Sat, 10am–6pm IST
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="section-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: 'rgba(52,211,153,.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 6 }}>Email</div>
            <a href="mailto:madaananmol124@gmail.com" style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', textDecoration: 'none', wordBreak: 'break-all' }}>
              madaananmol124@gmail.com
            </a>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
              We reply within 24 hours
            </div>
          </div>
        </div>
      </div>

      {/* Quick tips */}
      <div className="section-card">
        <div className="section-card-title">Before reaching out</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['Check the FAQ', 'Most common questions are answered in the FAQ section.'],
            ['Check the Start Guide', 'Step-by-step instructions for setting up your first meeting room.'],
            ['Include your project name', 'When contacting us, please mention your project name and the issue you\'re facing for faster resolution.'],
          ].map(([title, desc], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" style={{ marginTop: 2, flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
