// backend/routes/lieux.js
const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM lieux');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

router.post('/', async (req, res) => {
    const { nom, type, adresse, lat, lng } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO lieux (nom, type, adresse, lat, lng) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nom, type, adresse, lat, lng]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  // PUT update d’un lieu
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, type, adresse, lat, lng } = req.body;
    try {
      const result = await db.query(
        `UPDATE lieux
         SET nom = $1, type = $2, adresse = $3, lat = $4, lng = $5
         WHERE id = $6
         RETURNING *`,
        [nom, type, adresse, lat, lng, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lieu non trouvé' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE suppression d’un lieu
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query(
        'DELETE FROM lieux WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Lieu non trouvé' });
      }
      res.json({ message: 'Lieu supprimé', lieu: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  