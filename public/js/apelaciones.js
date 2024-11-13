
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitrack'
});


const app = express();
app.use(bodyParser.json());

// Mostrar la cantidad de solicitudes pendientes al seleccionar una sección en el mapa
app.get('/seccion/:id/pending', async (req, res) => {
  const seccionId = req.params.id;
  
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS pendingCount FROM Solicitud WHERE idseccion = ? AND estado = "pendiente"',
      [seccionId]
    );
    res.json({ pendingCount: rows[0].pendingCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las solicitudes pendientes.' });
  }
});

// Sistema de apelación de baneos
app.post('/apelar', async (req, res) => {
  const { idusuario, mensaje } = req.body;

  if (!idusuario || !mensaje) {
    return res.status(400).json({ message: 'ID de usuario y mensaje son requeridos.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO ReporteUsuario (idusuario, tiporeporte, mensaje, descripcion, fechareporte) VALUES (?, "Apelación", ?, "Apelación de baneo", NOW())',
      [idusuario, mensaje]
    );

    res.status(201).json({ message: 'Apelación registrada con éxito.', idReporte: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar la apelación.' });
  }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
