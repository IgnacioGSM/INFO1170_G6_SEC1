const express = require('express');
const router = express.Router();
const db = require('../database.js');

router.get('/', (req, res) => { // /mis_solicitudes
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

router.get('/solicitud', (req, res) => {    // /mis_solicitudes/solicitud
    console.log("Entrando a la solicitud: " + req.query.idsoli);  // asi se recibe el id de la solicitud enviado desde la url
    if (req.session.usuario) {
      let queryPaginaSolicitud = "SELECT soli.*, sec.NombreSeccion, cen.Nombre AS NombreHospital \
                                  FROM Solicitud soli \
                                  INNER JOIN Seccion sec ON soli.IdSeccion = sec.IdSeccion \
                                  INNER JOIN CentroSalud cen ON cen.IdCentro = sec.IdCentro \
                                  WHERE soli.IdSolicitud = ?";
      db.query(queryPaginaSolicitud, [req.query.idsoli], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          if (result[0].Estado === 'pendiente') {
            res.render('solicitud', {user: req.session.usuario, solicitud: result[0], respuesta: 0});
          }
          else {
            let queryRespuesta = "SELECT res.*,rec.* FROM RespuestaSolicitud res \
                                  INNer JOIN Usuario rec ON res.IdUsuario = rec.IdUsuario \
                                  WHERE IdSolicitud = ?";
            db.query(queryRespuesta, [req.query.idsoli], (err, result2) => {
              if (err) {
                console.log(err);
              } else {
                console.log(result2);
                if (result2.length === 0) { // Si no hay respuesta en la base de datos
                  res.render('solicitud', {user: req.session.usuario, solicitud: result[0], respuesta: 0});
                } else {
                  res.render('solicitud', {user: req.session.usuario, solicitud: result[0], respuesta: result2[0]});
                }
              }
            });
          }
        }
      });
    } else {
      res.render('index', {user: 0}); // No se debería poder acceder a esta página sin estar logeado
    }
  });
  
router.get('/cancelarsolicitud', (req, res) => { // /mis_solicitudes/cancelarsolicitud
    if (req.session.usuario) {
      let queryCancel = "DELETE FROM Solicitud WHERE IdSolicitud = ?";
      db.query(queryCancel, [req.query.idsoli], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Solicitud cancelada");
          res.redirect('/mis_solicitudes');
        }
      });
    }
  });

module.exports = router;