const express = require('express');
const router = express.Router();
const db = require('../database.js');

router.get('/', (req, res) => {
    if (req.session.usuario) {
        res.render('index', {user: req.session.usuario});
    } else {
        res.render('index', {user: 0});
    }
});

router.post('/submit_solicitud', (req, res) => {
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
                    res.redirect('/');
                }
            });
        }
      });
    });

router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
      });
module.exports = router;