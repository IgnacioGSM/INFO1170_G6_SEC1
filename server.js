const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la conexión a la base de datos
const bd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'Hospitrack'
});

bd.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir el formulario de agregar centro de salud
app.get('/agregar_centro_salud', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'agregar_centro_salud.html'));
});

// Ruta para manejar la adición de un nuevo centro de salud
app.post('/agregar_centro_salud', (req, res) => {
    const { nombre, latitud, longitud } = req.body;

    // Validación básica de los datos
    if (!nombre || !latitud || !longitud) {
        return res.status(400).send('Todos los campos son obligatorios.');
    }

    // Consulta SQL para insertar un nuevo centro de salud
    const query = 'INSERT INTO CentroSalud (Nombre, Latitud, Longitud) VALUES (?, ?, ?)';

    bd.query(query, [nombre, latitud, longitud], (err, result) => {
        if (err) {
            console.error('Error al agregar el centro de salud:', err);
            return res.status(500).send('Error en el servidor.');
        }

        console.log('Centro de salud agregado exitosamente con ID:', result.insertId);
        res.send('Centro de salud agregado exitosamente.');
    });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
