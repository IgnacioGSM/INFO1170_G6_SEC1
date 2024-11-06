const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../database.js');

// Configuración de multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/'); // Carpeta donde se almacenarán los archivos
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
    }
  });
const upload = multer({ storage: storage });

router.get('/', (req,res) =>{
    const userId = req.session.usuario.idusuario;

    const query = 'SELECT nombre, apellido, correoelectronico, rut, numerotelefono FROM Usuario WHERE idusuario = ?';

    db.query(query, [userId], (err, result) =>{
        if (err){
            console.error('Error al obtener los datos del usuario: ', err);
            return res.status(500).send('Error al obtener los datos del usuario');
        }

        if (result.length > 0){
            res.render('perfilUsuario', {user:req.session.usuario ,usuario: result[0]});
        }else{
            res.status(404).send('Usuario no encontrado');
        }
    });
});

router.post('/cambiarcorreo', (req, res) => {
    const {nuevoCorreo, confirmarCorreo} = req.body;
    const userId = req.session.usuario.idusuario;

    db.query('SELECT contrasenia FROM Usuario WHERE idusuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        bcrypt.compare(confirmarCorreo, storedPassword, (err, isMatch) => {
            if (err) return res.status(500).send('Error en el servidor');
            if (!isMatch) return res.status(400).send('Contraseña incorrecta');

            db.query('UPDATE Usuario SET correoelectronico = ? WHERE idusuario = ?', [nuevoCorreo, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar el correo');
                res.send('Correo actualizado');
            });
        });
    });
});

router.post('/cambiartelefono', (req, res) => {
    const {nuevoTelefono, confirmarTelefono} = req.body;
    const userId = req.session.usuario.idusuario;

    db.query('SELECT contrasenia FROM Usuario WHERE idusuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        bcrypt.compare(confirmarTelefono, storedPassword, (err, isMatch) => {
            if (err) return res.status(500).send('Error en el servidor');
            if (!isMatch) return res.status(400).send('Contraseña incorrecta');

            db.query('UPDATE Usuario SET numerotelefono = ? WHERE idusuario = ?', [nuevoTelefono, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar el telefono');
                res.send('Telefono actualizado');
            });
        });
    });
});

router.post('/cambiarcontrasenia', (req, res) => {
    const {nuevaContraseña, confirmarContraseña, contraseñaActual} = req.body;
    const userId = req.session.usuario.idusuario;

    if (nuevaContraseña == confirmarContraseña) {  // Primero se revisa que se haya ingresado la misma contraseña nueva
        db.query('SELECT contrasenia FROM Usuario WHERE idusuario = ?', [userId], (error, results) => {
            if (error) return res.status(500).send('Error en el servidor');
    
            const storedPassword = results[0].contrasenia;
            bcrypt.compare(contraseñaActual, storedPassword, (err, isMatch) => {    // Luego se revisa que la contraseña actual esté correcta
                if (err) return res.status(500).send('Error en el servidor');
                if (!isMatch) return res.status(400).send('Contraseña actual incorrecta');

                bcrypt.hash(nuevaContraseña, 10, (err, hash) => {                   // Se encripta la nueva contraseña y se actualiza en la base de datos
                    if (err) return res.status(500).send('Error en el servidor');
                    db.query('UPDATE Usuario SET contrasenia = ? WHERE idusuario = ?', [hash, userId], (error) =>{
                        if (error) return res.status(500).send('Error al actualizar la contraseña');
                        res.send('Contraseña actualizada');
                    });
                });
            });
    });
    } else {
        res.send('Las contraseñas no coinciden');
    }
});

module.exports = router;