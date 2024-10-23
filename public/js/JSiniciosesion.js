const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2'); // Usar el método 'promise' para async/await
const app = express();


app.use(express.json()); // Manejo de JSON
app.use(express.urlencoded({ extended: false })); // Manejo de datos codificados en URL
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

// Inicio de sesión
app.post('/login', async (req, res) => {
    const { CorreoElectronico, Contrasenia } = req.body;

    try {
        // Buscar usuario por correo
        const [results] = await pool.query('SELECT * FROM Usuario WHERE CorreoElectronico = ?', [CorreoElectronico]);

        if (results.length === 0) {
            return res.status(400).send('Correo no registrado');
        }

        const user = results[0];

        // Comparar contraseñas
        const isPasswordValid = await bcrypt.compare(Contrasenia, user.Contrasenia);
        if (!isPasswordValid) {
            return res.status(400).send('Contraseña incorrecta');
        }

        res.status(200).send('Inicio de sesión exitoso');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});
