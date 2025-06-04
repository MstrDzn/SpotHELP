// backend/routes/lieux.js

const express = require('express');
const db = require('../db');      // notre module db/index.js
const router = express.Router();

// ──────────────────────────────────────────────────────────────────────────────
// 1) GET /lieux  → Récupérer tous les lieux
// ──────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // On trie par id pour garder un ordre cohérent
    const result = await db.query('SELECT * FROM lieux ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur GET /lieux →', err);
    res.status(500).json({ error: 'Impossible de récupérer la liste des lieux.' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// 2) POST /lieux  → Créer un nouveau lieu
// ──────────────────────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { nom, type, adresse, lat, lng } = req.body;

  // Vérification minimale des champs obligatoires
  if (!nom || !type || !adresse || lat == null || lng == null) {
    return res.status(400).json({
      error: 'Les champs "nom", "type", "adresse", "lat" et "lng" sont obligatoires.',
    });
  }

  try {
    const insertQuery = `
      INSERT INTO lieux (nom, type, adresse, lat, lng)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nom, type, adresse, lat, lng];
    const result = await db.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur POST /lieux →', err);
    res.status(500).json({ error: 'Impossible de créer le lieu.' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// 3) PUT /lieux/:id  → Mettre à jour un lieu existant
// ──────────────────────────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, type, adresse, lat, lng } = req.body;

  // On vérifie les champs obligatoires
  if (!nom || !type || !adresse || lat == null || lng == null) {
    return res.status(400).json({
      error: 'Les champs "nom", "type", "adresse", "lat" et "lng" sont obligatoires.',
    });
  }

  try {
    // 3.1. Vérifier que le lieu existe
    const checkQuery = 'SELECT id FROM lieux WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: `Lieu avec id=${id} non trouvé.` });
    }

    // 3.2. Mettre à jour
    const updateQuery = `
      UPDATE lieux
      SET nom = $1,
          type = $2,
          adresse = $3,
          lat = $4,
          lng = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [nom, type, adresse, lat, lng, id];
    const result = await db.query(updateQuery, values);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Erreur PUT /lieux/${id} →`, err);
    res.status(500).json({ error: 'Impossible de mettre à jour le lieu.' });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// 4) DELETE /lieux/:id  → Supprimer un lieu existant
// ──────────────────────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 4.1. Vérifier que le lieu existe
    const checkQuery = 'SELECT id FROM lieux WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: `Lieu avec id=${id} non trouvé.` });
    }

    // 4.2. Supprimer
    const deleteQuery = 'DELETE FROM lieux WHERE id = $1 RETURNING *;';
    const result = await db.query(deleteQuery, [id]);

    res.json({
      message: 'Lieu supprimé avec succès.',
      lieu: result.rows[0], // on renvoie l’objet supprimé si besoin
    });
  } catch (err) {
    console.error(`Erreur DELETE /lieux/${id} →`, err);
    res.status(500).json({ error: 'Impossible de supprimer le lieu.' });
  }
});

module.exports = router;
