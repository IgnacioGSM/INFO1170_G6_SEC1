const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  
    database: 'hospital_db' 
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos exitosa.');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Para servir archivos estáticos, como HTML y JS

// Endpoint para obtener la cantidad de hospitales por zona
app.post('/hospitalesPorZona', (req, res) => {
    const { zone } = req.body;

    const query = 'SELECT COUNT(*) AS count FROM hospitals WHERE zone = ?';
    db.query(query, [zone], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).json({ error: 'Error en el servidor' });
            return;
        }
        res.json({ count: results[0].count });
    });
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
