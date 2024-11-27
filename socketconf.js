module.exports = (io) => {
    const db = require('./database'); // Conexión a la base de datos

    io.on('connection', (socket) => {
        const userid = socket.handshake.query.userid; // Recibe el ID del usuario autenticado
        console.log('Usuario conectado:', userid);

        if (userid && userid !== 'false') { // Validar usuario autenticado
            socket.join(userid); // Unir al usuario a su sala
            console.log(`Obteniendo notificaciones para el usuario ${userid}`);

            // Obtener notificaciones del usuario al conectar
            db.query(
                "SELECT * FROM Notificacion WHERE idusuario = ? ORDER BY idnoti DESC",
                [userid],
                (err, result) => {
                    if (err) {
                        console.error("Error al obtener notificaciones:", err);
                    } else {
                        console.log("Notificaciones obtenidas:", result);
                        io.to(userid).emit('updatenotifs', result); // Emitir las notificaciones
                    }
                }
            );

            // Evento: Recepción de una nueva notificación (ejemplo)
            socket.on('respuestanotif', (notif) => {
                const { idusuario, mensaje } = notif; // Extraer información
                if (idusuario && mensaje) {
                    db.query(
                        "INSERT INTO Notificacion (idusuario, mensaje, leido, fecha) VALUES (?, ?, 0, NOW())",
                        [idusuario, mensaje],
                        (err, result) => {
                            if (err) {
                                console.error("Error al insertar notificación:", err);
                            } else {
                                console.log("Notificación enviada a:", idusuario);
                                io.to(idusuario).emit('newnotif', notif); // Notificar al usuario objetivo
                            }
                        }
                    );
                } else {
                    console.error("Datos de notificación incompletos:", notif);
                }
            });

            // Evento: Test de notificaciones (para pruebas)
            socket.on('botontestToast', () => {
                console.log("Botón de prueba presionado");
                db.query("SELECT * FROM Notificacion LIMIT 1", (err, result) => {
                    if (err) {
                        console.error("Error en prueba de notificaciones:", err);
                    } else if (result && result.length > 0) {
                        console.log("Notificación de prueba enviada");
                        io.to(userid).emit('testnotif', result[0]);
                    }
                });
            });
        }

        // Evento: Desconexión
        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${userid}`);
        });
    });
};
