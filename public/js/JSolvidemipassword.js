const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitrack'
});


const bodyParser = require('body-parser');

app.use(express.json());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname));





// Cambiar contraseña (olvidé mi contraseña)
app.post('/forgot-password', async (req, res) => {
    const { CorreoElectronico, NuevaContrasenia } = req.body;

    // Verificar si el correo existe
    db.query('SELECT * FROM Usuario WHERE CorreoElectronico = ?', [CorreoElectronico], async (err, results) => {
        if (err) return res.status(500).send('Error en el servidor');
        if (results.length === 0) return res.status(400).send('Correo no encontrado');

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(NuevaContrasenia, 10);

        // Actualizar contraseña
        db.query('UPDATE Usuario SET Contrasenia = ? WHERE CorreoElectronico = ?', [hashedPassword, CorreoElectronico], (err, result) => {
            if (err) return res.status(500).send('Error al actualizar la contraseña');
            res.status(200).send('Contraseña actualizada exitosamente');
        });
    });
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});
