const nombrePattern = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s'-]+$/;
const rutPattern = /^[0-9]{1,8}-[0-9Kk]{1}$/;
const correoPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const contraPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function validacampo(valor, patron, mensaje){
    if (valor.trim() === ""){
        return "No puedes dejar este campo vacio";
    }
    if (!patron.test(valor)){
        return mensaje;
    }
    return null
}

function muestraError(inputElement, mensaje){
    const ElementoError = document.getElementById(inputElement.id + "-error");
    inputElement.style.border = "1px solid red";
    ElementoError.innerHTML = mensaje;
    ElementoError.style.display = "block";
}

function limpiaError(inputElement){
    const ElementoError = document.getElementById(inputElement.id + "-error");
    inputElement.style.border = "";
    ElementoError.innerHTML = "";
    ElementoError.style.display = "none";
}

function validaRegistro(){
    const inputs = [
        {element: document.getElementById('nombre'), pattern: nombrePattern, mensaje: "Ingresa un nombre valido"},
        {element: document.getElementById('rut'), pattern: rutPattern, mensaje: "Ingresa un RUT valido, sin puntos y usando guion"},
        {element: document.getElementById('correo'), pattern: correoPattern, mensaje: "Ingresa un correo valido"},
        {element: document.getElementById('contraseña'), pattern: contraPattern, mensaje: "La contraseña debe contener al menos 8 caracteres, una letra mayuscula, un miniscula y un numero y un caracter especial"}
    ];

    let isValid = true;

    inputs.forEach(({element, pattern, mensaje}) => {
        limpiaError(element);
        const error = validacampo(element.value, pattern, mensaje);
        if (error) {
            muestraError(element, error);
            isValid = false;
        }
    });

    return isValid;
}