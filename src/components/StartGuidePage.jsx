const STEPS = [
  {
    num: 1,
    title: 'Create a Project',
    desc: 'Click "New Project" in the sidebar. Give your project a name and add your website domain so only your site can use the embed.',
    code: null,
  },
  {
    num: 2,
    title: 'Get Your Embed Code',
    desc: 'Go to Overview and copy the Host Embed Code. This is a self-contained HTML snippet — paste it anywhere on your website.',
    code: `<!-- Paste this in your HTML -->
<div id="my-meeting"></div>
<script src="https://your-roomly-server/public/js/app.js"></script>
<script>
  new WebRTCMeetingAPI('#my-meeting', {
    token: 'YOUR_HOST_TOKEN_HERE',
  });
</script>`,
  },
  {
    num: 3,
    title: 'Share the Guest Link',
    desc: 'Use the Guest Embed Code for participants — it shows a simple join page without host controls. You can also copy a per-meeting share link after creating a meeting.',
    code: null,
  },
  {
    num: 4,
    title: 'Start a Meeting',
    desc: 'Open your embedded page, enter your name, and click "Start Meeting". Share the meeting link with participants.',
    code: null,
  },
  {
    num: 5,
    title: 'Record a Meeting',
    desc: 'While in a meeting, click the Record button (⏺) in the controls. When you stop, the recording is automatically uploaded and appears in your Recordings page.',
    code: null,
  },
  {
    num: 6,
    title: 'View Analytics',
    desc: 'Go to Analytics to see all past meetings, participant counts, duration, and download CSV reports. Activity shows a live event feed.',
    code: null,
  },
]

export default function StartGuidePage() {
  return (
    <div className="page-content">
      <div className="page-heading">
        <h1>Start Guide</h1>
        <p>Get up and running with RoomLy in minutes.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {STEPS.map(step => (
          <div key={step.num} className="section-card" style={{ display: 'flex', gap: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--primary-g)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>{step.num}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{step.title}</div>
              <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: step.code ? 14 : 0 }}>
                {step.desc}
              </div>
              {step.code && (
                <div className="code-block" style={{ marginBottom: 0 }}>{step.code}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(52,211,153,.06)', border: '1px solid rgba(52,211,153,.2)', borderRadius: 12, fontSize: 14, lineHeight: 1.7, color: 'var(--muted)' }}>
        <strong style={{ color: 'var(--green)' }}>Need help?</strong> Contact us at{' '}
        <strong style={{ color: 'var(--text)' }}>madaananmol124@gmail.com</strong> or call{' '}
        <strong style={{ color: 'var(--text)' }}>+91 7206053500</strong>.
      </div>
    </div>
  )
}
