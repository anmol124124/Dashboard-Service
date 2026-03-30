import { useState } from 'react'

const FAQS = [
  {
    q: 'What is a MAU (Monthly Active User)?',
    a: 'A Monthly Active User is counted as one participant session in a meeting during the month. If the same person joins 3 different meetings, that counts as 3 sessions. The Free plan includes 100 sessions per month.',
  },
  {
    q: 'How do I embed RoomLy in my website?',
    a: 'Go to your project\'s Overview page, copy the Host Embed Code, and paste it into your website\'s HTML. The snippet is self-contained and works without any additional setup.',
  },
  {
    q: 'What is the difference between the Host and Guest embed?',
    a: 'The Host embed shows full controls — create meetings, see previous meetings, start/stop recording. The Guest embed is a simple join page for participants without any host controls.',
  },
  {
    q: 'How do recordings work?',
    a: 'When you click the Record button during a meeting, RoomLy captures your screen and audio. When you stop recording, the file is automatically uploaded to your dashboard. Go to the Recordings page to download it.',
  },
  {
    q: 'How do I restrict who can embed my meeting room?',
    a: 'When creating a project, add your website\'s domain to the allowlist. Only pages on that domain will be able to load the embed. You can add or remove domains from the Overview page.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All meetings use WebRTC encryption (DTLS-SRTP) end-to-end. Your embed token (JWT) should be kept secret — treat it like a password and never expose it in public client-side code without proper security measures.',
  },
  {
    q: 'Can I have multiple projects?',
    a: 'Yes, you can create unlimited projects on the Free plan. Each project has its own room, embed code, and token. Switch between projects using the project switcher in the sidebar.',
  },
  {
    q: 'What browsers are supported?',
    a: 'RoomLy works in all modern browsers: Chrome, Firefox, Edge, and Safari. Chrome and Edge offer the best recording support. Screen recording requires a browser that supports the MediaRecorder API.',
  },
  {
    q: 'How do I see who attended a meeting?',
    a: 'Go to Analytics, click on any meeting in the list to see the detail view — it shows every participant\'s name, role, join time, and leave time.',
  },
  {
    q: 'What happens when I reach my MAU limit?',
    a: 'On the Free plan, the meeting embed will continue to work but new sessions may be throttled. Upgrade options with higher limits will be available soon.',
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
  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>FAQ</h1>
        <p>Frequently asked questions about RoomLy.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
        Still have questions?{' '}
        <span style={{ color: 'var(--primary)', cursor: 'default' }}>Contact our support team →</span>
      </div>
    </div>
  )
}
