const express = require('express');
const router = express.Router();
const db = require('../database.js');

// Ruta principal para la interfaz de recepcionista
router.get('/', (req, res) => {
    // Solo los recepcionistas pueden acceder a esta interfaz
    if (!req.session.usuario || req.session.usuario.tipousuario !== 'recepcionista') {res.redirect('/login'); return;}

    // Obtener sección correspondiente al recepcionista
    db.query('SELECT idseccion FROM Seccion WHERE idusuario = ?', [req.session.usuario.idusuario], (err, result) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        if (result.length === 0) {
            // Si el recepcionista no tiene una sección asignada, redirigir a la página de inicio
            console.log('El recepcionista no tiene una sección asignada');
            return res.redirect('/');
        }
        const idseccion = result[0].idseccion;

        // Obtener solicitudes de la sección del recepcionista
        db.query('SELECT us.rut, us.nombre, us.apellido, so.mensaje \
                    FROM Solicitud so NATURAL JOIN Usuario us \
                    WHERE idseccion = ?', [idseccion], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('recepcionista', { solicitudes: result , currentPage: 'recepcionista'});
        });
    });
});

module.exports = router;