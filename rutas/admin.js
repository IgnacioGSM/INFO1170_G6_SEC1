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
            res.render('admin', { hospitales, user: req.session.usuario, usuarios: [], currentPage: 'admin' });
        });
    } else {
        res.redirect('/');
    }
});

// Ruta para buscar usuarios por tipo de usuario y RUT
router.get('/buscar_usuarios', (req, res) => {
  if (req.session.usuario && req.session.usuario.tipousuario === 'admin') {
      const { rut, tipousuario } = req.query;
      let searchQuery = "SELECT * FROM Usuario WHERE 1=1";
      const params = [];

      if (rut && rut.trim() !== "") {
          searchQuery += " AND rut LIKE ?";
          params.push(`%${rut}%`);
      }

      if (tipousuario && tipousuario.trim() !== "") {
          searchQuery += " AND tipousuario = ?";
          params.push(tipousuario);
      }

      db.query(searchQuery, params, (err, usuarios) => {
          if (err) {
              console.error('Error al buscar usuarios:', err);
              return res.status(500).send('Error al buscar usuarios');
          }

          db.query('SELECT * FROM CentroSalud', (err, hospitales) => {
              if (err) {
                  console.log('Error en la consulta:', err);
                  return res.status(500).send('Error en la consulta');
              }
              res.render('admin', { hospitales, usuarios, user: req.session.usuario, currentPage: 'admin' });
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

// Ruta para mostrar el formulario de agregar hospital
router.get('/agregar_hospital', (req, res) => {
  if (req.session.usuario && req.session.usuario.tipousuario === 'admin') {
    res.render('agregar_hospital', { user: req.session.usuario, error: null, success: null, currentPage: 'admin' });
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
          res.render('agregar_hospital', { user: req.session.usuario, error: 'Error al crear el centro de salud', success: null, currentPage: 'admin' });
      } else {
          res.render('agregar_hospital', { user: req.session.usuario, error: null, success: 'Centro de salud creado exitosamente', currentPage: 'admin' });
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
    res.render('editar_hospital', { hospital, user: req.session.usuario, currentPage: 'admin' }); 
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

// Ruta para mostrar las secciones de un hospital
router.get('/editar_seccion/:idcentro', (req, res) => {
  const idcentro = req.params.idcentro;

  if (req.session.usuario && req.session.usuario.tipousuario === 'admin') {
      const queryHospital = 'SELECT * FROM CentroSalud WHERE idcentro = ?';
      const querySecciones = 'SELECT * FROM Seccion WHERE idcentro = ?';

      db.query(queryHospital, [idcentro], (err, hospitalResults) => {
          if (err || hospitalResults.length === 0) {
              console.error('Error al obtener el hospital:', err);
              return res.status(500).send('Error al obtener el hospital');
          }

          db.query(querySecciones, [idcentro], (err, secciones) => {
              if (err) {
                  console.error('Error al obtener las secciones:', err);
                  return res.status(500).send('Error al obtener las secciones');
              }

              res.render('editar_seccion', {
                  hospital: hospitalResults[0],
                  secciones,
                  user: req.session.usuario,
                  currentPage: 'admin'
              });
          });
      });
  } else {
      res.redirect('/');
  }
});

// Ruta para agregar una nueva sección
router.post('/agregar_seccion', (req, res) => {
  const { idcentro, nombreseccion, idusuario } = req.body;
  const query = 'INSERT INTO Seccion (idcentro, nombreseccion, idusuario) VALUES (?, ?, ?)';

  db.query(query, [idcentro, nombreseccion, idusuario || null], (err) => {
      if (err) {
          console.error('Error al agregar la sección:', err);
          return res.status(500).send('Error al agregar la sección');
      }
      res.redirect(`/admin/editar_seccion/${idcentro}`);
  });
});

// Ruta para editar una sección
router.post('/editar_seccion/:idseccion', (req, res) => {
  const idseccion = req.params.idseccion;
  const { nombreseccion, idusuario } = req.body;
  const query = 'UPDATE Seccion SET nombreseccion = ?, idusuario = ? WHERE idseccion = ?';

  db.query(query, [nombreseccion, idusuario || null, idseccion], (err) => {
      if (err) {
          console.error('Error al editar la sección:', err);
          return res.status(500).send('Error al editar la sección');
      }
      res.redirect('back');
  });
});

// Ruta para eliminar una sección
router.post('/eliminar_seccion/:idseccion', (req, res) => {
  const idseccion = req.params.idseccion;
  const query = 'DELETE FROM Seccion WHERE idseccion = ?';

  db.query(query, [idseccion], (err) => {
      if (err) {
          console.error('Error al eliminar la sección:', err);
          return res.status(500).send('Error al eliminar la sección');
      }
      res.redirect('back');
  });
});
module.exports = router;