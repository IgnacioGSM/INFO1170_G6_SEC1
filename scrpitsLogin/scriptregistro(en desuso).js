function validarFormulario() {
    const emailInput = document.getElementById('correo');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('correo-error');
    const passwordError = document.getElementById('password-error');
    let isValid = true;

    // Limpiar mensajes de error previos
    emailError.textContent = '';
    passwordError.textContent = '';
    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    // Validación de correo electrónico
    const email = emailInput.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        emailError.textContent = 'Correo no válido.';
        emailError.style.display = 'block';
        isValid = false;
    }

    // Validación de la contraseña
    const password = passwordInput.value.trim();
    if (password.length < 8) {
        passwordError.textContent = 'Contraseña muy corta (mínimo 8 caracteres).';
        passwordError.style.display = 'block';
        isValid = false;
    }

    return isValid;
}
