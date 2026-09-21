// Tiny static server for local preview only (GitHub Pages serves the files itself). Run: node serve.js
const http = require('http'); const fs = require('fs'); const path = require('path');
const root = __dirname; const port = process.env.PORT || 4173;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); res.end(buf);
  });
}).listen(port, () => console.log('portfolio preview on http://localhost:' + port));
