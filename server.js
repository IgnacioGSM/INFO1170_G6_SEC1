const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'views','index.html'));
});

// Rutas para páginas a las que se accede desde index, direcciones temporales hasta que todas estén bien organizadas
app.get('/iniciosesion', (req, res) => {
  res.sendFile(path.join(__dirname,'iniciosesion.html'));
});

app.get('/registropersona', (req, res) => {
  res.sendFile(path.join(__dirname,'registropersona.html'));
});

app.get('/perfilUsuario', (req, res) => {
  res.sendFile(path.join(__dirname,'perfilUsuario.html'));
});

app.get('/mis_solicitudes', (req, res) => {
  res.sendFile(path.join(__dirname,'mis_solicitudes.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname,'admin.html'));
});

app.get('/inter_recepcionista', (req, res) => {
  res.sendFile(path.join(__dirname,'inter_recepcionista.html'));
});


app.post('/submit_solicitud', (req, res) => {
    console.log(req.body);
    res.sendFile(path.join(__dirname,'views','index.html'));
    });

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
