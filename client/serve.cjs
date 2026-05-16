const express = require('express');
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const indexHtml = path.join(distPath, 'index.html');

if (!fs.existsSync(indexHtml)) {
  console.error('Build missing: dist/index.html not found. Run: npm run build');
  process.exit(1);
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use(express.static(distPath, { index: false }));

app.get('*', (_req, res) => {
  res.sendFile(indexHtml);
});

const server = app.listen(PORT, HOST, () => {
  console.log(`TeamTask server listening on http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
