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

// Registro de usuario
app.post('/register', async (req, res) => {
    const { RUT, Nombre, Apellido, CorreoElectronico, NumeroTelefono, TipoUsuario, Contrasenia } = req.body;

    // Verificar si el correo ya existe
    connection.query('SELECT * FROM Usuario WHERE CorreoElectronico = ?', [CorreoElectronico], async (err, results) => {
        if (err) return res.status(500).send('Error en el servidor');
        if (results.length > 0) return res.status(400).send('El correo ya está registrado');

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(Contrasenia, 10);

        // Insertar nuevo usuario
        connection.query('INSERT INTO Usuario (RUT, Nombre, Apellido, CorreoElectronico, NumeroTelefono, TipoUsuario, Contrasenia) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [RUT, Nombre, Apellido, CorreoElectronico, NumeroTelefono, TipoUsuario, hashedPassword], 
            (err, result) => {
                if (err) return res.status(500).send('Error al registrar el usuario');
                res.status(201).send('Usuario registrado exitosamente');
            }
        );
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});
