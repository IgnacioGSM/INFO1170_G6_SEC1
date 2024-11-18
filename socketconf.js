module.exports = (io) => {
    const db = require('./database');

    io.on('connection', (socket) => {
        const userid = socket.handshake.query.userid;   // Recibe el id (como string) del usuario autenticado
        console.log('Usuario conectado: ', userid);

        if (userid != 'false') {   // Si el usuario está autenticado
            socket.join(userid);    // Unirse a la sala del usuario, para recibir solo sus notificaciones
            console.log("obteniendo notificaciones de usuario: ", userid);

            let query = "SELECT * FROM Notificacion WHERE idusuario = ? ORDER BY fecha DESC";
            db.query(query, [userid], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Notificaciones obtenidas");
                    io.to(userid).emit('notificaciones', result);
                }
            });
        }

        socket.on('botontestToast', (test) => {
            console.log("Botón de test de toast presionado");
            db.query("SELECT * FROM Notificacion WHERE idnoti = 1", (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Notificacion de prueba obtenida");
                    io.to(userid).emit('newnotif', result[0]);
                }
            });
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });
}