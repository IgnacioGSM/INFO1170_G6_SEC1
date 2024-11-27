const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../database.js');
const fs = require('fs');
const { error } = require('console');
const { render } = require('ejs');
const { send } = require('process');

// Verificar y crear la carpeta 'uploads' si no existe
if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}
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
            res.render('perfilUsuario', {
                user:req.session.usuario ,
                usuario: result[0], 
                currentPage: 'perfil'
            });
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
        if (results.length === 0) return res.status(404).send('usuario no encontrado');

        const storedPassword = results[0].contrasenia;
        bcrypt.compare(confirmarCorreo, storedPassword, (err, isMatch) => {
            if (err) return res.status(500).send('Error en el servidor');
            if (!isMatch) {
                return res.render('cambiarcorreo', {user: userId, error: 'Contraseña incorrecta', success: null});
            }

            db.query('UPDATE Usuario SET correoelectronico = ? WHERE idusuario = ?', [nuevoCorreo, userId], (error) =>{
                if (error) {
                    console.error('A ocurrido un error en el servidor', error);
                    return res.render('cambiarcorreo', {user: userId, error: 'Error al actualizar el correo', success: null});
                }
                res.render('cambiarcorreo', {user: userId, error: null, success: 'Tu correo ha sido actualizado'});
            });
        });
    });
});

router.post('/cambiartelefono', (req, res) => {
    const {nuevoTelefono, confirmarTelefono} = req.body;
    const userId = req.session.usuario.idusuario;

    db.query('SELECT contrasenia FROM Usuario WHERE idusuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');
        if (results.length === 0) return res.status(404).send('Usuario no encontrado');

        const storedPassword = results[0].contrasenia;
        bcrypt.compare(confirmarTelefono, storedPassword, (err, isMatch) => {
            if (err) return res.status(500).send('Error en el servidor');
            if (!isMatch) {
                return res.render('perfilUsuario', {user: req.session.usuario, error: 'Contraseña incorrecta', currentPage: 'perfil', success: null});
            }

            db.query('UPDATE Usuario SET numerotelefono = ? WHERE idusuario = ?', [nuevoTelefono, userId], (error) =>{
                if (error) {
                    console.error('Error por parte del servidor', error);
                    return res.render('perfilUsuario', {user: req.session.usuario, error: 'Error al actualizar el numero telefonico', currentPage: 'perfil', success: null});
                }
                res.render('perfilUsuario', {user: req.session.usuario, error: null, currentPage: 'perfil', success: 'Tu numero de telefono se ha actualizado'});
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
            if (results.length === 0) return res.status(404).send('Usuario no encontrado');
    
            const storedPassword = results[0].contrasenia;
            bcrypt.compare(contraseñaActual, storedPassword, (err, isMatch) => {    // Luego se revisa que la contraseña actual esté correcta
                if (err) return res.status(500).send('Error en el servidor');
                if (!isMatch) {
                    return res.render('cambiarcontrasenia', {user: userId, error: 'Tu contraseña actual es incorrecta', currentPage: 'perfil', success: null});
                }

                bcrypt.hash(nuevaContraseña, 10, (err, hash) => {                   // Se encripta la nueva contraseña y se actualiza en la base de datos
                    if (err) return res.status(500).send('Error en el servidor');
                    db.query('UPDATE Usuario SET contrasenia = ? WHERE idusuario = ?', [hash, userId], (error) =>{
                        if (error) {
                            return res.render('cambiarcontrasenia', {user: userId, error: 'Error al actualizar la contraseña', currentPage: 'perfil', success: null});
                        }
                        res.render('cambiarcontrasenia', {user: userId, error: null, currentPage: 'perfil', success: 'tu contraseña se ha actualizado'});
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
                    return res.status(500).send('Error al eliminar el archivo');
                }
                res.send('Expediente eliminado correctamente');
            });
        });
    });
});

router.post('/enviarVal', (req, res) => {
    const userId = req.session.usuario.idusuario;
    const rating = req.body.rating;

    if (!userId) {
        return res.status(401).send('usuario no autenticado');
    }
    if (!rating || isNaN(rating) || rating < 1 || rating > 5){
        return res.status(400).send('Valoracion no valida');
    }

    const query = 'INSERT INTO Valoraciones (userId, rating) VALUES (?, ?)';
    db.query(query, [userId, rating], (error, results) => {
        if (error){
            console.error('Error al enviar la valoracion');
            return res.status(500).send('Error al eviar la valoracion');
        }
        res.redirect('/perfilUsuario');
    });
});

router.get('/perfilUsuario', (req, res) => {
    const userId = req.session.usuario;

    const query = 'SELECT AVG(Valoracion) As promedio from Valoraciones WHERE idusuario = ?';
    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error al obtener la valoracion promedio', error);
            return res.status(500).send('Error al cargar el perfil')
        }

        const promedio = results[0].promedio ? results[0].promedio.toFixed(2): 'No hay valoraciones';
        res.render('perfilUsuario', {usuario: req.session.usuario, promedio});
    });
});

router.post('/upload', upload.single('perfilFot'), (req, res) => {
    const userId = req.session.usuario.idusuario;

    if (!req.file){
        return res.status(400).send('No se subio foto')
    }
    if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).send('Solo se permiten imagenes');
    }

    const fotoURL = `/uploads/${req.file.filename}`;

    db.query('UPDATE Usuario SET fotourl = ? WHERE idusuario = ?', [fotoURL, userId], (err, result) => {
        if(err){
            console.error('Error al subir la foto', err);
            return res.status(500).send('Error en el servidor');
        }
        res.send('foto de perfil subida');
    });
});

//falta revision
router.get('/perfilUsuario', (req, res) => {
    const userId = req.session.usuario.idusuario;
    db.query('SELECT fotourl FROM Usuario WHERE id = ?', [userId], (err, results) => {
        if(err) throw err;
        res.render('perfilUsuario', {user: results[0]});
    });
});

/*
//posible reeconfiguracion para manejar la subida de foto perfil


const storage2 = multer.diskStorage ({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/uploads/profile_pictures');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {recursive:true});
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName)
    }
});

const upload2 = multer({
    storage2,
    limits: {fileSize: 2*1024*1024},
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname){
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imagenes de...'));
    }
});

router.post('/upload2', upload.single('perfilFot'), (req, res) => {
    if (!req.file){
        return res.status(400).send('No se subio ninguna foto');
    }

    const fotoURL = `/uploads/profile_picture/${req.file.filename}`;
    const userId = req.session.usuario.idusuario;

    db.query(
        'UPDATE Usuario SET foto_perfil = ? WHERE id = ?',
        [fotoURL, userId],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error al actualizar la foto');
            }
            res.redirect('/perfilUsuario');
        }
    );
});
*/

module.exports = router;