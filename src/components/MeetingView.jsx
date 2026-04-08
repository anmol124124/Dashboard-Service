const BACKEND_URL =
  window.BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:8000'

const DASHBOARD_URL =
  window.DASHBOARD_URL ||
  import.meta.env.VITE_DASHBOARD_URL ||
  'http://localhost:5174'

export default function MeetingView({ project, onClose }) {
  // Build standalone HTML with the host token baked in directly
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="${BACKEND_URL}/public/js/app.js?ngrok-skip-browser-warning=true" defer></script>
    <style>html,body,#mc{height:100%;margin:0;padding:0;background:#000;}</style>
  </head>
  <body>
    <div id="mc"></div>
    <script>
      window.onload = function() {
        new WebRTCMeetingAPI({
          roomName:      "${project.room_name}",
          token:         "${project.host_token}",
          parentNode:    document.querySelector('#mc'),
          upgradePlanUrl: "${DASHBOARD_URL}/?upgrade=1",
        });
      };
    </script>
  </body>
</html>`

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#000',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <span style={{ color: '#e8eaed', fontWeight: 600, fontSize: 14 }}>
          {project.name} — Host View
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#e8eaed',
            borderRadius: 8,
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Leave Meeting
        </button>
      </div>

      {/* Meeting iframe */}
      <iframe
        srcDoc={html}
        style={{ flex: 1, border: 'none', width: '100%' }}
        allow="camera; microphone; display-capture"
        title="Meeting"
      />
    </div>
  )
}
