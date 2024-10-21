const express = require('express');
const mysql = require('mysql');
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

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta principal para la interfaz de recepcionista
app.get('/recepcionista', async (req, res) => {
    try {
      const solicitudes = await db.query('SELECT * FROM solicitudes'); // Obtener solicitudes de la base de datos
      res.render('recepcionista', { solicitudes });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar las solicitudes');
    }
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

app.get('/views/perfilUsuario', (req,res) =>{
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

app.listen(3000, () =>{
    console.log('Servidor escuchando en http://localhost:3000');
});