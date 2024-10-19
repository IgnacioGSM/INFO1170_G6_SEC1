document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        let isValid = true;

        // Validación del Nombre Completo
        const nombre = document.getElementById("nombre").value;
        if (nombre.trim() === "" || nombre.length < 3) {
            isValid = false;
            alert("Por favor, ingresa un nombre completo válido (mínimo 3 caracteres).");
        }

        // Validación del Correo Electrónico
        const email = document.getElementById("email").value;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            isValid = false;
            alert("Por favor, ingresa un correo electrónico válido.");
        }

        // Validación del Teléfono
        const telefono = document.getElementById("telefono").value;
        const telefonoPattern = /^[0-9]{7,14}$/;  // Teléfonos con 7 a 14 dígitos
        if (!telefonoPattern.test(telefono)) {
            isValid = false;
            alert("Por favor, ingresa un número de teléfono válido (de 7 a 14 dígitos).");
        }

        // Validación de la Contraseña
        const password = document.getElementById("password").value;
        if (password.length < 6) {
            isValid = false;
            alert("La contraseña debe tener al menos 6 caracteres.");
        }

        // Confirmar Contraseña
        const confirmPassword = document.getElementById("confirm_password").value;
        if (password !== confirmPassword) {
            isValid = false;
            alert("Las contraseñas no coinciden.");
        }

        // Si alguna validación falla, evitar que se envíe el formulario
        if (!isValid) {
            event.preventDefault();
        }
    });
});
