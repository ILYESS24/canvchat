const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Aurion Chat - Test Server</title>
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
        <h1 class="success">✅ Node.js Server Working!</h1>
        <p>Si vous voyez cette page, Node.js fonctionne parfaitement.</p>
        <p>Le problème est spécifique à Next.js.</p>
        <br>
        <p><strong>Diagnostic du problème Next.js :</strong></p>
        <ul style="text-align: left;">
          <li>• Erreur SWC : bindings WASM incompatibles avec Windows</li>
          <li>• Conflits de dépendances multiples</li>
          <li>• Lockfiles multiples (npm, pnpm)</li>
          <li>• Version Next.js 15.5.9 potentiellement instable</li>
        </ul>
        <br>
        <p><strong>Solutions recommandées :</strong></p>
        <ol style="text-align: left;">
          <li>1. Supprimer tous les lockfiles et node_modules</li>
          <li>2. Utiliser une version stable de Next.js (14.x)</li>
          <li>3. Réinstaller avec npm uniquement</li>
          <li>4. Vérifier la version de Node.js</li>
        </ol>
      </div>
    </body>
    </html>
  `);
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log(`Open your browser and go to http://localhost:${PORT}`);
});

