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
}