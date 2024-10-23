const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');
const { host, user, password, database } = require('./credenciales_mysql.js');  // cambiar los datos en el archivo credenciales_mysql.js para que funcione en sus equipos
const { rmSync } = require('fs');

const app = express();

// Conexión a la base de datos
const db = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
});
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



app.get('/perfilUsuario', (req, res) => {
  res.sendFile(path.join(__dirname,'perfilUsuario.html'));
});



app.get('/inter_recepcionista', (req, res) => {
  res.sendFile(path.join(__dirname,'inter_recepcionista.html'));
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



// Ruta para editar un hospital (formulario)
app.get('/editar_hospital', (req, res) => {
  const query = 'SELECT * FROM CentroSalud';
  
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error al obtener datos de CentroSalud:', err);
          res.status(500).send('Error al obtener centros de salud');
      } else {
          res.json(results);
      }
  });
});

// Ruta para actualizar un hospital
app.put('/editar_hospital/:id', (req, res) => {
  const { id } = req.params;
  const { Latitud, Longitud, Nombre } = req.body;
  const query = 'UPDATE CentroSalud SET Latitud = ?, Longitud = ?, Nombre = ? WHERE IdCentro = ?';
  
  db.query(query, [Latitud, Longitud, Nombre, id], (err, result) => {
      if (err) {
          console.error('Error al actualizar en la tabla CentroSalud:', err);
          res.status(500).send('Error al actualizar el centro de salud');
      } else {
          res.send('Centro de salud actualizado exitosamente');
      }
  });
});

// Ruta para eliminar un hospital
app.delete('/eliminar_hospital/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM CentroSalud WHERE IdCentro = ?';
  
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error('Error al eliminar de la tabla CentroSalud:', err);
          res.status(500).send('Error al eliminar el centro de salud');
      } else {
          res.send('Centro de salud eliminado exitosamente');
      }
  });
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

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});