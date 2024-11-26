const express = require('express');
const router = express.Router();
const db = require('../database.js');

router.get('/', (req, res) => { // /mis_solicitudes
    if (req.session.usuario) {
      let querySolicitudes = "SELECT soli.*, sec.nombreseccion, cen.nombre AS nombrehospital \
                              FROM Solicitud soli \
                              INNER JOIN Seccion sec ON soli.idseccion = sec.idseccion \
                              INNER JOIN CentroSalud cen ON cen.idcentro = sec.idcentro \
                              WHERE soli.idusuario = ?";
      db.query(querySolicitudes, [req.session.usuario.idusuario], (err, result) => {
        if (err) {
          console.log(err);
        } else {
        res.render('mis_solicitudes', {user: req.session.usuario, solicitudes: result, currentPage: 'mis_solicitudes'});
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
      res.json({idsoli: 'error'});
    } else {
      res.json({idsoli: result[0].idsolicitud});
    }
  });
});

// Marcar una notificación como leida
router.get('/marcar-leida', (req, res) => { // /mis_solicitudes/marcar-leida
  let respuesta = req.query.idnoti;
  let queryLeida = "UPDATE Notificacion SET leido = 1 WHERE idnoti = ?";
  db.query(queryLeida, [respuesta], (err, result) => {
    if (err) {
      res.json({error: 'error al actualizar la base de datos'});
    } else {
      res.json({success: 'notificación marcada como leída'});
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
      res.render('solicitud', {user: req.session.usuario, solicitud: result[0], respuesta: 0, currentPage: 'mis_solicitudes'});
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
          res.render('solicitud', {user: req.session.usuario, solicitud: result[0], respuesta: 0, currentPage: 'mis_solicitudes'});
        } else {
          res.render('solicitud', {user: req.session.usuario, solicitud: result[0], respuesta: result2[0], currentPage: 'mis_solicitudes'});
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