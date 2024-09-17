// Función para ocultar todas las secciones
function hideAllSections() {
    document.getElementById("home-view").style.display = "none";
    document.getElementById("gestion-registros").style.display = "none";
    document.getElementById("recepcion-solicitudes").style.display = "none";
    document.getElementById("historial-solicitudes").style.display = "none";
    document.getElementById("settings-menu").style.display = "none"; // Siempre ocultar el menú de configuración
}

// Función para mostrar una sección específica
function showSection(sectionId) {
    hideAllSections();
    document.getElementById(sectionId).style.display = "block";
}

// Navegación de vistas
document.getElementById("btn-home").addEventListener("click", function() {
    showSection("home-view");
});

document.getElementById("btn-inicio").addEventListener("click", function() {
    window.location.href = "index.html"; // Redirecciona a la página de inicio
});

document.getElementById("btn-gestion").addEventListener("click", function() {
    showSection("gestion-registros");
});

document.getElementById("btn-solicitudes").addEventListener("click", function() {
    showSection("recepcion-solicitudes");
});

document.getElementById("btn-historial").addEventListener("click", function() {
    showSection("historial-solicitudes");
});

// Función para mostrar/ocultar el menú desplegable de configuración
document.getElementById("btn-settings").addEventListener("click", function() {
    const settingsMenu = document.getElementById("settings-menu");
    const isVisible = settingsMenu.style.display === "block";
    settingsMenu.style.display = isVisible ? "none" : "block";
});

// Ocultar el menú desplegable si se hace clic fuera del botón o del menú
document.addEventListener("click", function(event) {
    const settingsMenu = document.getElementById("settings-menu");
    const settingsButton = document.getElementById("btn-settings");

    if (!settingsMenu.contains(event.target) && event.target !== settingsButton) {
        settingsMenu.style.display = "none"; // Ocultar el menú
    }
});

// (para futuras funcionalidades)
/*
function validarCampoVacio(campo, nombreCampo) {
    if (campo.trim() === "") {
        alert(`El campo ${nombreCampo} no puede estar vacío o contener solo espacios.`);
        return false;
    }
    return true;
}

function validarSoloNumeros(campo, nombreCampo) {
    const numerosRegex = /^[+\d]+$/; // Permite solo números y el signo +
    if (!numerosRegex.test(campo)) {
        alert(`El campo ${nombreCampo} solo puede contener números y el signo "+"`);
        return false;
    }
    return true;
}

function validarRUT(rut) {
    const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
    return rutRegex.test(rut);
}

function validarFormulario(formulario) {
    const rut = formulario.querySelector("input[name='rut'], input[name='rut-edit']").value;
    const nombre = formulario.querySelector("input[name='nombre'], input[name='nombre-edit']").value;
    const apellidos = formulario.querySelector("input[name='apellidos'], input[name='apellidos-edit']").value;
    const telefono = formulario.querySelector("input[name='telefono'], input[name='telefono-edit']").value;
    const servicio = formulario.querySelector("input[name='servicio'], input[name='servicio-edit']").value;

    let valid = true;

    if (!validarRUT(rut)) {
        alert("El RUT ingresado no es válido.");
        valid = false;
    }

    valid = validarCampoVacio(nombre, "Nombre") && valid;
    valid = validarCampoVacio(apellidos, "Apellidos") && valid;
    valid = validarCampoVacio(servicio, "Servicio") && valid;
    valid = validarSoloNumeros(telefono, "Teléfono") && valid;

    return valid;
}

document.getElementById("add-waiting").addEventListener("submit", function(event) {
    if (!validarFormulario(this)) {
        event.preventDefault();
    }
});

document.getElementById("edit-waiting").addEventListener("submit", function(event) {
    if (!validarFormulario(this)) {
        event.preventDefault();
    }
});

document.getElementById("delete-waiting").addEventListener("submit", function(event) {
    const rut = document.getElementById("rut-delete").value;
    if (!validarRUT(rut)) {
        alert("El RUT ingresado no es válido.");
        event.preventDefault();
    }
});
*/
