const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

// Filtro de hospitales en el mapa por nombre, sección o dirección
app.get('/hospitales', async (req, res) => {
  const { nombre, seccion, direccion } = req.query;
  let query = 'SELECT * FROM Hospital WHERE 1=1';
  const params = [];
  
  // Condicionales para filtrar por nombre, seccion o dirección
  if (nombre) { //verifica el nombre del usu
    query += ' AND nombre LIKE ?';
    params.push(`%${nombre}%`);
  }
  if (seccion) {
    query += ' AND idcentro IN (SELECT idcentro FROM Seccion WHERE nombreseccion LIKE ?)';
    params.push(`%${seccion}%`);
  }
  if (direccion) {
    query += ' AND direccion LIKE ?'; 
    params.push(`%${direccion}%`);
  }

  query += ' ORDER BY nombre ASC'; 

  try {
    const [results] = await db.query(query, params);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los hospitales' });
  }
});
