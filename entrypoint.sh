#!/bin/sh
# Inject BACKEND_URL into the built React app at container startup.
# React reads window.BACKEND_URL from this file (see src/api.js).

cat <<EOF > /usr/share/nginx/html/config.js
window.BACKEND_URL = "${BACKEND_URL:-http://localhost:8000}";
EOF

exec nginx -g "daemon off;"
