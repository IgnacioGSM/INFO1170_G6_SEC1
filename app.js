const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

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

app.use(express.static('public'));

app.post('/register', (req, res) => {
    const {Nombre, rut, correo, contraseña} = req.body;

    const query = 'INSERT INTO usuarios (Nombre, rut, correo, contraseña) VALUES (?, ?, ?, ?)';

    bd.query(query, [Nombre, rut, correo, contraseña], (err, result) =>{
        if (err){
            console.error('Error al registrar el usuario', err);
            return res.status(500).send('Error en el servidor');
        }
        console.log('Usuario registrado');
        res.send('Registro exitosos');
    });
});

app.listen(3000, () =>{
    console.log('Servidor escuchando en http://localhost:3000');
});