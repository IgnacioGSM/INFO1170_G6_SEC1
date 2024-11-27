// Asignar la acción del botón "Inicio"
document.getElementById("btn-inicio").addEventListener("click", function() {
    window.location.href = "index.html"; // Redireccionar a index.html
});

// Funciones de validación (se mantienen igual que antes)
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
