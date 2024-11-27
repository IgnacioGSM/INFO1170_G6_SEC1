const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los centros de salud
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CentroSalud');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un nuevo centro de salud
router.post('/', async (req, res) => {
  const { latitud, longitud, nombre } = req.body;
  try {
    const [result] = await db.query('INSERT INTO CentroSalud (latitud, longitud, nombre) VALUES (?, ?, ?)', [latitud, longitud, nombre]);
    res.json({ id: result.insertId, message: 'Centro de salud agregado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un centro de salud
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { latitud, longitud, nombre } = req.body;
  try {
    await db.query('UPDATE CentroSalud SET latitud = ?, longitud = ?, nombre = ? WHERE idcentro = ?', [latitud, longitud, nombre, id]);
    res.json({ message: 'Centro de salud actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un centro de salud
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM CentroSalud WHERE idcentro = ?', [id]);
    res.json({ message: 'Centro de salud eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
