const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const http = require('http'); // Necesario para usar socket.io con Express
const { Server } = require('socket.io'); // Importar Socket.IO

const app = express();
const server = http.createServer(app); // Crear servidor HTTP
const io = new Server(server); // Vincular Socket.IO con el servidor HTTP

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Para servir archivos estáticos (CSS, JS, imágenes, etc.)

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitrack'
});

// Verificar conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// ** Configuración de Socket.IO **

// Mapeo para asociar usuarios con sus sockets
const users = new Map();

io.on('connection', (socket) => {
    // Obtener ID del usuario de la consulta al conectar
    const userid = socket.handshake.query.userid;
    console.log(`Usuario conectado con ID: ${userid}`);
    
    // Asociar el socket al usuario
    users.set(userid, socket);

    // Manejar desconexión del usuario
    socket.on('disconnect', () => {
        console.log(`Usuario con ID ${userid} desconectado`);
        users.delete(userid); // Eliminar usuario del mapeo
    });
});

// Función para enviar notificaciones a un usuario específico
function enviarNotificacion(userid, mensaje, idrespuesta) {
    const socket = users.get(userid);
    if (socket) {
        socket.emit('respuestanotif', { mensaje, idrespuesta });
        console.log(`Notificación enviada a usuario ${userid}`);
    } else {
        console.log(`Usuario con ID ${userid} no está conectado`);
    }
}

// Ruta de ejemplo para probar notificaciones
app.get('/notificar', (req, res) => {
    const { userid, mensaje, idrespuesta } = req.query;
    enviarNotificacion(userid, mensaje, idrespuesta);
    res.send(`Notificación enviada a usuario ${userid}`);
});

// ** Rutas existentes **

// Ruta para la página principal (perfil del usuario)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'perfilUsuario.html'));
});

// Ruta para la página del recepcionista
app.get('/recepcionista', (req, res) => {
    const query = 'SELECT * FROM solicitudes'; // Obtener todas las solicitudes desde la base de datos
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las solicitudes:', err);
            return res.status(500).send('Error al obtener las solicitudes');
        }
        // Renderizar la página de recepcionista con las solicitudes
        res.render('recepcionista', { solicitudes: results });
    });
});

// Ruta POST para cambiar el correo del usuario
app.post('/cambiarcorreo', (req, res) => {
    const { nuevoCorreo, confirmarCorreo } = req.body;
    const userId = 4; // Esto puede cambiarse por el ID del usuario actual

    connection.query('SELECT contrasenia FROM usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;

        // Comparar la contraseña ingresada con la almacenada
        bcrypt.compare(confirmarCorreo, storedPassword, (err, isMatch) => {
            if (err) return res.status(500).send('Error en el servidor');
            if (!isMatch) return res.status(400).send('Contraseña incorrecta');

            // Actualizar el correo si la contraseña es correcta
            connection.query('UPDATE usuario SET CorreoElectronico = ? WHERE IdUsuario = ?', [nuevoCorreo, userId], (error) => {
                if (error) return res.status(500).send('Error al actualizar el correo');
                res.send('Correo actualizado correctamente');
            });
        });
    });
});

// Iniciar el servidor (modificado para usar `server` en lugar de `app.listen`)
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
