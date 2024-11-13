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

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
  });
  
  app.get ("/recepcionista/solicitudes",async(req,res)=>{
      try{
      const [rows] = await db.query(`
              SELECT idseccion, COUNT(*) AS totalSolicitudes,
                     SUM(CASE WHEN estado = "pendiente" THEN 1 ELSE 0 END) AS pendientes,
                     SUM(CASE WHEN estado = "procesada" THEN 1 ELSE 0 END) AS procesadas
              FROM Solicitud
              GROUP BY idseccion
            `);
      res.json(rows);
                catch (error){
              console.error(error);
              res.status(500).json({message:"Error al obtener informacion de los hospitales"})
          }
      }
  })