const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');

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

// Configuración de sesiones para manejar el `user`
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Asegúrate de configurar esto correctamente en producción (secure: true si usas HTTPS)
}));

// Simular un middleware de autenticación para asignar un usuario
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = { id: 1, nombre: 'Admin' }; // Simulación de un usuario autenticado
    }
    next();
});

// Ruta para la página principal que redirige al panel de administración
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// Ruta para el panel de administrador
app.get('/admin', (req, res) => {
    db.query('SELECT * FROM hospitales', (err, hospitales) => {
        if (err) {
            return res.status(500).send('Error en la consulta');
        }
        res.render('admin', { hospitales, user: req.session.user });
    });
});

// Ruta para agregar un hospital
app.get('/agregar_hospital', (req, res) => {
    res.render('agregar_hospital', { error: null, success: null, user: req.session.user });
});

app.post('/agregar_hospital', (req, res) => {
    const { id, nombre, latitud, longitud } = req.body;
    const query = 'INSERT INTO hospitales (id, nombre, latitud, longitud) VALUES (?, ?, ?, ?)';
    const values = [id, nombre, latitud, longitud];

    db.query(query, values, (error) => {
        if (error) {
            return res.render('agregar_hospital', { error: 'Error al agregar el hospital.', success: null, user: req.session.user });
        }
        res.render('agregar_hospital', { success: 'Hospital agregado correctamente.', error: null, user: req.session.user });
    });
});

// Ruta para editar un hospital (formulario)
app.get('/editar_hospital/:id', (req, res) => {
    const hospitalId = req.params.id;
    const query = 'SELECT * FROM hospitales WHERE id = ?';

    db.query(query, [hospitalId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send('Hospital no encontrado');
        }
        res.render('editar_hospital', { hospital: results[0], error: null, success: null, user: req.session.user });
    });
});

// Ruta para actualizar un hospital
app.post('/editar_hospital/:id', (req, res) => {
    const hospitalId = req.params.id;
    const { nombre, latitud, longitud } = req.body;
    const query = 'UPDATE hospitales SET nombre = ?, latitud = ?, longitud = ? WHERE id = ?';

    db.query(query, [nombre, latitud, longitud, hospitalId], (error) => {
        if (error) {
            return res.render('editar_hospital', { hospital: { id: hospitalId, nombre, latitud, longitud }, error: 'Error al actualizar el hospital.', success: null, user: req.session.user });
        }
        res.render('editar_hospital', { hospital: { id: hospitalId, nombre, latitud, longitud }, success: 'Hospital actualizado correctamente.', error: null, user: req.session.user });
    });
});

// Ruta para eliminar un hospital
app.post('/eliminar_hospital/:id', (req, res) => {
    const hospitalId = req.params.id;
    const query = 'DELETE FROM hospitales WHERE id = ?';

    db.query(query, [hospitalId], (error) => {
        if (error) {
            return res.status(500).send('Error al eliminar el hospital');
        }
        res.redirect('/admin');
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
