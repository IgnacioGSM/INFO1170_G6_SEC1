// Mostrar/Ocultar el menú de navegación
document.getElementById("toggle-menu-button").addEventListener("click", function() {
    const navMenu = document.getElementById("nav-menu");
    const isVisible = navMenu.style.display === "block";
    navMenu.style.display = isVisible ? "none" : "block";
});

// Ocultar el menú desplegable si se hace clic fuera del botón o del menú
document.addEventListener("click", function(event) {
    const navMenu = document.getElementById("nav-menu");
    const mainButton = document.getElementById("toggle-menu-button");

    if (!navMenu.contains(event.target) && event.target !== mainButton) {
        navMenu.style.display = "none";
    }
});

// Función para ocultar todas las secciones
function hideAllSections() {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => section.style.display = "none");
}

// Función para mostrar una sección específica
function showSection(sectionId) {
    hideAllSections();
    document.getElementById(sectionId).style.display = "block";
}

// Funcionalidad para los botones de navegación
document.getElementById("btn-home").addEventListener("click", function() {
    showSection("home-view");
    updateActiveMenu(this);
});

document.getElementById("btn-inicio").addEventListener("click", function() {
    window.location.href = "index.html"; // Redirecciona a la página de inicio
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
    const isVisible = profileMenu.style.display === "block";
    profileMenu.style.display = isVisible ? "none" : "block";
});

// Ocultar el menú de perfil si se hace clic fuera del botón o del menú
document.addEventListener("click", function(event) {
    const profileMenu = document.getElementById("profile-menu");
    const profileButton = document.getElementById("profile-button");

    if (!profileMenu.contains(event.target) && event.target !== profileButton) {
        profileMenu.style.display = "none";
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

// Asignar notificaciones a los botones de acción en solicitudes
document.querySelectorAll("#solicitudes-list button").forEach(button => {
    button.addEventListener("click", function() {
        showNotification(this.textContent);
    });
});

// Validación de formularios
function validateForm(form) {
    let valid = true;

    // Validar campos vacíos
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

    // Crear una nueva fila para la tabla
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${nombre}</td>
        <td>${rut}</td>
        <td>${correo}</td>
        <td>${celular}</td>
        <td>${servicio}</td>
        <td>
            <button onclick="editRegistro(this)">Editar</button>
            <button onclick="deleteRegistro(this)">Eliminar</button>
        </td>
    `;
    document.getElementById("lista-registros").appendChild(row);

    // Limpiar el formulario
    document.getElementById("gestion-form").reset();
}

// Función para editar un registro
function editRegistro(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');
    const nombre = cells[0].textContent;
    const rut = cells[1].textContent;
    const correo = cells[2].textContent;
    const celular = cells[3].textContent;
    const servicio = cells[4].textContent;

    // Pre-llenar el formulario con los valores de la fila seleccionada
    document.getElementById("nombre-paciente").value = nombre;
    document.getElementById("rut-paciente").value = rut;
    document.getElementById("correo-paciente").value = correo;
    document.getElementById("celular-paciente").value = celular;
    document.getElementById("servicio-paciente").value = servicio;

    // Eliminar la fila para editarla
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
        // Lógica para actualizar el perfil...
    } else {
        showNotification("Error: Campos vacíos");
    }
});

// Simulación de una lista de historial de solicitudes
const historialList = document.getElementById("historial-list");
function addHistorial(nombre, servicio, estado, comentarios, puesto) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${nombre}</td>
        <td>${servicio}</td>
        <td>${estado}</td>
        <td>${comentarios}</td>
        <td>${puesto}</td>
    `;
    historialList.appendChild(row);
}

// Añadir datos simulados al historial
addHistorial("Juan Pérez", "Cardiología", "Atendido", "Ninguno", "Puesto 1");
addHistorial("María López", "Pediatría", "Atendido", "Consulta rápida", "Puesto 2");

// Manejo de subida de archivos PDF
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
        if (this.files[0]) {
            alert("Archivo " + this.files[0].name + " cargado exitosamente.");
        }
    });
});

// Animaciones para las notificaciones
const style = document.createElement("style");
style.innerHTML = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2E8B57;
        color: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateY(-20px);
        animation: fadeInOut 3s forwards;
    }

    @keyframes fadeInOut {
        0% {
            opacity: 0;
            transform: translateY(-20px);
        }
        10% {
            opacity: 1;
            transform: translateY(0);
        }
        90% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
