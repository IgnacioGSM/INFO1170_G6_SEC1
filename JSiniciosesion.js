const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Hospitrack'
});

// Inicio de sesión
app.post('/login', (req, res) => {
    const { CorreoElectronico, Contrasenia } = req.body;

    // Buscar usuario por correo
    connection.query('SELECT * FROM Usuario WHERE CorreoElectronico = ?', [CorreoElectronico], async (err, results) => {
        if (err) return res.status(500).send('Error en el servidor');
        if (results.length === 0) return res.status(400).send('Correo no registrado');

        const user = results[0];

        // Comparar contraseñas
        const isPasswordValid = await bcrypt.compare(Contrasenia, user.Contrasenia);
        if (!isPasswordValid) return res.status(400).send('Contraseña incorrecta');

        res.status(200).send('Inicio de sesión exitoso');
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});
