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
    const nombre = document.getElementById('nombre');
    const rut = document.getElementById('rut');
    const correo = document.getElementById('correo');
    const contraseña = document.getElementById('contraseña');

    limpiaError(nombre);
    limpiaError(rut);
    limpiaError(correo);
    limpiaError(contraseña);

    const nombreError = validacampo(nombre.value, nombrePattern, "Ingresa un nombre valido");
    const rutError = validacampo(rut.value, rutPattern, "Ingresa un RUT valido, sin puntos y usando comilla");
    const correoError = validacampo(correo.value, correoPattern, "Ingresa un correo valido" );
    const contraseñaError = validacampo(contraseña.value, contraPattern, "La contraseña debe contener al menos 8 caracteres, una letra mayuscula, un miniscula y un numero y un caracter especial");

    if (nombreError){
        muestraError(nombre, nombreError);
        return false;
    }
    if (rutError){
        muestraError(rut, rutError);
        return false;
    }
    if (correoError){
        muestraError(correo, correoError);
        return false;
    }
    if (contraseñaError){
        muestraError(contraseña, contraseñaError);
        return false;
    }
    
    return true;
}