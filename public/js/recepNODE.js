const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Configuración para EJS
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Cambia para servir los archivos estáticos como CSS y JS

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitrack'
});

// Ruta para la página principal de perfil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'perfilUsuario.html'));
});

// Ruta para la página del recepcionista
app.get('/recepcionista', (req, res) => {
    const query = 'SELECT * FROM solicitudes'; // Consulta para obtener las solicitudes
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener las solicitudes');
        }
        // Renderizamos la vista EJS 'recepcionista' y le pasamos las solicitudes
        res.render('recepcionista', { solicitudes: results });
    });
});

// Ruta POST para cambiar correo (misma que tu compañero)
app.post('/cambiarcorreo', (req, res) => {
    const { nuevoCorreo, confirmarCorreo } = req.body;
    const userId = 4; // Ejemplo: cambiar con lógica que obtenga el ID del usuario autenticado

    connection.query('SELECT contrasenia FROM usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;

        bcrypt.compare(confirmarCorreo, storedPassword, (err, isMatch) => {
            if (err) return res.status(500).send('Error en el servidor');
            if (!isMatch) return res.status(400).send('Contraseña incorrecta');

            connection.query('UPDATE usuarios SET CorreoElectronico = ? WHERE IdUsuario = ?', [nuevoCorreo, userId], (error) => {
                if (error) return res.status(500).send('Error al actualizar el correo');
                res.send('Correo actualizado');
            });
        });
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
