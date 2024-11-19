const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database.js');

router.get('/', (req, res) => {
    if (req.session.loggeado) {
        res.redirect('/');
    } else {
        const userError ={TextContent: '', display: 'none'};
        const passwordError ={TextContent: '', display: 'none'};
        res.render('iniciosesion', {user: 0, userError, passwordError, currentPage: 'login'});
    }
});

router.post('/', (req, res) => {
    const {rut, password } = req.body;
    const userError ={TextContent: '', display: 'none'};
    const passwordError ={TextContent: '', display: 'none'};
    try {
        db.query('SELECT * FROM Usuario WHERE rut = ?', [rut], (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length == 0) {
                console.log("Usuario no encontrado");
                userError.TextContent = "Usuario no encontrado";
                userError.display = 'block';
                res.render('iniciosesion', {user: 0, userError, passwordError, currentPage: 'login'});
            } else {
                // Si el usuario existe, se compara la contraseña
                bcrypt.compare(password, result[0].contrasenia, (err, response) => {
                    if (response) {
                        req.session.loggeado = true;
                        req.session.usuario = result[0];
                        res.redirect('/');
                    } else {
                        console.log("Contraseña incorrecta");
                        passwordError.TextContent = "Contraseña incorrecta";
                        passwordError.display = 'block';
                        res.render('iniciosesion', {user: 0, userError, passwordError, currentPage: 'login'});
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