// backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Autoriser toutes les origines (CORS)
app.use(cors());

// 2. Autoriser Express à parser le JSON dans le corps des requêtes
app.use(express.json());

// 3. Importer et monter les routes pour /lieux
const lieuxRoutes = require('./routes/lieux');
app.use('/lieux', lieuxRoutes);

// 4. Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
