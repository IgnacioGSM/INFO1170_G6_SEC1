const express = require('express');
const router = express.Router();
const db = require('../database.js');

// Ruta principal para la página de administración
router.get('/', (req, res) => {
    if (req.session.usuario && req.session.usuario.tipousuario === 'admin') {
        db.query('SELECT * FROM CentroSalud', (err, hospitales) => {
            if (err) {
                console.log('Error en la consulta:', err);
                return res.status(500).send('Error en la consulta');
            }
            res.render('admin', { hospitales, user: req.session.usuario, usuarios: [] });
        });
    } else {
        res.redirect('/');
    }
});

// Ruta para buscar usuarios
router.get('/buscar_usuarios', (req, res) => {
    if (req.session.usuario && req.session.usuario.tipousuario === 'admin') {
        const query = req.query.query;
        const searchQuery = "SELECT * FROM Usuario WHERE nombre LIKE ? OR correoelectronico LIKE ?";
        
        db.query(searchQuery, [`%${query}%`, `%${query}%`], (err, usuarios) => {
            if (err) {
                console.error('Error al buscar usuarios:', err);
                return res.status(500).send('Error al buscar usuarios');
            }

            db.query('SELECT * FROM CentroSalud', (err, hospitales) => {
                if (err) {
                    console.log('Error en la consulta:', err);
                    return res.status(500).send('Error en la consulta');
                }
                res.render('admin', { hospitales, usuarios, user: req.session.usuario });
            });
        });
    } else {
        res.redirect('/');
    }
});

// Ruta para suspender un usuario
router.post('/suspender_usuario/:id', (req, res) => {
  if (req.session.usuario && req.session.usuario.tipousuario === 'admin') {
      const userId = req.params.id;
      const suspendQuery = "UPDATE Usuario SET tipousuario = 'suspendido' WHERE idusuario = ?";

      db.query(suspendQuery, [userId], (err) => {
          if (err) {
              console.error('Error al suspender usuario:', err);
              return res.status(500).send('Error al suspender usuario');
          }
          res.redirect('/admin');
      });
  } else {
      res.redirect('/');
  }
});


// Ruta para eliminar un usuario
router.post('/eliminar_usuario/:id', (req, res) => {
    if (req.session.usuario && req.session.usuario.tipousuario === 'admin') {
        const userId = req.params.id;
        const deleteQuery = "DELETE FROM Usuario WHERE idusuario = ?";

        db.query(deleteQuery, [userId], (err) => {
            if (err) {
                console.error('Error al eliminar usuario:', err);
                return res.status(500).send('Error al eliminar usuario');
            }
            res.redirect('/admin');
        });
    } else {
        res.redirect('/');
    }
});

router.post('/cambiar_tipo_usuario/:id', (req, res) => {
  if (req.session.usuario && req.session.usuario.tipousuario === 'admin') {
      const userId = req.params.id; // Obtiene el ID del usuario
      const nuevoTipo = req.body.tipousuario; // Obtiene el tipo de usuario enviado

      const updateQuery = "UPDATE Usuario SET tipousuario = ? WHERE idusuario = ?";

      db.query(updateQuery, [nuevoTipo, userId], (err) => {
          if (err) {
              console.error('Error al cambiar tipo de usuario:', err);
              return res.status(500).send('Error al cambiar tipo de usuario');
          }
          res.redirect('/admin');
      });
  } else {
      res.redirect('/');
  }
});

// Ruta para mostrar el formulario de edición de sección del hospital
router.get('/editar_seccion/:idcentro', (req, res) => {
  const hospitalId = req.params.idcentro;
  const query = 'SELECT * FROM Seccion WHERE idcentro = ?'; // Asumiendo que hay una tabla Seccion

  db.query(query, [hospitalId], (err, results) => {
      if (err) {
          return res.status(500).send('Error en la consulta de la sección');
      }
      if (results.length === 0) {
          return res.status(404).send('Sección no encontrada');
      }
      const seccion = results[0];
      res.render('editar_seccion', { seccion, hospitalId, user: req.session.usuario });
  });
});

// Ruta para procesar la edición de la sección
router.post('/editar_seccion/:idcentro', (req, res) => {
  const hospitalId = req.params.idcentro;
  const { nombre, descripcion } = req.body;
  const query = 'UPDATE Seccion SET nombre = ?, descripcion = ? WHERE idcentro = ?';

  db.query(query, [nombre, descripcion, hospitalId], (err) => {
      if (err) {
          return res.status(500).send('Error al actualizar la sección');
      }
      res.redirect('/admin');
  });
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