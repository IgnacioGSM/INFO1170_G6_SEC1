// Importar módulos necesarios
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

// Crear una aplicación Express
const app = express();

// Configuración de body-parser para manejar solicitudes POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Conexión a la base de datos MySQL
const bd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Hospitrack'
});

// Verificar la conexión a la base de datos
bd.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para la página principal del panel del administrador
app.get('/', (req, res) => {
    bd.query('SELECT * FROM hospitales', (err, hospitales) => {
        if (err) {
            console.error('Error obteniendo hospitales:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.render('admin', { hospitales });
        }
    });
});

// Ruta para mostrar el formulario de agregar hospital
app.get('/agregar_hospital', (req, res) => {
    res.render('agregar_hospital', { error: null, success: null });
});

// Ruta para manejar el formulario de agregar hospital
app.post('/agregar_hospital', (req, res) => {
    const { id, nombre, latitud, longitud } = req.body;

    if (!id || !nombre || !latitud || !longitud) {
        return res.render('agregar_hospital', {
            error: 'Todos los campos son obligatorios.',
            success: null
        });
    }

    const query = 'INSERT INTO hospitales (id, nombre, latitud, longitud) VALUES (?, ?, ?, ?)';
    bd.query(query, [id, nombre, latitud, longitud], (err) => {
        if (err) {
            console.error('Error insertando hospital:', err);
            return res.render('agregar_hospital', {
                error: 'Hubo un error al agregar el hospital.',
                success: null
            });
        }
        res.render('agregar_hospital', {
            error: null,
            success: 'Hospital agregado exitosamente.'
        });
    });
});

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Escuchar en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
