module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Usuario conectado');

        socket.on('respuesta-soli', (data) => {
            console.log(data);
            io.emit('respuesta-soli', data);
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        });
    });
}