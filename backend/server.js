// backend/server.js
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Import des routes
const lieuxRoutes = require('./routes/lieux');
app.use('/lieux', lieuxRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
