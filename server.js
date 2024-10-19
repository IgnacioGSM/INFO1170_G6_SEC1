
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');
const { host, user, password, database } = require('./credenciales_mysql.js');  // cambiar los datos en el archivo credenciales_mysql.js para que funcione en sus equipos

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
  let logQuery = "SELECT * FROM Usuario WHERE RUT = ?";
  db.query(logQuery, ['123456789'], (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length === 0) {
      res.send("Usuario no encontrado");
    } else {
      req.session.usuario = result[0];
      res.sendFile(path.join(__dirname,'iniciosesion.html')); // Envío de respuestas DENTRO de la función del query, para que no se envíe antes de que se ejecute la consulta
    }
  });
});

app.get('/registropersona', (req, res) => {
  res.sendFile(path.join(__dirname,'registropersona.html'));
});

app.get('/perfilUsuario', (req, res) => {
  res.sendFile(path.join(__dirname,'perfilUsuario.html'));
});


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname,'admin.html'));
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

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
