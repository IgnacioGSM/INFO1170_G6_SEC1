const express = require('express');
//const bodyParser = require('body-parser'); ya no se usa, express tiene su propio body parser
const bcrypt = require('bcrypt');
const http = require('http');
const path = require('path');
const session = require('express-session');
const { Server } = require('socket.io');
const socketconf = require('./socketconf');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

socketconf(io);

// La conexión a la base de datos se encuentra en database.js
const db = require('./database');

// Configuraciones de la app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'clave-super-secreta',
  resave: false,
  saveUninitialized: false,
  cookie : { maxAge: 1200000 }
}));

// Archivos estaticos
app.use(express.static(path.join(__dirname,'public')));

// Configuración de la plantilla
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta principal
const indexRouter = require('./rutas/index');
app.use('/', indexRouter);


// Ruta Mis Solicitudes
const misSolicitudesRouter = require('./rutas/missolicitudes.js');
app.use('/mis_solicitudes', misSolicitudesRouter);


// Ruta inicio de sesión
const loginRouter = require('./rutas/login');
app.use('/login', loginRouter);


// Ruta registro
const registroRouter = require('./rutas/registro');
app.use('/registro', registroRouter);

// Ruta admin
const adminRouter = require('./rutas/admin');
app.use('/admin', adminRouter);

// Ruta perfil
const perfilRouter = require('./rutas/perfil');
app.use('/perfilUsuario', perfilRouter);

// Ruta recepcionista
const recepcionistaRouter = require('./rutas/recepcionista');
const exp = require('constants');
app.use('/recepcionista', recepcionistaRouter);


// Cambiar contraseña (olvidé mi contraseña)
app.post('/forgot-password', async (req, res) => {
  const { CorreoElectronico, NuevaContrasenia } = req.body;
  // Verificar si el correo existe
  db.query('SELECT * FROM Usuario WHERE correoelectronico = ?', [CorreoElectronico], async (err, results) => {
      if (err) return res.status(500).send('Error en el servidor');
      if (results.length === 0) return res.status(400).send('Correo no encontrado');
      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(NuevaContrasenia, 10);
      // Actualizar contraseña
      db.query('UPDATE Usuario SET contrasenia = ? WHERE correoelectronico = ?', [hashedPassword, CorreoElectronico], (err, result) => {
          if (err) return res.status(500).send('Error al actualizar la contraseña');
          res.status(200).send('Contraseña actualizada exitosamente');
      });
  });
});


//apelaciones.
// Rutas
// Rutas
//app.use("/rutas/apelaciones", apelaciones);

// Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
