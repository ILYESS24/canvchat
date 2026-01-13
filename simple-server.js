const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Aurion Chat - Simple Server</title>
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
          max-width: 600px;
        }
        .success {
          color: #4CAF50;
          font-size: 2rem;
          margin-bottom: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="success">✅ Aurion Chat Server Working!</h1>
        <p>Si vous voyez cette page, Node.js et Express fonctionnent correctement.</p>
        <p>Le problème est spécifique à Next.js et ses dépendances.</p>
        <br>
        <p><strong>Solutions possibles :</strong></p>
        <ul style="text-align: left;">
          <li>1. Réinstaller les dépendances : <code>rm -rf node_modules && npm install</code></li>
          <li>2. Vérifier la version de Node.js (recommandé : 18.x ou 20.x)</li>
          <li>3. Utiliser une version plus ancienne de Next.js</li>
          <li>4. Vérifier les conflits de dépendances</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Simple server running at http://localhost:${PORT}`);
});
