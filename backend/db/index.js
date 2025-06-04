// backend/db/index.js

const { Pool } = require('pg');
require('dotenv').config();

// Initialise le pool PostgreSQL en se basant sur les variables .env
const pool = new Pool();

module.exports = {
  // On expose une méthode .query(text, params) => pool.query(text, params)
  query: (text, params) => pool.query(text, params),
  // Optionnel : on peut aussi exposer directement le pool si besoin plus tard
  pool,
};
