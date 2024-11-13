const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();


app.use(bodyParser.urlencoded({extended:true}));

const bd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitrack'
});

bd.connect((err) => {
    if (err){
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos mysql');
});

// Configuración de multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/'); // Carpeta donde se almacenarán los archivos
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
    }
});

app.get('/recepcionista/filtrar', (req, res) => {
    const filter = req.query.filter;
    const userId = 4; // Suponiendo que el ID del usuario es 4

    let query = 'SELECT * FROM solicitudes_atendidas WHERE IdUsuario = ?';

    if (filter === 'order') {
        query += ' ORDER BY fecha';
    } else if (filter === 'section') {
        query += ' ORDER BY seccion';
    } else if (filter === 'status') {
        query += ' ORDER BY nombre';
    }

    bd.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error al obtener las solicitudes:', err);
            return res.status(500).send('Error en el servidor');
        }

        res.render('recepcionista', { solicitudes: results });
    });
});

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('index', { user: null });
});



const upload = multer({storage:storage});

app.post('/envexp', upload.array('archivo', 5), (req, res) =>{
    const userId = 4;
    const archivos = req.files;

    if(archivos.length === 0){
        return res.status(400).send('No se subio ningun archivo');
    }
    archivos.forEach((archivo) =>{
        const query = 'INSERT INTO expedientes_medicos (IdUsuario, nombre_archivo, ruta_archivo) VALUES (?, ?, ?)';
        bd.query(query, [userId, archivo.originalname, archivo.path], (err, result) =>{
            if(err){
                console.error('Error al guardar el archivo en la base de datos', err);
                return res.status(500).send('Error en el servidor');
            }
        });
    });
    res.send('Expedientes medicos subidos con exito');
});

app.post('/register', (req, res) => {
    let {Nombre, rut, correo, contraseña} = req.body;
    rut = rut.replace(/[-]/g, '');

    const query = 'INSERT INTO usuario (Nombre, RUT, CorreoElectronico, Contrasenia) VALUES (?, ?, ?, ?)';

    bd.query(query, [Nombre, rut, correo, contraseña], (err, result) =>{
        if (err){
            console.error('Error al registrar el usuario', err);
            return res.status(500).send('Error en el servidor');
        }
        console.log('Usuario registrado');
        res.send('Registro exitosos');
    });
});

app.post('/cambiarcorreo', (req, res) => {
    const {nuevoCorreo, confirmarCorreo} = req.body;
    const userId = 4;

    bd.query('SELECT contrasenia FROM usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (confirmarCorreo == storedPassword) {
            bd.query('UPDATE usuario SET CorreoElectronico = ? WHERE IdUsuario = ?', [nuevoCorreo, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar el correo');
                res.send('Correo actualizado');
            });
        } else {
            res.send("Contraseña incorrecta");
        }
        /*bcrypt.compare(confirmarCorreo, storedPassword, (err, isMatch) => {
            if (err) return res.status(500).send('Error en el servidor');
            if (!isMatch) return res.status(400).send('Contraseña incorrecta');

            connection.query('UPDATE usuarios SET CorreoElectronico = ? WHERE IdUsuario = ?', [nuevoCorreo, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar el correo');
                res.send('Correo actualizado');
            });
        });*/
    });
});

app.post('/cambiartelefono', (req, res) => {
    const {nuevoTelefono, confirmarTelefono} = req.body;
    const userId = 4;

    bd.query('SELECT contrasenia FROM usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (confirmarTelefono == storedPassword) {
            bd.query('UPDATE usuario SET NumeroTelefono = ? WHERE IdUsuario = ?', [nuevoTelefono, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar el telefono');
                res.send('Telefono actualizado');
            });
        } else {
            res.send("Contraseña incorrecta");
        }
    });
});

app.post('/cambiardireccion', (req, res) => {
    const {nuevaDireccion, confirmarDireccion} = req.body;
    const userId = 4;

    bd.query('SELECT contrasenia FROM usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (confirmarDireccion == storedPassword) {
            bd.query('UPDATE usuario SET Direccion = ? WHERE IdUsuario = ?', [nuevaDireccion, userId], (error) =>{
                if (error) return res.status(500).send('Error al actualizar la direccion');
                res.send('Direccion actualizada');
            });
        } else {
            res.send("Contraseña incorrecta");
        }
    });
});

app.post('/cambiarcontraseña', (req, res) => {
    const {nuevaContraseña, confirmarContraseña, contraseñaActual} = req.body;
    const userId = 4;

    bd.query('SELECT contrasenia FROM usuario WHERE IdUsuario = ?', [userId], (error, results) => {
        if (error) return res.status(500).send('Error en el servidor');

        const storedPassword = results[0].contrasenia;
        if (contraseñaActual === storedPassword) {

            if (nuevaContraseña === confirmarContraseña) {

                bd.query('UPDATE usuario SET Contrasenia = ? WHERE IdUsuario = ?', [nuevaContraseña, userId], (error) =>{
                    if (error) return res.status(500).send('Error al actualizar la contraseña');
                    res.send('Contraseña actualizada');
                });
            } else {
                res.send("Contraseña incorrecta");
            }
        } else {
            res.send('La contraseña actual no coincide')
        }
    }); 
});

app.get('/perfilUsuario', (req,res) =>{
    const userId = 4;

    const query = 'SELECT Nombre, CorreoElectronico, RUT, NumeroTelefono FROM usuario WHERE IdUsuario = ?';

    bd.query(query, [userId], (err, result) =>{
        if (err){
            console.error('Error al obtener los datos del usuario: ', err);
            return res.status(500).send('Error al obtener los datos del usuario');
        }

        if (result.length > 0){
            res.render('perfilUsuario', {usuario: result[0]});
        }else{
            res.status(404).send('Usuario no encontrado');
        }
    });
});

/* implementacion al futuro se nesecita corregir la base de datos 
app.post('/enviarvaloracion', (req, res) => {
    const rating = req.body.rating;
    const usuarioID = req.session.userId;

    bd.query('INSERT INTO Valoraciones (userId, rating) VALUES (?, ?)', [usuarioID, rating], (err, result) =>{
        if(err){
            console.error('Error al guardar la valoracion:', err);
            return res.status(500).send('Error al enviar la valoracion');
        }
        res.redirect('/perfil');
    });
});*/

/*
app.post('/borrarcuenta', (req, res) => {
    const usuarioID = req.session.userId;
    const password = req.body.confirmarContra;

    bd.query('DELETE FROM usuarios WHERE id = ?', [usuarioID], (err, result) => {
        if(err){
            console.error('Error eliminando la cuenta:', err);
            return res.status(500).send('Error al borrar la cuenta');
        }
        req.session.destroy();
        res.redirect('/');
    });
});*/

app.get('/hospitales', (req, res) =>{
    const query = `
        SELECT 
            centrosalud.nombre AS nombreHospital,
            centrosalud.latitud AS latitud,
            centrosalud.longitud AS longitud,
            seccion.NombreSeccion AS nombreSeccion,
            COUNT(enespera.idRegistr) AS filasEspera
        FROM 
            centrosalud
        LEFT JOIN 
            seccion ON centrosalud.id = seccion.IdCentro
        LEFT JOIN 
            enespera ON seccion.IdSeccion = enespera.IdSeccion
        GROUP BY 
            centrosalud.id, seccion.IdSeccion;
    `;

    bd.query(query, (err, results) =>{
        if(err){
            console.error('Error al obtener los datos:', err);
            return res.status(500).send('Error en el servidor');
        }
        console.log('Datos obtenidos', results);

        res.render('hospitales', {hospitales: results});
    });
});

app.listen(3000, () =>{
    console.log('Servidor escuchando en http://localhost:3000');
});