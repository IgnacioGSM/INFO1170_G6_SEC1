const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const { host, user, password, database } = require('./credenciales_mysql.js');  // cambiar los datos en el archivo credenciales_mysql.js para que funcione en sus equipos

// Conexión a la base de datos
const db = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'views','index.html'));
});

// Rutas para páginas a las que se accede desde index, direcciones temporales hasta que todas estén bien organizadas
app.get('/iniciosesion', (req, res) => {
  res.sendFile(path.join(__dirname,'iniciosesion.html'));
});

app.get('/registropersona', (req, res) => {
  res.sendFile(path.join(__dirname,'registropersona.html'));
});

app.get('/perfilUsuario', (req, res) => {
  res.sendFile(path.join(__dirname,'perfilUsuario.html'));
});

app.get('/mis_solicitudes', (req, res) => {
  res.sendFile(path.join(__dirname,'views','mis_solicitudes.html'));
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
                    res.sendFile(path.join(__dirname,'views','index.html'));
                }
            });
        }
      });
    });

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
