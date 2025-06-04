// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1) Autoriser toutes les origines pour CORS
app.use(cors());

// 2) Autoriser Express à parser le JSON dans le corps des requêtes
app.use(express.json());

// 3) Importer et monter les routes pour /lieux
const lieuxRoutes = require('./routes/lieux');
app.use('/lieux', lieuxRoutes);

// 4) Optionnel : route racine pour vérifier que le serveur tourne
app.get('/', (req, res) => {
  res.send('API SpotHELP (backend) est en ligne.');
});

// 5) Démarrer le serveur sur le port spécifié en .env ou 3000 par défaut
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
