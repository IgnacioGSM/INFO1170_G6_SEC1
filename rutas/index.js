const express = require('express');
const router = express.Router();
const db = require('../database.js');

router.get('/', (req, res) => {
    if (req.session.usuario) {
        res.render('index', {user: req.session.usuario, currentPage: 'index'});
    } else {
        res.render('index', {user: 0, currentPage: 'index'});
    }
});

router.get('/userid', (req, res) => {   // Solo para obtener el id del usuario
    if (req.session.usuario) {
        res.json({userid: req.session.usuario.idusuario});
    } else {
        res.json({userid: 'false'});
    }
});

router.post('/submit_solicitud', (req, res) => {
    console.log("solicitud recibida");
    console.log(req.body);

    // Datos para la solicitud en la base de datos
    let idSeccion = req.body.idseccion;
    let date = new Date();
    let hora_solicitud = date.getFullYear() + '/' +
      ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
      ('0' + date.getDate()).slice(-2) + ' ' +
      ('0' + date.getHours()).slice(-2) + ':' +
      ('0' + date.getMinutes()).slice(-2) + ':' +
      ('0' + date.getSeconds()).slice(-2);
    let estado = 'pendiente';

    // Datos recibidos del formulario
    let rut = req.body.rut.replace(/[^\dkK]/g, ''); // Quita puntos y guión recibidos en el rut
    let correo = req.body.correo;
    let motivo_consulta = req.body.motivo_consulta;

    let queryUser = "SELECT * FROM Usuario WHERE RUT = ?";
    db.query(queryUser, [rut], (err, result) => {
        if (err) {
            console.log(err);
            res.json({error: "Error en la base de datos"});
        }
        if (result.length === 0) {
            console.log("Usuario no encontrado");
            res.json({error: "Usuario no encontrado"});
        } else {
            let idUsuario = result[0].idusuario;
            let querySolicitud = "INSERT INTO Solicitud (idusuario, idseccion, mensaje, horasolicitud, estado) VALUES (?, ?, ?, ?, ?)";
            db.query(querySolicitud, [idUsuario, idSeccion, motivo_consulta, hora_solicitud, estado], (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({error: "Error al enviar la solicitud"});
                } else {
                    console.log("Solicitud enviada");
                    res.json({success: "Solicitud enviada"});
                }
            });
        }
      });
    });

router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
      });


router.get('/mapdata', (req, res) => {
    let query = "SELECT * FROM CentroSalud";    // Obtiene los datos de los hospitales
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.json([]);
        } else {
            if (result.length === 0) {
                res.json([]);
            } else {
                let pendientes = result.length;
                for (let i = 0; i < result.length; i++) {
                    result[i].secciones = [];
                    let querySecciones = "SELECT * FROM Seccion WHERE idcentro = ?";    // Obtiene las secciones de cada hospital
                    db.query(querySecciones, [result[i].idcentro], (err, result2) => {
                        if (err) {
                            console.log(err);
                            result2 = [];
                        }
                        if (result2.length === 0) {
                            result[i].secciones = [];
                            pendientes--;
                            if (pendientes === 0) {
                                res.json(result);
                            }
                        } else {
                            let pendientesSecciones = result2.length;
                            for (let j = 0; j < result2.length; j++) {
                                let queryFilas = "SELECT * FROM EnEspera WHERE idseccion = ?";  // Obtiene las filas de cada seccion
                                db.query(queryFilas, [result2[j].idseccion], (err, result3) => {
                                    if (err) {
                                        console.log(err);
                                        result3 = [];
                                    }
                                    result2[j].fila = result3.length;  // Solo guarda la cantidad de personas en la fila
                                    pendientesSecciones--;
                                    if (pendientesSecciones === 0) {
                                        result[i].secciones = result2;  // Cuando se obtienen los datos de todas las secciones, se guardan en el hospital
                                        pendientes--;
                                        if (pendientes === 0) {  // Cuando se obtienen los datos de todos los hospitales, se envian al frontend
                                            res.json(result);
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
});

module.exports = router;