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




// Ruta para la página principal que redirige al panel de administración
app.get('/', (req, res) => {
  if (req.session.usuario) {
    res.render('index', {user: req.session.usuario});
  } else {
    res.render('index', {user: 0});
  }
});

app.get('/mis_solicitudes', (req, res) => {
  if (req.session.usuario) {
    let querySolicitudes = "SELECT * FROM Solicitud WHERE IdUsuario = ?";
    db.query(querySolicitudes, [req.session.usuario.IdUsuario], (err, result) => {
      if (err) {
        console.log(err);
      } else {
      res.render('mis_solicitudes', {user: req.session.usuario, solicitudes: result});
      }
    });
  } else {
    res.render('index', {user: 0}); // No se debería poder acceder a esta página sin estar logeado
  }
});

// Rutas para páginas a las que se accede desde index, direcciones temporales hasta que todas estén bien organizadas
app.get('/iniciosesion', (req, res) => {
  // Para testear, al entrar a iniciosesion se simula que se inicia sesión como usuario
  let logQuery = "SELECT * FROM usuario WHERE RUT = ?";
  db.query(logQuery, ['123456789'], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length === 0) {
      res.send("Usuario no encontrado");
    } else {
      req.session.usuario = result[0];
      res.sendFile(path.join(__dirname,'views','iniciosesion.html')); // Envío de respuestas DENTRO de la función del query, para que no se envíe antes de que se ejecute la consulta
    }
  });
});

app.get('/trucazoadmin', (req, res) => {
  if (req.session.usuario) {
    req.session.usuario.TipoUsuario = 'admin';
    res.redirect('/admin');
  }
});

app.get('/registropersona', (req, res) => {
  res.sendFile(path.join(__dirname,'registropersona.html'));
});

app.get('/perfilUsuario', (req, res) => {
  res.sendFile(path.join(__dirname,'perfilUsuario.html'));
});



app.get('/inter_recepcionista', (req, res) => {
  res.sendFile(path.join(__dirname,'inter_recepcionista.html'));
});


app.post('/submit_solicitud', (req, res) => {
    console.log(req.body);
    let idSeccion = 1;
    let date = new Date();
    let hora_solicitud = date.getFullYear() + '/' +
      ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
      ('0' + date.getDate()).slice(-2) + ' ' +
      ('0' + date.getHours()).slice(-2) + ':' +
      ('0' + date.getMinutes()).slice(-2) + ':' +
      ('0' + date.getSeconds()).slice(-2);
    let estado = 'pendiente';

    let rut = req.body.rut.replace(/[^\dkK]/g, ''); // Quita puntos y guión recibidos en el rut
    let correo = req.body.correo;
    let motivo_consulta = req.body.motivo_consulta;

    let queryUser = "SELECT * FROM Usuario WHERE RUT = ?";
    db.query(queryUser, [rut], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length === 0) {
            console.log("Usuario no encontrado");
            res.send("Usuario no encontrado");
        } else {
            let idUsuario = result[0].IdUsuario;
            let querySolicitud = "INSERT INTO Solicitud (IdUsuario, IdSeccion, Mensaje, HoraSolicitud, Estado) VALUES (?, ?, ?, ?, ?)";
            db.query(querySolicitud, [idUsuario, idSeccion, motivo_consulta, hora_solicitud, estado], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Solicitud enviada");
                    res.render('index', {user: req.session.usuario});
                }
            });
        }
      });
    });


// Ruta para el panel de administrador
app.get('/admin', (req, res) => {
    db.query('SELECT * FROM centrosalud', (err, hospitales) => {
        if (err) {
            return res.status(500).send('Error en la consulta');
        }
        console.log(req.session.usuario);
        res.render('admin', { hospitales, user: req.session.usuario });
    });
});

// Ruta para agregar un hospital
app.get('/agregar_hospital', (req, res) => {
    res.render('agregar_hospital', { error: null, success: null, user: req.session.user });
});

app.post('/agregar_hospital', (req, res) => {
    const { id, nombre, latitud, longitud } = req.body;
    const query = 'INSERT INTO centrosalud (id, nombre, latitud, longitud) VALUES (?, ?, ?, ?)';
    const values = [id, nombre, latitud, longitud];

    db.query(query, values, (error) => {
        if (error) {
            return res.render('agregar_hospital', { error: 'Error al agregar el hospital.', success: null, user: req.session.usuario });
        }
        res.render('agregar_hospital', { success: 'Hospital agregado correctamente.', error: null, user: req.session.usuario });
    });
});

// Ruta para editar un hospital (formulario)
app.get('/editar_hospital/:id', (req, res) => {
    const hospitalId = req.params.id;
    const query = 'SELECT * FROM hospitales WHERE id = ?';

    db.query(query, [hospitalId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send('Hospital no encontrado');
        }
        res.render('editar_hospital', { hospital: results[0], error: null, success: null, user: req.session.usuario });
    });
});

// Ruta para actualizar un hospital
app.post('/editar_hospital/:id', (req, res) => {
    const hospitalId = req.params.id;
    const { nombre, latitud, longitud } = req.body;
    const query = 'UPDATE hospitales SET nombre = ?, latitud = ?, longitud = ? WHERE id = ?';

    db.query(query, [nombre, latitud, longitud, hospitalId], (error) => {
        if (error) {
            return res.render('editar_hospital', { hospital: { id: hospitalId, nombre, latitud, longitud }, error: 'Error al actualizar el hospital.', success: null, user: req.session.usuario });
        }
        res.render('editar_hospital', { hospital: { id: hospitalId, nombre, latitud, longitud }, success: 'Hospital actualizado correctamente.', error: null, user: req.session.usuario });
    });
});

// Ruta para eliminar un hospital
app.post('/eliminar_hospital/:id', (req, res) => {
    const hospitalId = req.params.id;
    const query = 'DELETE FROM hospitales WHERE id = ?';

    db.query(query, [hospitalId], (error) => {
        if (error) {
            return res.status(500).send('Error al eliminar el hospital');
        }
        res.redirect('/admin');
    });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});