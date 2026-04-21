import { useState } from 'react'

const FAQS = [
  {
    category: 'Getting Started',
    q: 'How do I embed RoomLy in my website?',
    a: 'Go to your project\'s Overview page, copy the Host Embed Code, and paste it anywhere in your website\'s HTML. The snippet is fully self-contained — no additional setup or dependencies required.',
  },
  {
    category: 'Getting Started',
    q: 'What is the difference between the Host and Guest embed?',
    a: 'The Host embed gives full controls — create and manage meetings, start/stop recording, manage participants. The Guest embed is a simple join page for participants with no host-level controls. Share the Guest embed link with your audience.',
  },
  {
    category: 'Getting Started',
    q: 'How do I restrict which websites can load my embed?',
    a: 'Go to your project\'s Overview page and add your website\'s domain to the allowlist. Only pages on approved domains can load the embed. You can add or remove domains at any time.',
  },
  {
    category: 'Plans & Billing',
    q: 'What are the available plans?',
    a: 'RoomLy offers four plans: Starter (Free) with 40-minute meetings and 5 MAU/month; Basic ($9.99/mo) with 24-hour meetings; Pro ($29.99/mo) with unlimited duration, 300 participants, custom branding and analytics; and Enterprise (Custom pricing) for large-scale deployments with unlimited everything, white-label, and dedicated support.',
  },
  {
    category: 'Plans & Billing',
    q: 'How many projects can I create?',
    a: 'The Starter, Basic, and Pro plans each include 1 project. The Enterprise plan supports unlimited projects. Switch between projects using the project switcher in the sidebar.',
  },
  {
    category: 'Plans & Billing',
    q: 'What is a MAU (Monthly Active User)?',
    a: 'A Monthly Active User is a unique participant who joins at least one meeting in a given calendar month. Each person is counted once per month regardless of how many meetings they attend. Starter and Basic plans allow 5 MAU/month; Pro allows 15 MAU/month; Enterprise is unlimited.',
  },
  {
    category: 'Plans & Billing',
    q: 'What happens when I reach my MAU limit?',
    a: 'Once your monthly MAU limit is reached, new participants will be blocked from joining meetings for the rest of that month. Existing participants in ongoing meetings are not affected. Upgrade your plan to increase the limit immediately.',
  },
  {
    category: 'Plans & Billing',
    q: 'Are there meeting duration limits?',
    a: 'Yes. The Starter (free) plan limits meetings to 40 minutes. The Basic plan allows up to 24-hour meetings. The Pro and Enterprise plans have no meeting duration limit.',
  },
  {
    category: 'Recordings',
    q: 'How do I enable screen recording for my project?',
    a: 'Go to the Add-Ons page in your dashboard and toggle on "Screen Recording" for your project. Once enabled, the host will see a Record button in the meeting toolbar. Note: recording also requires a paid plan (Basic or above).',
  },
  {
    category: 'Recordings',
    q: 'How do recordings work?',
    a: 'When the host clicks the Record button, RoomLy captures the screen and audio locally in the browser. When recording is stopped, the file is automatically uploaded to cloud storage and saved to your project. You can find and download all recordings from the Recordings page in your dashboard.',
  },
  {
    category: 'Recordings',
    q: 'Where are recordings stored?',
    a: 'Recordings are stored in Google Cloud Storage and are accessible via a secure signed URL. Links are valid for an extended period and are only accessible to people with the link.',
  },
  {
    category: 'Meetings',
    q: 'How many participants can join a meeting?',
    a: 'Starter and Basic plans support up to 100 participants per meeting. The Pro plan supports up to 300 participants. The Enterprise plan supports unlimited participants.',
  },
  {
    category: 'Meetings',
    q: 'What is a Public Meeting?',
    a: 'A Public Meeting is a one-time shareable meeting created from the Public Meet page. It generates a unique link you can share with anyone — no embed code needed. Public meetings have a 40-minute limit and support up to 100 participants.',
  },
  {
    category: 'Meetings',
    q: 'How do I see who attended a meeting?',
    a: 'Go to the Analytics page and click on any meeting in the list. The detail view shows every participant\'s name, role (host/guest), join time, leave time, and total duration.',
  },
  {
    category: 'Security',
    q: 'Is my data secure?',
    a: 'Yes. All meetings use WebRTC encryption (DTLS-SRTP) for media streams. Your embed token (JWT) authenticates the host — treat it like a password and never expose it in public client-side code.',
  },
  {
    category: 'Security',
    q: 'What browsers are supported?',
    a: 'RoomLy works in all modern browsers: Chrome, Firefox, Edge, and Safari. Chrome and Edge provide the best recording support. Screen recording requires a browser that supports the MediaRecorder API (all modern browsers do).',
  },
]

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'border-color .15s',
      borderColor: open ? 'var(--border-h)' : undefined,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text)', fontSize: 14, fontWeight: 500, textAlign: 'left', gap: 12,
        }}
      >
        {faq.q}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5"
          style={{ flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7 }}>
          {faq.a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const categories = [...new Set(FAQS.map(f => f.category))]

  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>FAQ</h1>
        <p>Frequently asked questions about RoomLy.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {categories.map(cat => (
          <div key={cat}>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--primary)', marginBottom: 10,
            }}>
              {cat}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQS.filter(f => f.category === cat).map((faq, i) => (
                <FAQItem key={i} faq={faq} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
        Still have questions?{' '}
        <span style={{ color: 'var(--primary)', cursor: 'default' }}>Contact our support team →</span>
      </div>
    </div>
  )
}
