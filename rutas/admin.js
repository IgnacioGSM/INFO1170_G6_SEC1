const express = require('express');
const router = express.Router();
const db = require('../database.js');

router.get('/', (req, res) => {
    if (req.session.usuario) {
        if (req.session.usuario.tipousuario === 'admin') { // Solo si el usuario es admin
            db.query('SELECT * FROM CentroSalud', (err, hospitales) => {
                if (err) {
                    console.log('Error en la consulta:', err);
                    return res.status(500).send('Error en la consulta');
                }
                res.render('admin', { hospitales, user: req.session.usuario });
            });
        }
    }
    else {
        res.redirect('/');
    }
});

// Ruta para mostrar el formulario de agregar hospital
router.get('/agregar_hospital', (req, res) => {
    if (req.session.usuario && req.session.usuario.tipousuario === 'admin') {
      res.render('agregar_hospital', { user: req.session.usuario, error: null, success: null });
    } else {
      res.redirect('/');
    }
  });

// Ruta para agregar un hospital
router.post('/agregar_hospital', (req, res) => {
    const { Latitud, Longitud, Nombre } = req.body;
    const query = 'INSERT INTO CentroSalud (latitud, longitud, nombre) VALUES (?, ?, ?)';
  
    db.query(query, [Latitud, Longitud, Nombre], (err, result) => {
        if (err) {
            console.error('Error al insertar en la tabla CentroSalud:', err);
            res.render('agregar_hospital', { user: req.session.usuario, error: 'Error al crear el centro de salud', success: null });
        } else {
            res.render('agregar_hospital', { user: req.session.usuario, error: null, success: 'Centro de salud creado exitosamente' });
        }
    });
  });

// Ruta para eliminar un hospital
router.post('/eliminar_hospital/:id', (req, res) => {
    const hospitalId = req.params.id;
    const query = 'DELETE FROM CentroSalud WHERE idcentro = ?';
  
    db.query(query, [hospitalId], (err) => {
      if (err) {
        return res.status(500).send('Error al eliminar el hospital');
      }
      res.redirect('/admin');
    });
  });

// Ruta para mostrar el formulario de edición de hospital
router.get('/editar_hospital/:id', (req, res) => {
    const hospitalId = req.params.id;
    const query = 'SELECT * FROM CentroSalud WHERE idcentro = ?';
  
    db.query(query, [hospitalId], (err, results) => {
      if (err) {
        return res.status(500).send('Error en la consulta');
      }
      if (results.length === 0) {
        return res.status(404).send('Hospital no encontrado');
      }
      const hospital = results[0];
      res.render('editar_hospital', { hospital, user: req.session.usuario }); 
    });
  });

// Ruta para procesar la edición de hospital
router.post('/editar_hospital/:id', (req, res) => {
    const hospitalId = req.params.id;
    const { nombre, latitud, longitud } = req.body;
    const query = 'UPDATE CentroSalud SET nombre = ?, latitud = ?, longitud = ? WHERE idcentro = ?';
  
    db.query(query, [nombre, latitud, longitud, hospitalId], (err) => {
      if (err) {
        return res.status(500).send('Error al actualizar el hospital');
      }
      res.redirect('/admin');
    });
  });

module.exports = router;