const express = require('express');
const path = require('path');
const app = express();
const db = require('/hospitrack.db'); // Tu módulo de base de datos

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para la interfaz de recepcionista
app.get('/recepcionista', async (req, res) => {
  try {
    const solicitudes = await db.query('SELECT * FROM solicitudes'); // Obtener solicitudes de la base de datos
    res.render('recepcionista', { solicitudes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar las solicitudes');
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
