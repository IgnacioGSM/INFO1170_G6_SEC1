function validarFormulario() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('new_password').value;

    // Validación básica del correo electrónico
    if (!email.match(/^\S+@\S+\.\S+$/)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return false;
    }

    // Validación básica de la contraseña (puedes agregar más reglas)
    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return false;
    }

    // Puedes agregar más validaciones aquí, como:
    // - Comprobar si la contraseña contiene al menos una mayúscula, minúscula y un número
    // - Comprobar si la contraseña no es una palabra común
    // - Comprobar si las contraseñas coinciden (si se pide confirmar la contraseña)

    return true;
}

