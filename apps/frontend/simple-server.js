const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Servir le fichier test.html
  if (req.url === '/test.html' || req.url === '/') {
    const filePath = path.join(__dirname, 'public', 'test.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Simple test server running at http://localhost:${PORT}`);
  console.log(`Test page: http://localhost:${PORT}/test.html`);
});

