const express = require('express');
const router = express.Router();
const db = require('../database.js');

router.get('/', (req, res) => { // /mis_solicitudes
    if (req.session.usuario) {
      let querySolicitudes = "SELECT * FROM Solicitud WHERE idusuario = ?";
      db.query(querySolicitudes, [req.session.usuario.IdUsuario], (err, result) => {
        if (err) {
          console.log(err);
        } else {
        res.render('mis_solicitudes', {user: req.session.usuario, solicitudes: result});
        }
      });
    } else {
      res.redirect('/'); // Si no está logeado, redirige a la página principal
    }
  });

// Obtener id de la solicitud respondida con el id de la respuesta
router.get('/id-soli-from-respuesta', (req, res) => { // /mis_solicitudes/id-soli-from-respuesta
  let respuesta = req.query.idrespuesta;
  let querySolicitud = "SELECT idsolicitud FROM RespuestaSolicitud WHERE idrespuesta = ?";
  db.query(querySolicitud, [respuesta], (err, result) => {
    if (err) {
      console.log(err);
      res.json({idsoli: 'error'});
    } else {
      res.json({idsoli: result[0].idsolicitud});
    }
  });
});
  
router.get('/solicitud', (req, res) => {    // /mis_solicitudes/solicitud
  console.log("Entrando a la solicitud: " + req.query.idsoli);  // asi se recibe el id de la solicitud enviado desde la url
  if (req.session.usuario) {
    let queryPaginaSolicitud = "SELECT soli.*, sec.nombreseccion, cen.nombre AS nombrehospital \
                  FROM Solicitud soli \
                  INNER JOIN Seccion sec ON soli.idseccion = sec.idseccion \
                  INNER JOIN CentroSalud cen ON cen.idcentro = sec.idcentro \
                  WHERE soli.idsolicitud = ?";
    db.query(queryPaginaSolicitud, [req.query.idsoli], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result[0].estado === 'pendiente') {
      res.render('solicitud', {user: req.session.usuario, solicitud: result[0], respuesta: 0});
      }
      else {
      let queryRespuesta = "SELECT res.*, rec.* FROM RespuestaSolicitud res \
                  INNER JOIN Usuario rec ON res.idusuario = rec.idusuario \
                  WHERE idsolicitud = ?";
      db.query(queryRespuesta, [req.query.idsoli], (err, result2) => {
        if (err) {
        console.log(err);
        } else {
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
    res.redirect('/');  // Si no está logeado, redirige a la página principal
  }
  });
  
router.get('/cancelarsolicitud', (req, res) => { // /mis_solicitudes/cancelarsolicitud
  if (req.session.usuario) {
    let queryCancel = "DELETE FROM Solicitud WHERE idsolicitud = ?";
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