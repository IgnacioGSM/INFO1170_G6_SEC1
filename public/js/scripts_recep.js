document.addEventListener("DOMContentLoaded", function() {
    const modalElement = document.getElementById('solicitudModal');
    const bootstrapModal = new bootstrap.Modal(modalElement);

    // Mostrar/Ocultar el menú de navegación con Bootstrap
    const toggleMenuButton = document.getElementById("toggle-menu-button");
    const navMenu = document.getElementById("nav-menu");

    toggleMenuButton.addEventListener("click", function(event) {
        event.stopPropagation();
        navMenu.classList.toggle("d-none");
    });

    document.addEventListener("click", function(event) {
        if (!navMenu.contains(event.target) && event.target !== toggleMenuButton) {
            navMenu.classList.add("d-none");
        }
    });

    // Función para ocultar todas las secciones
    function hideAllSections() {
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => section.classList.add("d-none"));  // Usamos 'd-none' para ocultar
    }

    // Función para mostrar una sección específica
    function showSection(sectionId) {
        hideAllSections();  // Ocultamos todas
        document.getElementById(sectionId).classList.remove("d-none");  // Mostramos la seleccionada
    }

    // Redirigir a index.html al hacer clic en el botón "Inicio"
    document.getElementById("btn-inicio").addEventListener("click", function() {
        window.location.href = "/";  // Redirige a la página index.html
    });

    // Redirigir a perfilUsuario.html al hacer clic en el botón "Perfil"
    document.getElementById("btn-perfil").addEventListener("click", function() {
        window.location.href = "perfilUsuario";  // Redirige a la página perfilUsuario.html
    });

    // Funcionalidad para los botones de navegación
    document.getElementById("btn-home").addEventListener("click", function() {
        showSection("home-view");
        updateActiveMenu(this);
    });

    document.getElementById("btn-gestion").addEventListener("click", function() {
        showSection("gestion-registros");
        updateActiveMenu(this);
    });

    document.getElementById("btn-solicitudes").addEventListener("click", function() {
        showSection("recepcion-solicitudes");
        updateActiveMenu(this);
    });

    document.getElementById("btn-historial").addEventListener("click", function() {
        showSection("historial-solicitudes");
        updateActiveMenu(this);
    });

    document.getElementById("btn-perfil").addEventListener("click", function() {
        showSection("perfil-view");
        updateActiveMenu(this);
    });

    // Función para actualizar el menú activo
    function updateActiveMenu(button) {
        const buttons = document.querySelectorAll("#nav-menu button");
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    }

    // Función para mostrar el modal y configurar la acción
    function mostrarModal(tipo, button) {
        const aceptarContent = document.getElementById('aceptar-content');
        const rechazarContent = document.getElementById('rechazar-content');
        const modalAceptarBtn = document.getElementById('modal-aceptar-btn');

        aceptarContent.classList.add('d-none');
        rechazarContent.classList.add('d-none');

        if (tipo === 'aceptar') {
            aceptarContent.classList.remove('d-none');
            modalAceptarBtn.onclick = function() {
                const puesto = document.getElementById('puesto-input').value.trim();
                const comentario = document.getElementById('comentario-input').value.trim();

                if (puesto !== "") {
                    alert(`Puesto asignado: ${puesto}\nComentario: ${comentario || 'Ninguno'}`);
                    button.closest('tr').remove();  // Simular que la solicitud fue atendida
                    bootstrapModal.hide();
                } else {
                    alert("Por favor asigna un puesto.");
                }
            };
        } else if (tipo === 'rechazar') {
            rechazarContent.classList.remove('d-none');
            modalAceptarBtn.onclick = function() {
                const motivo = document.getElementById('motivo-input').value.trim();

                if (motivo !== "") {
                    alert(`Solicitud rechazada. Motivo: ${motivo}`);
                    button.closest('tr').remove();  // Simular que la solicitud fue rechazada
                    bootstrapModal.hide();
                } else {
                    alert("Por favor proporciona un motivo de rechazo.");
                }
            };
        }

        // Mostrar el modal
        bootstrapModal.show();
    }

    // Función para mostrar el modal de reporte
    function mostrarModalReporte(button) {
        const reportarModalElement = document.getElementById('reportarModal');
        const bootstrapReportarModal = new bootstrap.Modal(reportarModalElement);
        const modalReportarBtn = document.getElementById('modal-reportar-btn');

        modalReportarBtn.onclick = function() {
            const motivo = document.getElementById('motivo-reporte').value;
            const comentario = document.getElementById('comentario-reporte').value.trim();

            alert(`Reporte enviado.\nMotivo: ${motivo}\nComentario: ${comentario || 'Ninguno'}`);
            button.closest('tr').remove();  // Simular que la solicitud fue reportada
            bootstrapReportarModal.hide();
        };

        // Mostrar el modal
        bootstrapReportarModal.show();
    }

    // Delegación de eventos para los botones de aceptar, rechazar y reportar dentro de la tabla de solicitudes
    document.getElementById('recepcion-solicitudes').addEventListener('click', function(event) {
        const target = event.target;

        // Verificar si se ha hecho clic en un botón de aceptar, rechazar o reportar
        if (target.classList.contains('btn-aceptar')) {
            mostrarModal('aceptar', target);
        } else if (target.classList.contains('btn-rechazar')) {
            mostrarModal('rechazar', target);
        } else if (target.classList.contains('btn-reportar')) {
            mostrarModalReporte(target);
        }
    });

    // Validación de formularios
    function validateForm(form) {
        const inputs = form.querySelectorAll("input, textarea");
        let isValid = true;

        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                isValid = false;
                input.classList.add("is-invalid");
            } else {
                input.classList.remove("is-invalid");
            }
        });

        return isValid;
    }

    // Validación en la sección de "Gestión de Registros"
    document.getElementById("gestion-form").addEventListener("submit", function(event) {
        event.preventDefault();
        if (validateForm(this)) {
            alert("Formulario de gestión enviado correctamente.");
        } else {
            alert("Por favor, completa todos los campos requeridos.");
        }
    });

    // Validación de perfil
    document.getElementById("perfil-form").addEventListener("submit", function(event) {
        event.preventDefault();
        if (validateForm(this)) {
            alert("Perfil actualizado correctamente.");
        } else {
            alert("Por favor, completa todos los campos requeridos.");
        }
    });

    // Función para búsqueda y filtrado de solicitudes
    document.getElementById("search-solicitudes").addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        const solicitudes = document.querySelectorAll("#recepcion-solicitudes .solicitud");

        solicitudes.forEach(solicitud => {
            const text = solicitud.textContent.toLowerCase();
            solicitud.style.display = text.includes(searchTerm) ? "" : "none";
        });
    });

    // Manejo de subida de archivos PDF
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function() {
            if (this.files[0]) {
                alert("Archivo " + this.files[0].name + " cargado exitosamente.");
            }
        });
    });

    // Función para agregar un registro a la tabla de espera
    function agregarRegistro() {
        const table = document.getElementById("tabla-espera");
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = "Nuevo Registro";
        cell2.textContent = "Pendiente";
        cell3.innerHTML = '<button class="btn btn-primary btn-aceptar">Aceptar</button> <button class="btn btn-danger btn-rechazar">Rechazar</button>';
    }

    // Función para editar un registro
    function editRegistro(button) {
        const row = button.closest('tr');
        const cells = row.querySelectorAll('td');
        cells[0].textContent = prompt("Editar nombre:", cells[0].textContent);
        cells[1].textContent = prompt("Editar estado:", cells[1].textContent);
    }

    // Función para eliminar un registro
    function deleteRegistro(button) {
        const row = button.closest('tr');
        row.remove();
    }

    // Función para resetear las secciones
    function resetearSecciones() {
        hideAllSections();
        showSection("home-view");
    }

    // Función para notificaciones en tiempo real
    function showNotification(action) {
        const notification = document.createElement("div");
        notification.className = "alert alert-info";
        notification.textContent = `Acción realizada: ${action}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Función para mostrar el modal de aceptar solicitud
    function mostrarModalAceptar(button) {
        const modalElement = document.getElementById('solicitudModal');
        const bootstrapModal = new bootstrap.Modal(modalElement);
        const aceptarContent = document.getElementById('aceptar-content');
        const rechazarContent = document.getElementById('rechazar-content');
        const modalAceptarBtn = document.getElementById('modal-aceptar-btn');

        aceptarContent.classList.remove('d-none');
        rechazarContent.classList.add('d-none');

        modalAceptarBtn.onclick = function() {
            const puesto = document.getElementById('puesto-input').value.trim();
            const comentario = document.getElementById('comentario-input').value.trim();

            if (puesto !== "") {
                alert(`Puesto asignado: ${puesto}\nComentario: ${comentario || 'Ninguno'}`);
                button.closest('tr').remove();  // Simular que la solicitud fue atendida
                bootstrapModal.hide();
            } else {
                alert("Por favor asigna un puesto.");
            }
        };

        bootstrapModal.show();
    }

    // Función para mostrar el modal de rechazar solicitud
    function mostrarModalRechazar(button) {
        const modalElement = document.getElementById('solicitudModal');
        const bootstrapModal = new bootstrap.Modal(modalElement);
        const aceptarContent = document.getElementById('aceptar-content');
        const rechazarContent = document.getElementById('rechazar-content');
        const modalAceptarBtn = document.getElementById('modal-aceptar-btn');

        aceptarContent.classList.add('d-none');
        rechazarContent.classList.remove('d-none');

        modalAceptarBtn.onclick = function() {
            const motivo = document.getElementById('motivo-input').value.trim();

            if (motivo !== "") {
                alert(`Solicitud rechazada. Motivo: ${motivo}`);
                button.closest('tr').remove();  // Simular que la solicitud fue rechazada
                bootstrapModal.hide();
            } else {
                alert("Por favor proporciona un motivo de rechazo.");
            }
        };

        bootstrapModal.show();
    }

    // Función para mostrar el modal de reporte solicitud
    function mostrarModalReporteSolicitud(button) {
        const modalElement = document.getElementById('reportarModal');
        const bootstrapModal = new bootstrap.Modal(modalElement);
        const modalReportarBtn = document.getElementById('modal-reportar-btn');

        modalReportarBtn.onclick = function() {
            const motivo = document.getElementById('motivo-reporte').value;
            const comentario = document.getElementById('comentario-reporte').value.trim();

            alert(`Reporte enviado.\nMotivo: ${motivo}\nComentario: ${comentario || 'Ninguno'}`);
            button.closest('tr').remove();  // Simular que la solicitud fue reportada
            bootstrapModal.hide();
        };

        bootstrapModal.show();
    }

    // Delegación de eventos para los botones de aceptar, rechazar y reportar dentro de la tabla de solicitudes
    document.getElementById('recepcion-solicitudes').addEventListener('click', function(event) {
        const target = event.target;

        // Verificar si se ha hecho clic en un botón de aceptar, rechazar o reportar
        if (target.classList.contains('btn-aceptar')) {
            mostrarModalAceptar(target);
        } else if (target.classList.contains('btn-rechazar')) {
            mostrarModalRechazar(target);
        } else if (target.classList.contains('btn-reportar')) {
            mostrarModalReporteSolicitud(target);
        }
    });

    // Mostrar/Ocultar el menú de perfil
    document.getElementById("profile-button").addEventListener("click", function() {
        const profileMenu = document.getElementById("profile-menu");
        profileMenu.classList.toggle("d-none");  // Mostrar/ocultar el menú de perfil
    });

    // Ocultar el menú de perfil si se hace clic fuera
    document.addEventListener("click", function(event) {
        const profileMenu = document.getElementById("profile-menu");
        const profileButton = document.getElementById("profile-button");

        if (!profileMenu.contains(event.target) && event.target !== profileButton) {
            profileMenu.classList.add("d-none");
        }
    });
});