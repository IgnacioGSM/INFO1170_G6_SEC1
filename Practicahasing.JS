const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// Ruta para mostrar el formulario de registro
app.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para manejar el registro
app.post('/register', async (req, res) => {
    const { password } = req.body;

    try {
        // Hashing con salt (genera automáticamente una salt)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar el usuario en la base de datos (ficticio en este ejemplo)
        console.log("Contraseña Hasheada:", hashedPassword);

        res.send('Usuario registrado exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al registrar usuario');
    }
});

// Ruta para mostrar el formulario de inicio de sesión
app.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para manejar el inicio de sesión
app.post('/login', async (req, res) => {
    const { password, storedHashedPassword } = req.body; // Supón que el hashed password viene de tu base de datos

    try {
        const isMatch = await bcrypt.compare(password, storedHashedPassword);
        
        if (isMatch) {
            res.send('Inicio de sesión exitoso');
        } else {
            res.status(400).send('Contraseña incorrecta');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el proceso de autenticación');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
