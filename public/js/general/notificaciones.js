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
        } else {
            for (let i = 0; i < notificaciones.length; i++) {
                let notif = notificaciones[i];
                // Obtener id de la solicitud respondida
                fetch('/id-soli-from-respuesta?idrespuesta=' + notif.idrespuesta)
                .then(response => response.json())
                .then(data => {
                    let idSoli = data.idsoli;
                    let notif_element = document.createElement("li");
                    notif_element.className = "dropdown-item";
                    notif_element.innerHTML = "<a href='/mis_solicitudes/solicitud?idsoli=" + idSoli + "'><span class='d-inline-block bg-success rounded-circle p-1'></span>" + notif.mensaje + "</a>";
                    notificaciones_list.appendChild(notif_element);
                });
            }
        }
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
