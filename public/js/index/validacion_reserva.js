document.getElementById("index-reservacion-form").addEventListener("submit", function(event) {
    
    event.preventDefault();
    // Mas adelante se necesitará revisión de estos campos en el backend

    let idseccion = document.getElementById("idseccion-form").value;
    let rut = document.getElementById("rut").value;
    let correo = document.getElementById("correo").value;
    let motivo_consulta = document.getElementById("motivo-consulta").value;

    if (idseccion === "") {
        alert("Seleccione una sección");
        return false;
    }

    if (rut === "") {
        alert("Ingrese un RUT");
        return false;
    }

    let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // Email debe comenzar con letras, números, puntos, guiones bajos o guiones, seguido de un @, 
    // seguido de letras, números o guiones, seguido de un punto, seguido de letras de 2 a 6 caracteres
    if (!regexEmail.test(correo)) {
        alert("Correo inválido");
        return false;
    }

    if (motivo_consulta === "") {
        alert("Ingrese un motivo de consulta");
        return false;
    }


    fetch("/submit_solicitud", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idseccion: idseccion,
            rut: rut,
            correo: correo,
            motivo_consulta: motivo_consulta,
            })
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.error) {
                alert("Error al enviar la solicitud: " + data.error);
            } else {
                alert("Solicitud enviada");
            }
        });
});

function formatearRUT(input) {
    let rut = input.value.replace(/[^\dkK]/g, ''); // Elimina caracteres no permitidos
    
    // dividir el rut en parte numerica y digito verificador
    let numerica = rut.slice(0, -1);
    let verificador = rut.slice(-1);

    // agregar puntos cada 3 digitos
    numerica = numerica.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // \B se asegura de que la coincidencia no esté al principio de una palabra
    // ?= es una búsqueda positiva hacia adelante, significa que la expresión regular solo coincidirá si se encuentra lo que está dentro de los paréntesis a continuación
    // \d{3} significa que se esperan 3 dígitos
    // (?! significa que la expresión regular solo coincidirá si no se encuentra lo que está dentro de los paréntesis a continuación)
    // \d significa cualquier dígito
    // /g significa que la búsqueda se realiza en todo el texto

    input.value = numerica + (verificador ? "-" + verificador : '');
    // Se agrega guión y dígito verificador si es que este último existe
}

function limpiarRUT(input) {
    input.value = input.value.replace(/[^\dkK]/g, ''); // Elimina puntos y guiones
}


document.getElementById("rut").addEventListener("input", function() {
    this.value = this.value.trimStart();
    this.value = this.value.replace(/[^\dkK]/g, ''); // Elimina caracteres no permitidos
}); // Elimina los espacios al inicio del campo rut mientras se escribe

document.getElementById("rut").addEventListener("blur", function() {
    formatearRUT(this);
}); // Agrega formato rut al salir del campo, añade los puntos y guión ------ Falta hacer que esto se ejecute al cargar la pagina

document.getElementById("rut").addEventListener("focus", function() {
    limpiarRUT(this);
}); // Al volver al seleccionar el input de rut se limpian los puntos y guión

document.getElementById("correo").addEventListener("input", function() {
    this.value = this.value.trimStart();
}); // Elimina los espacios al inicio del campo correo mientras se escribe

document.getElementById("motivo-consulta").addEventListener("input", function() {
    this.value = this.value.trimStart();
}); // Elimina los espacios al inicio del campo motivo-consulta mientras se escribe