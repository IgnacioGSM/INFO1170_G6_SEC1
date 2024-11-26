const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database.js');

const saltrounds = 10;

function registrarUsuario(rut, password, correo,req, res) {
    // Esta función se ejecuta cuando el rut no está registrado en la tabla Usuario pero sí en la tabla Persona
    // Osea cuando se puede registrar el usuario
    try {
        bcrypt.hash(password, saltrounds, (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                let query = "INSERT INTO Usuario (rut, correoelectronico, tipousuario, contrasenia)\
                             VALUES (?, ?, 'usuario', ?)";
                db.query(query, [rut, correo, hash], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // Agrega el nombre y apellido desde Persona a Usuario
                        let query = "SELECT nombre, apellido FROM Persona WHERE rut = ?";
                        db.query(query, [rut], (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                let nombre = result[0].nombre;
                                let apellido = result[0].apellido;
                                let query = "UPDATE Usuario SET nombre = ?, apellido = ? WHERE rut = ?";
                                db.query(query, [nombre, apellido, rut], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }
                        });
                        // Por último, se agrega el usuario a la sesión
                        db.query('SELECT * FROM Usuario WHERE rut = ?', [rut], (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            if (result.length === 0) {
                                console.log("Usuario no encontrado");
                                res.send("Usuario no encontrado");
                            } else {
                                req.session.loggeado = true;
                                req.session.usuario = result[0];
                                console.log(req.session.usuario);
                                
                                console.log("Usuario registrado");
                                res.redirect('/');
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
}

router.get('/', (req, res) => {
    if (req.session.loggeado) {
        res.redirect('/');
    } else {
        // La validación de contraseña se realiza en el frontend
        const rutError = {Text: '', Display: 'none'};
        res.render('registro', {user: 0, rutError, currentPage: 'registro'});
    }
});

// Por ahora solo se revisa el rut, la contraseña se ve en frontend y el correo aún no se usa
router.post('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        const {rut, password, correo} = req.body;
        // Se verifica que el rut esté en la tabla Persona
        let query = "SELECT * FROM Persona WHERE rut = ?";
        db.query(query, [rut], (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length === 0) {
                console.log("Rut no encontrado");
                rutError = {Text: 'Rut no encontrado', Display: 'block'};
                res.render('registro', {user: 0, rutError, currentPage: 'registro'});
            } else {
                // Si el rut está en la tabla Persona, se verifica que no esté en la tabla Usuario
                let query = "SELECT * FROM Usuario WHERE rut = ?";
                db.query(query, [rut], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    if (result.length === 0) {
                        console.log("Agregando usuario...");
                        // Si el rut no está en la tabla Usuario, se registra
                        registrarUsuario(rut, password, correo, req, res);
                    } else {
                        console.log("Rut ya registrado");
                        rutError = {Text: 'Este Rut ya está registrado', Display: 'block'};
                        res.render('registro', {user: 0, rutError, currentPage: 'registro'});
                    }
                });
            }
        });
    }
});

module.exports = router;