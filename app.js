const express = require('express');
const router = express.Router();
const db = require('/hospitrack.db'); // Conexión a la base de datos

// Ruta para cargar la página de recepcionista
router.get('/recepcionista', async (req, res) => {
  try {
    const solicitudes = await db.query('SELECT * FROM solicitudes'); // Obtener solicitudes desde la base de datos
    res.render('inter_recepcionista', { solicitudes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar las solicitudes');
  }
});

module.exports = router;
