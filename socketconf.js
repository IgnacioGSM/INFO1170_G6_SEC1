module.exports = (io) => {
    const db = require('./database');

    io.on('connection', (socket) => {
        const userid = socket.handshake.query.userid;   // Recibe el id (como string) del usuario autenticado
        console.log('Usuario conectado: ', userid);

        if (userid != 'false') {   // Si el usuario está autenticado
            socket.join(userid);    // Se une a una sala con el id del usuario
            console.log("obteniendo notificaciones de usuario: ", userid);

            // Al conectarse, se obtienen las notificaciones del usuario
            db.query("SELECT * FROM Notificacion WHERE idusuario = ? ORDER BY idnoti DESC", [userid], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Notificaciones obtenidas");
                    io.to(userid).emit('updatenotifs', result);
                }
            });
        }
        // Cuando el recepcionista responde una solicitud, debería emitir una señal además de modificar la base de datos
        // Acá se recibe y se envía la notificación al usuario correspondiente (el usuario objetivo estará en alguna parte de lo que envía el recepcionista)
        /* ejemplo
        
        socket.on('respuestanotif', (notif) => {
            blablabla...
            io.to(notif.idusuario).emit('newnotif', notif);
            consulta de notificaciones...{
                io.to(notif.idusuario).emit('updatenotifs', result);
            }
        });

        */

        // Este botón es solo para pruebas
        /*socket.on('botontestToast', (test) => {
            console.log("Botón de test de toast presionado");
            db.query("SELECT * FROM Notificacion", (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Notificacion de prueba obtenida");
                    io.to(userid).emit('testnotif', result[0]);
                }
            });
        });*/

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });
}