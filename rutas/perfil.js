const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../database.js');
const fs = require('fs');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/'); // Carpeta donde se almacenarán los archivos
    },
    filename: (req, file, cb) => {
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

router.post('/envexp', upload.array('archivo[]'), (req, res) => {
    const userId = req.session.usuario.idusuario;
    const archivos = req.files;

    if(!archivos || archivos.length === 0){
        return res.status(400).send('No se subió ningún archivo');
    }

    archivos.forEach((archivo)=>{
        const query = 'INSERT INTO ExpedienteMedico(idusuario, nombre_archivo, ruta_archivo) VALUES (?, ?, ?)';
        db.query(query, [userId, archivo.originalname, archivo.path], (err) => {
            if(err){
                console.error('Error al guardar el archivo en la base de datos', err);
                return res.status(500).send('Error en el servidor');
            };
        });
    });
    res.send('Expedientes medicos subidos con exito');
});

//ruta para la lista de expedientes
router.get('/listarExp', (req, res) => {
    const userId = req.session.usuario.idusuario;

    const query = 'SELECT idexpediente, nombre_archivo, ruta_archivo FROM ExpedienteMedico WHERE idusuario = ?';
    db.query(query, [userId], (err, results) => {
        if(err){
            console.error('Error al obtener el expediente', err);
            return res.status(500).send('Error al obtener los expedientes');
        }
        res.json(results);//se envia la lista de expedientes al usuario
    });
});

//ruta para descargar un expediente
router.get('/descargarExp/:id', (req, res) =>{
    const expedienteId = req.params.id;

    const query = 'SELECT ruta_archivo FROM ExpedienteMedico WHERE idexpediente = ?';
    db.query(query, [expedienteId], (err, results) => {
        if(err || results.length === 0){
            console.error('Error al obtener el archivo', err);
            return res.status(404).send('Archivo no encontrado');
        }
        const rutaArch = results[0].ruta_archivo;
        res.download(rutaArch);
    });
});

//ruta para eliminar un expediente
router.delete('/eliminarExp/:id', (req, res) => {
    const expedienteId = req.params.id;

    const query = 'SELECT ruta_archivo FROM ExpedienteMedico WHERE idexpediente = ?';
    db.query(query, [expedienteId], (err, results) => {
        if(err || results.length === 0) {
            console.error('Error al obtener el archivo a eliminar', err);
            return res.status(404).send('Archivo no encontrado')
        }

        const rutaArchivo = results[0].ruta_archivo;
        fs.unlink(rutaArchivo, (err) => {
            if(err) {
                console.error('Error al eliminar el archivo', err);
                return res.status(500).send('Error al eliminar el archivo');
            }

            const deleteQuery = 'DELETE FROM ExpedienteMedico WHERE idexpediente = ?';
            db.query(deleteQuery, [expedienteId], (err) => {
                if (err) {
                    console.error('Error al elinar el archivo de la bd', err);
                    return req.status(500).send('Error al eliminar el archivo');
                }
                res.send('Expediente eliminado correctamente');
            });
        });
    });
});

router.post('/enviarVal', (req, res) => {
    const rating = req.body.rating;
    const userId = req.session.usuario.idusuario;

    db.query('INSERT INTO valoraciones (userId, rating) VALUES (?, ?)', [userId, rating], (err, result) => {
        if(err){
            console.error('Error al guardar la valoracion', err);
            return res.status(500).send('Error al enviar la valoracion');
        }
        res.send('Valoracion enviada con extito');
    });
});

router.post('/upload', upload.single('perfilFot'), (req, res) => {
    const userId = req.session.usuario.idusuario;
    const fotoURL = `/uploads/${req.file.filename}`;

    db.query('UPDATE Usuario SET fotoURL = ? WHERE idusuario = ?', [fotoURL, userId], (err, result) => {
        if(err){
            console.error('Error al subir la foto', err);
            return res.status(500).send('Error en el servidor');
        }
        res.send('foto de perfil subida');
    });
});
/* falta revision
router.get('/perfilUsuario', (req, res) => {
    const userId = req.session.usuario.idusuario;
    db.query('SELECT fotoURL FROM Usuario WHERE id = ?', [userId], (err, results) => {
        if(err) throw err;
        res.render('perfilUsuario', {user: results[0]});
    });
});
*/
module.exports = router;