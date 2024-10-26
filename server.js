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


// Rutas para páginas a las que se accede desde index, direcciones temporales hasta que todas estén bien organizadas


app.get('/trucazoadmin', (req, res) => {
  if (req.session.usuario) {
    req.session.usuario.TipoUsuario = 'admin';
    res.redirect('/admin');
  }
});

app.get('/agregar_hospital', (req, res) => {
  if (req.session.usuario && req.session.usuario.TipoUsuario === 'admin') {
    res.render('agregar_hospital', { user: req.session.usuario, error: null, success: null });
  } else {
    res.redirect('/');
  }
});





// Ruta para el panel de administrador
app.get('/admin', (req, res) => {
  db.query('SELECT * FROM CentroSalud', (err, hospitales) => {
      if (err) {
          return res.status(500).send('Error en la consulta');
      }
      console.log(req.session.usuario);
      res.render('admin', { hospitales, user: req.session.usuario });
  });
});


// Ruta para agregar un hospital
app.post('/agregar_hospital', (req, res) => {
  const { Latitud, Longitud, Nombre } = req.body;
  const query = 'INSERT INTO CentroSalud (Latitud, Longitud, Nombre) VALUES (?, ?, ?)';

  db.query(query, [Latitud, Longitud, Nombre], (err, result) => {
      if (err) {
          console.error('Error al insertar en la tabla CentroSalud:', err);
          res.render('agregar_hospital', { user: req.session.usuario, error: 'Error al crear el centro de salud', success: null });
      } else {
          res.render('agregar_hospital', { user: req.session.usuario, error: null, success: 'Centro de salud creado exitosamente' });
      }
  });
});
// Ruta para mostrar el formulario de edición de hospital
app.get('/editar_hospital/:id', (req, res) => {
  const hospitalId = req.params.id;
  const query = 'SELECT * FROM CentroSalud WHERE IdCentro = ?';

  db.query(query, [hospitalId], (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta');
    }
    if (results.length === 0) {
      return res.status(404).send('Hospital no encontrado');
    }
    const hospital = results[0];
    res.render('editar_hospital', { hospital, user: req.session.usuario }); 
  });
});

// Ruta para procesar la edición de hospital
app.post('/editar_hospital/:id', (req, res) => {
  const hospitalId = req.params.id;
  const { nombre, latitud, longitud } = req.body;
  const query = 'UPDATE CentroSalud SET Nombre = ?, Latitud = ?, Longitud = ? WHERE IdCentro = ?';

  db.query(query, [nombre, latitud, longitud, hospitalId], (err) => {
    if (err) {
      return res.status(500).send('Error al actualizar el hospital');
    }
    res.redirect('/admin');
  });
});

// Ruta para eliminar un hospital
app.post('/eliminar_hospital/:id', (req, res) => {
  const hospitalId = req.params.id;
  const query = 'DELETE FROM CentroSalud WHERE IdCentro = ?';

  db.query(query, [hospitalId], (err) => {
    if (err) {
      return res.status(500).send('Error al eliminar el hospital');
    }
    res.redirect('/admin');
  });
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// -------- INICIO DE SESION, REGISTRO Y CONTRASEÑA OLVIDADA --------
app.get('/registropersona', (req, res) => {
  res.render('registropersona', { user: 0 });
});
app.get('/iniciosesion', (req, res) => {
  // Para testear, al entrar a iniciosesion se simula que se inicia sesión como usuario
  let logQuery = "SELECT * FROM Usuario WHERE RUT = ?";
  db.query(logQuery, ['123456789'], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length === 0) {
      res.send("Usuario no encontrado");
    } else {
      req.session.usuario = result[0];
      res.redirect('/');
    }
  });
});
/*app.get('/iniciosesion', (req, res) => {
  res.render('iniciosesion', { user: 0 });
});*/
// Cambiar contraseña (olvidé mi contraseña)
app.post('/forgot-password', async (req, res) => {
  const { CorreoElectronico, NuevaContrasenia } = req.body;
  // Verificar si el correo existe
  db.query('SELECT * FROM Usuario WHERE CorreoElectronico = ?', [CorreoElectronico], async (err, results) => {
      if (err) return res.status(500).send('Error en el servidor');
      if (results.length === 0) return res.status(400).send('Correo no encontrado');
      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(NuevaContrasenia, 10);
      // Actualizar contraseña
      db.query('UPDATE Usuario SET Contrasenia = ? WHERE CorreoElectronico = ?', [hashedPassword, CorreoElectronico], (err, result) => {
          if (err) return res.status(500).send('Error al actualizar la contraseña');
          res.status(200).send('Contraseña actualizada exitosamente');
      });
  });
});
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
      res.redirect('/iniciosesion');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
  }
});
app.post('/login', async (req, res) => {
  const {rut, Contrasenia } = req.body;
  try {
      // Buscar usuario por correo
      const [results] = await db.query('SELECT * FROM Usuario WHERE RUT = ?', [rut]);
      if (results.length === 0) {
          return res.status(400).send('Correo no registrado');
      }
      const user = results[0];
      // Comparar contraseñas
      const isPasswordValid = await bcrypt.compare(Contrasenia, user.Contrasenia);
      if (!isPasswordValid) {
          return res.status(400).send('Contraseña incorrecta');
      }
      req.session.usuario = user;
      res.redirect('/');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error en el servidor');
  }
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

    db.query('SELECT contrasenia FROM usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (confirmarCorreo == storedPassword) {
            bd.query('UPDATE usuario SET CorreoElectronico = ? WHERE IdUsuario = ?', [nuevoCorreo, userId], (error) =>{
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

    db.query('SELECT contrasenia FROM usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (confirmarTelefono == storedPassword) {
            db.query('UPDATE usuario SET NumeroTelefono = ? WHERE IdUsuario = ?', [nuevoTelefono, userId], (error) =>{
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

    db.query('SELECT contrasenia FROM Usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (confirmarDireccion == storedPassword) {
            db.query('UPDATE Usuario SET Direccion = ? WHERE IdUsuario = ?', [nuevaDireccion, userId], (error) =>{
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

    db.query('SELECT contrasenia FROM Usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (contraseñaActual === storedPassword) {

            if (nuevaContraseña === confirmarContraseña) {

                db.query('UPDATE Usuario SET Contrasenia = ? WHERE IdUsuario = ?', [nuevaContraseña, userId], (error) =>{
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

    const query = 'SELECT Nombre, CorreoElectronico, RUT, NumeroTelefono FROM Usuario WHERE IdUsuario = ?';

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