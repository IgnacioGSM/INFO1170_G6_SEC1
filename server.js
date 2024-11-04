const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const { rmSync } = require('fs');

const app = express();

// Configuración de multer
const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, 'uploads/'); // Carpeta donde se almacenarán los archivos
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
  }
});

// La conexión a la base de datos se encuentra en database.js
const db = require('./database');

// Configuraciones de la app
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'clave-super-secreta',
  resave: false,
  saveUninitialized: false,
  cookie : { maxAge: 120000 }
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



// -------- PERFIL DE USUARIO --------
const upload = multer({storage:storage});

app.post('/envexp', upload.array('archivo', 5), (req, res) =>{
    const userId = 4;
    const archivos = req.files;

    if(archivos.length === 0){
        return res.status(400).send('No se subio ningun archivo');
    }
    archivos.forEach((archivo) =>{
        const query = 'INSERT INTO expedientes_medicos (IdUsuario, nombre_archivo, ruta_archivo) VALUES (?, ?, ?)';
        db.query(query, [userId, archivo.originalname, archivo.path], (err, result) =>{
            if(err){
                console.error('Error al guardar el archivo en la base de datos', err);
                return res.status(500).send('Error en el servidor');
            }
        });
    });
    res.send('Expedientes medicos subidos con exito');
});


app.post('/cambiarcorreo', (req, res) => {
    const {nuevoCorreo, confirmarCorreo} = req.body;
    const userId = 4;

    db.query('SELECT contrasenia FROM Usuario WHERE idusuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (confirmarCorreo == storedPassword) {
            bd.query('UPDATE Usuario SET correoelectronico = ? WHERE idusuario = ?', [nuevoCorreo, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar el correo');
                res.send('Correo actualizado');
            });
        } else {
            res.send("Contraseña incorrecta");
        }
        /*bcrypt.compare(confirmarCorreo, storedPassword, (err, isMatch) => {
            if (err) return res.status(500).send('Error en el servidor');
            if (!isMatch) return res.status(400).send('Contraseña incorrecta');

            connection.query('UPDATE usuarios SET CorreoElectronico = ? WHERE IdUsuario = ?', [nuevoCorreo, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar el correo');
                res.send('Correo actualizado');
            });
        });*/
    });
});

app.post('/cambiartelefono', (req, res) => {
    const {nuevoTelefono, confirmarTelefono} = req.body;
    const userId = 4;

    db.query('SELECT contrasenia FROM Usuario WHERE idusuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (confirmarTelefono == storedPassword) {
            db.query('UPDATE usuario SET NumeroTelefono = ? WHERE idusuario = ?', [nuevoTelefono, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar el telefono');
                res.send('Telefono actualizado');
            });
        } else {
            res.send("Contraseña incorrecta");
        }
    });
});

app.post('/cambiardireccion', (req, res) => {
    const {nuevaDireccion, confirmarDireccion} = req.body;
    const userId = 4;

    db.query('SELECT contrasenia FROM Usuario WHERE idusuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (confirmarDireccion == storedPassword) {
            db.query('UPDATE Usuario SET Direccion = ? WHERE idusuario = ?', [nuevaDireccion, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar la direccion');
                res.send('Direccion actualizada');
            });
        } else {
            res.send("Contraseña incorrecta");
        }
    });
});

app.post('/cambiarcontraseña', (req, res) => {
    const {nuevaContraseña, confirmarContraseña, contraseñaActual} = req.body;
    const userId = 4;

    db.query('SELECT contrasenia FROM Usuario WHERE idusuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (contraseñaActual === storedPassword) {

            if (nuevaContraseña === confirmarContraseña) {

                db.query('UPDATE Usuario SET Contrasenia = ? WHERE idusuario = ?', [nuevaContraseña, userId], (error) =>{
                    if (error) return res.status(500).send('Error al actualizar la contraseña');
                    res.send('Contraseña actualizada');
                });
            } else {
                res.send("Contraseña incorrecta");
            }
        } else {
            res.send('La contraseña actual no coincide')
        }
    }); 
});

app.get('/perfilUsuario', (req,res) =>{
    const userId = 4;

    const query = 'SELECT nombre, correoElectronico, rut, numerotelefono FROM Usuario WHERE idusuario = ?';

    db.query(query, [userId], (err, result) =>{
        if (err){
            console.error('Error al obtener los datos del usuario: ', err);
            return res.status(500).send('Error al obtener los datos del usuario');
        }

        if (result.length > 0){
            res.render('perfilUsuario', {usuario: result[0]});
        }else{
            res.status(404).send('Usuario no encontrado');
        }
    });
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});