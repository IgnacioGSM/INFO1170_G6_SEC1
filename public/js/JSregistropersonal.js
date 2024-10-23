const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise'); // Usar promesas para async/await
const path = require('path');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

// Pool de conexiones para mejorar eficiencia
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitrack',
    waitForConnections: true,
    connectionLimit: 10, // Limitar el número de conexiones
    queueLimit: 0
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Registro de usuario
app.post('/register', async (req, res) => {
    const { RUT, Nombre, CorreoElectronico, Contrasenia } = req.body;

    try {
        // Verificar si el correo ya existe
        const [existingUsers] = await pool.query('SELECT * FROM usuario WHERE CorreoElectronico = ?', [CorreoElectronico]);
        if (existingUsers.length > 0) {
            return res.status(400).send('El correo ya está registrado');
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(Contrasenia, 10);

        // Insertar nuevo usuario
        await pool.query('INSERT INTO usuario (RUT, Nombre, CorreoElectronico, Contrasenia) VALUES (?, ?, ?, ?)', 
            [RUT, Nombre, CorreoElectronico, hashedPassword]);

        // Redirigir a la página de éxito
        res.redirect('/index.html');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});


app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000: http://localhost:3000');
});
