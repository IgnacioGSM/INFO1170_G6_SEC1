function validarFormulario() {
    const nombre = document.getElementById('Nombre').value;
    const rut = document.getElementById('rut').value;
    const correo = document.getElementById('correo').value;

    // Validación del nombre (puedes agregar más reglas)
    if (nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres.');
        return false;
    }

    // Validación del RUT (puedes agregar una validación más precisa)
    if (!rut.match(/^\d{7}-\d$/)) {
        alert('Ingrese un RUT válido (formato: 1234567-8).');
        return false;
    }

    // Validación del correo electrónico
    if (!correo.match(/^\S+@\S+\.\S+$/)) {
        alert('Ingrese un correo electrónico válido.');
        return false;
    }

    // Puedes agregar más validaciones aquí, como:
    // - Comprobar si el RUT ya existe en la base de datos
    // - Verificar la contraseña (si se requiere)

    return true;
}