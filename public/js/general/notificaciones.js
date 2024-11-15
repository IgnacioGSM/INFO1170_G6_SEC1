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
                fetch('/mis_solicitudes/id-soli-from-respuesta?idrespuesta=' + notif.idrespuesta)
                .then(response => response.json())
                .then(data => {
                    let idSoli = data.idsoli;
                    let notif_element = document.createElement("li");
                    notif_link = document.createElement("a");
                    notif_link.className = "dropdown-item";
                    notif_link.href = "/mis_solicitudes/solicitud?idsoli=" + idSoli;
                    notif_link.innerHTML = "<span class='d-inline-block bg-success rounded-circle p-1'></span>" + notif.mensaje;
                    if (notif.leido == 1) {
                        notif_link.classList.add("disabled");
                    }
                    notif_element.appendChild(notif_link);
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
