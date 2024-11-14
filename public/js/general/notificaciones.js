console.log("obteniendo id de usuario");

function socketListo(socket) {
    console.log("socket listo :3");
    // Al unirse, el servidor envía las notificaciones al cliente
    socket.on('notificaciones', (notificaciones) => {
        console.log("Notificaciones recibidas");
        console.log(notificaciones);
        let notificaciones_list = document.getElementById("header-notifs-menu");    // lista de notificaciones en el dropdown del header
        if (notificaciones.length == 0) {
            notificaciones_list.innerHTML = "<li class='dropdown-item disabled'>No hay notificaciones</li>";
            console.log("No hay notificaciones");
            return;
        }
        // Falta cuando sí hay notificaciones ...
    });
}

async function obtenerIdUsuarioySocket() {
    let response = await fetch('/userid');
    let data = await response.json();
    console.log("id obtenida: ", data.userid);
    
    const socket = io('http://localhost:3000', {
        query: {
            userid: data.userid
        }
    });

    socketListo(socket);
}

obtenerIdUsuarioySocket();
