const correoPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function validarcampo(valor, patron, mensaje){
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

function validaFormu(){
    const correo = document.getElementById('correo');
    const password = document.getElementById('password');

    limpiaError(correo);
    limpiaError(password);

    const correoError = validarcampo(correo.value, correoPattern, "Ingresa un correo valido");
    const passwordError = validarcampo(password.value, passwordPattern, "La contraseña debe contener al menos 8 caracteres, una letra mayuscula, un miniscula y un numero y un caracter especial");

    if (correoError){
        muestraError(correo, correoError);
        return false;
    }
    if (passwordError){
        muestraError(password, passwordError);
        return false;
    }

    return true;
}