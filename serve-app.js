const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, 'frontend', 'dist');
const indexHtml = path.join(distDir, 'index.html');

// 1. Guarantee production build exists
if (!fs.existsSync(indexHtml)) {
  console.log('==> [SkillMap AI] Production build not found. Building frontend now...');
  try {
    execSync('npm --prefix frontend install && npm --prefix frontend run build', { stdio: 'inherit' });
    console.log('==> [SkillMap AI] Build completed successfully.');
  } catch (err) {
    console.error('==> [SkillMap AI] Build failed:', err);
    process.exit(1);
  }
}

// 2. MIME Types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json'
};

// 3. Robust Native HTTP Server (Zero Dependencies, Render & Cloud Optimized)
const port = parseInt(process.env.PORT, 10) || 3000;
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // Handle Render & Cloud Health Checks
  if (req.method === 'HEAD' && (pathname === '/' || pathname === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end();
    return;
  }

  // Prevent directory traversal
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  let filePath = path.join(distDir, safePath);

  // If path doesn't exist or is a directory, fallback to index.html (SPA client routing)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = indexHtml;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`==> [SkillMap AI] Production Web Server listening on port ${port} (0.0.0.0:${port})`);
});
