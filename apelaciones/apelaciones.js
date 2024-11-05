const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Configuración de la aplicación
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para recibir las apelaciones
app.post('/enviar-apelacion', (req, res) => {
    const { nombre, email, numeroCita, motivo } = req.body;

    // Configura el transporte de nodemailer (Usando Gmail en este caso)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tu-email@gmail.com', // Reemplaza con tu email
            pass: 'tu-password'         // Reemplaza con tu contraseña de correo (O utiliza OAuth2 si es necesario)
        }
    });

    // Contenido del correo
    let mailOptions = {
        from: 'tu-email@gmail.com',           // Remitente
        to: 'destinatario@gmail.com',         // Destinatario
        subject: 'Nueva Apelación Recibida',
        text: `
            Nombre: ${nombre}
            Correo: ${email}
            Número de Cita: ${numeroCita}
            Motivo de la Apelación: ${motivo}
        `,
        html: `
            <h3>Nueva Apelación</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Correo:</strong> ${email}</p>
            <p><strong>Número de Cita:</strong> ${numeroCita}</p>
            <p><strong>Motivo de la Apelación:</strong> ${motivo}</p>
        `
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error al enviar el correo.');
        }
        console.log('Correo enviado: ' + info.response);
        res.status(200).send('Apelación enviada con éxito.');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
