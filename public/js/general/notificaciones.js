console.log("obteniendo id de usuario");

function activarToast(mensaje, link) {  // Link corresponde a la id de la solicitud, igual que en el dropdown
    console.log("activando toast");
    // Cambia el mensaje del toast
    let toastBody = document.getElementById("toast-body");
    toastBody.innerHTML = mensaje +'<a id="toast-link" href="#" class="btn btn-primary">Ver solicitud</a>';

    let toastLink = document.getElementById("toast-link");
    toastLink.href = "/mis_solicitudes/solicitud?idsoli=" + link;

    // inicializar el toast
    let toastElement = document.getElementById("notifToast");
    let toast = new bootstrap.Toast(toastElement, {
        animation: true,
        autohide: true,
        delay: 5000
    });

    toast.show()
}

function socketConfig(socket) {
    console.log("socket listo :3");
    // Al recibir updatenotifs, actualiza la lista de notificaciones en el dropdown del header
    socket.on('updatenotifs', (notificaciones) => {
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
                        // Crear un elemento de lista con un enlace a la solicitud correspondiente
                        console.log("Data obtenida:", data);
                        console.log("Notificación:", notif);
                        let idSoli = data.idsoli;
                        let notif_element = document.createElement("li");
                        let notif_link = document.createElement("a");
                        notif_link.className = "dropdown-item d-flex align-items-center gap-2 py-2";
                        notif_link.href = "/mis_solicitudes/solicitud?idsoli=" + idSoli;

                        if (notif.leido == 1) { 
                            notif_link.innerHTML = notif.mensaje;
                        } else if (notif.leido == 0) {
                            notif_link.classList.add("no-leida");
                            notif_link.innerHTML = 
                                notif.mensaje +
                                "<span class='d-inline-block bg-success rounded-circle p-1'></span>";
                        } else {
                        console.log("Valor inesperado para 'leido':", notif.leido);
                        }

                        notif_element.appendChild(notif_link);
                        notificaciones_list.appendChild(notif_element);

                        // Ahora el dropdown con notificaciones está listo
                        // Al hacer click en una notificación, además de llevar a la solicitud se marca como leída
                        notif_link.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (notif_link.classList.contains("no-leida")) {
                                fetch('/mis_solicitudes/marcar-leida?idnoti=' + notif.idnoti)
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.error) {
                                            console.error("Error al marcar notificación como leída:", data.error);
                                        } else {
                                            console.log("Notificación marcada como leída:", data);
                                            window.location.href = notif_link.href;
                                        }
                                    })
                                    .catch(error => console.error("Error al marcar notificación como leída:", error));
                            } else {
                                console.log("Notificación ya leída");
                                window.location.href = notif_link.href;
                            }
                        });

                    })
                    .catch(error => console.error("Error al obtener las notificaciones:", error));
            }
        }
    });

    socket.on('newnotif', (notif) => {
        fetch('/mis_solicitudes/id-soli-from-respuesta?idrespuesta=' + notif.idrespuesta)
            .then(response => response.json())
            .then(data => {
                activarToast(notif.mensaje, data.idsoli);
            })
            .catch(error => console.error("Error en el fetch:", error));
    });


    // Notificación al presionar el botón de test
    /*  Esto no se usa, era solo para probar el envío de notificaciones
    socket.on('testnotif', (notif) => {
        console.log("Nueva notificación recibida");
        console.log(notif);
        // Agregar la notificación al dropdown (esto no se hará normalmente, al recibir notificación se hará updatenotifs y newnotif)
        fetch('/mis_solicitudes/id-soli-from-respuesta?idrespuesta=' + notif.idrespuesta)
            .then(response => response.json())
            .then(data => {
                console.log("Data obtenida:", data);
                console.log("Notificación:", notif);
                let idSoli = data.idsoli;
                let notificaciones_list = document.getElementById("header-notifs-menu");
                let notif_element = document.createElement("li");
                let notif_link = document.createElement("a");
                notif_link.className = "dropdown-item d-flex align-items-center gap-2 py-2";
                notif_link.href = "/mis_solicitudes/solicitud?idsoli=" + idSoli;

                if (notif.leido == 1) {
                    notif_link.innerHTML = notif.mensaje;
                } else if (notif.leido == 0) {
                    notif_link.innerHTML =
                        notif.mensaje +
                        "<span class='d-inline-block bg-success rounded-circle p-1'></span>";
                } else {
                    console.log("Valor inesperado para 'leido':", notif.leido);
                }

                notif_element.appendChild(notif_link);
                notificaciones_list.insertBefore(notif_element, notificaciones_list.firstChild);

                // Además muestra un toast con el mensaje de la notificación
                activarToast(notif.mensaje, idSoli);
            })
            .catch(error => console.error("Error en el fetch:", error));
    });*/
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

    socketConfig(socket);
}

obtenerIdUsuarioySocket();