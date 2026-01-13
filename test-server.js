const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #000;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 20px;
          border: 1px solid #333;
          border-radius: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ Test Server Working!</h1>
        <p>Si vous voyez cette page, le serveur fonctionne correctement.</p>
        <p>Le problème semble être lié à Next.js spécifiquement.</p>
      </div>
    </body>
    </html>
  `);
});

server.listen(3001, 'localhost', () => {
  console.log('Test server running at http://localhost:3001');
});
