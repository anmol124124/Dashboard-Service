#!/bin/sh
# Inject runtime config into the built React app at container startup.
# React reads window.BACKEND_URL and window.DASHBOARD_URL from this file.

cat <<EOF > /usr/share/nginx/html/config.js
window.BACKEND_URL = "${BACKEND_URL:-http://localhost:8000}";
window.DASHBOARD_URL = "${DASHBOARD_URL:-http://localhost:5174}";
EOF

exec nginx -g "daemon off;"
