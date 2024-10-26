const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database.js');

router.get('/', (req, res) => {
    if (req.session.loggeado) {
        res.redirect('/');
    } else {
        res.render('iniciosesion', {user: 0});
    }
});

router.post('/', (req, res) => {
    const {rut, password } = req.body;
    try {
        db.query('SELECT * FROM Usuario WHERE rut = ?', [rut], (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length == 0) {
                console.log("Usuario no encontrado");
                res.send("Usuario no encontrado");
            } else {
                // Si el usuario existe, se compara la contraseña
                bcrypt.compare(password, result[0].contrasenia, (err, response) => {
                    if (response) {
                        req.session.loggeado = true;
                        req.session.usuario = result[0];
                        res.redirect('/');
                    } else {
                        console.log("Contraseña incorrecta");
                        res.send("Contraseña incorrecta");
                    }
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
  });

module.exports = router;