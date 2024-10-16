const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitrack'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL.');
});

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta para la raíz que redirige a la página de administración
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// Ruta para el panel de administrador
app.get('/admin', (req, res) => {
    db.query('SELECT * FROM hospitales', (err, hospitales) => {
        if (err) {
            return res.status(500).send('Error en la consulta');
        }
        res.render('admin', { hospitales });
    });
});

// Ruta para agregar un hospital
app.get('/agregar_hospital', (req, res) => {
    res.render('agregar_hospital', { error: null, success: null });
});

app.post('/Agregar_hospital', (req, res) => {
    const { id, nombre, latitud, longitud } = req.body;

    const query = 'INSERT INTO hospitales (id, nombre, latitud, longitud) VALUES (?, ?, ?, ?)';
    const values = [id, nombre, latitud, longitud];

    db.query(query, values, (error, results) => {
        if (error) {
            return res.render('agregar_hospital', { error: 'Error al agregar el hospital.', success: null });
        }
        res.render('agregar_hospital', { success: 'Hospital agregado correctamente.', error: null });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
