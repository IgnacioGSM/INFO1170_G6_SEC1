document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        let isValid = true;

        // Validación del Nombre del Hospital
        const nombre = document.getElementById("nombre").value;
        if (nombre.trim() === "") {
            isValid = false;
            alert("Por favor, ingresa el nombre del hospital.");
        } else if (nombre.length < 3 || nombre.length > 50) {
            isValid = false;
            alert("El nombre del hospital debe tener entre 3 y 50 caracteres.");
        }

        // Validación de la Latitud
        const latitud = document.getElementById("latitud").value;
        if (isNaN(latitud) || latitud.trim() === "") {
            isValid = false;
            alert("Por favor, ingresa un valor numérico para la latitud.");
        } else if (latitud < -90 || latitud > 90) {
            isValid = false;
            alert("La latitud debe estar entre -90 y 90.");
        }

        // Validación de la Longitud
        const longitud = document.getElementById("longitud").value;
        if (isNaN(longitud) || longitud.trim() === "") {
            isValid = false;
            alert("Por favor, ingresa un valor numérico para la longitud.");
        } else if (longitud < -180 || longitud > 180) {
            isValid = false;
            alert("La longitud debe estar entre -180 y 180.");
        }

        // Si alguna validación falla, evitar que se envíe el formulario
        if (!isValid) {
            event.preventDefault();
        }
    });
});
