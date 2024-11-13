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
                    button.closest('tr').remove();
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
                    button.closest('tr').remove();
                    bootstrapModal.hide();
                } else {
                    alert("Por favor proporciona un motivo de rechazo.");
                }
            };
        }

        bootstrapModal.show();
    }

    // Delegación de eventos para los botones de aceptar y rechazar dentro de la tabla de solicitudes
    document.getElementById('recepcion-solicitudes').addEventListener('click', function(event) {
        const target = event.target;

        if (target.classList.contains('btn-aceptar')) {
            mostrarModal('aceptar', target);
        } else if (target.classList.contains('btn-rechazar')) {
            mostrarModal('rechazar', target);
        }
    });

    // Mostrar/Ocultar el menú de navegación
    document.getElementById("toggle-menu-button").addEventListener("click", function() {
        const navMenu = document.getElementById("nav-menu");
        navMenu.classList.toggle("d-none");
    });

    // Ocultar el menú desplegable si se hace clic fuera del botón o del menú
    document.addEventListener("click", function(event) {
        const navMenu = document.getElementById("nav-menu");
        const mainButton = document.getElementById("toggle-menu-button");
        if (!navMenu.contains(event.target) && event.target !== mainButton) {
            navMenu.classList.add("d-none");
        }
    });

    // Función para ocultar todas las secciones
    function hideAllSections() {
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => section.classList.add("d-none"));
    }

    // Función para mostrar una sección específica
    function showSection(sectionId) {
        hideAllSections();
        document.getElementById(sectionId).classList.remove("d-none");
    }

    // Redirigir a index.html al hacer clic en el botón "Inicio"
    document.getElementById("btn-inicio").addEventListener("click", function() {
        window.location.href = "/";
    });

    // Redirigir a perfilUsuario.html al hacer clic en el botón "Perfil"
    document.getElementById("btn-perfil").addEventListener("click", function() {
        window.location.href = "perfilUsuario";
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

    // Mostrar/ocultar el menú de perfil
    document.getElementById("profile-button").addEventListener("click", function() {
        const profileMenu = document.getElementById("profile-menu");
        profileMenu.classList.toggle("d-none");
    });

    // Ocultar el menú de perfil si se hace clic fuera
    document.addEventListener("click", function(event) {
        const profileMenu = document.getElementById("profile-menu");
        const profileButton = document.getElementById("profile-button");

        if (!profileMenu.contains(event.target) && event.target !== profileButton) {
            profileMenu.classList.add("d-none");
        }
    });

    // Función para búsqueda y filtrado de solicitudes
    document.getElementById("search-solicitudes").addEventListener("input", function() {
        const filter = this.value.toLowerCase();
        const rows = document.querySelectorAll("#solicitudes-list tr");
        rows.forEach(row => {
            const name = row.querySelector("td").textContent.toLowerCase();
            row.style.display = name.includes(filter) ? "" : "none";
        });
    });

    // Función para notificaciones en tiempo real
    function showNotification(action) {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.textContent = `Acción "${action}" realizada exitosamente.`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Validación de formularios
    function validateForm(form) {
        let valid = true;
        form.querySelectorAll('input').forEach(input => {
            if (input.value.trim() === '') {
                input.classList.add('error');
                valid = false;
            } else {
                input.classList.remove('error');
            }
        });
        return valid;
    }

    // Validación en la sección de "Gestión de Registros"
    document.getElementById("gestion-form").addEventListener("submit", function(event) {
        event.preventDefault();
        if (validateForm(this)) {
            showNotification("Registro agregado");
            agregarRegistro();
        } else {
            showNotification("Error: Campos vacíos");
        }
    });

    // Función para agregar un registro a la tabla de espera
    function agregarRegistro() {
        const nombre = document.getElementById("nombre-paciente").value;
        const rut = document.getElementById("rut-paciente").value;
        const correo = document.getElementById("correo-paciente").value;
        const celular = document.getElementById("celular-paciente").value;
        const servicio = document.getElementById("servicio-paciente").value;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${nombre}</td>
            <td>${rut}</td>
            <td>${correo}</td>
            <td>${celular}</td>
            <td>${servicio}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editRegistro(this)">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRegistro(this)">Eliminar</button>
            </td>
        `;
        document.getElementById("lista-registros").appendChild(row);

        document.getElementById("gestion-form").reset();
    }

    // Función para editar un registro
    function editRegistro(button) {
        const row = button.closest('tr');
        const cells = row.querySelectorAll('td');
        document.getElementById("nombre-paciente").value = cells[0].textContent;
        document.getElementById("rut-paciente").value = cells[1].textContent;
        document.getElementById("correo-paciente").value = cells[2].textContent;
        document.getElementById("celular-paciente").value = cells[3].textContent;
        document.getElementById("servicio-paciente").value = cells[4].textContent;
        row.remove();
    }

    // Función para eliminar un registro
    function deleteRegistro(button) {
        button.closest('tr').remove();
    }

    // Validación de perfil
    document.getElementById("perfil-form").addEventListener("submit", function(event) {
        event.preventDefault();
        if (validateForm(this)) {
            showNotification("Perfil actualizado");
        } else {
            showNotification("Error: Campos vacíos");
        }
    });

    // Manejo de subida de archivos PDF
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function() {
            if (this.files[0]) {
                alert("Archivo " + this.files[0].name + " cargado exitosamente.");
            }
        });
    });

    // Función para manejo de reportes de solicitudes
    document.getElementById('btn-reportar-solicitudes').addEventListener('click', function() {
        alert("Generando reporte de solicitudes...");
    });
});
