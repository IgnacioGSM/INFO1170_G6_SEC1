function validanombre(nombre){
    var nombrePattern = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s'-]+$/;
    if (nombre === ""){
        return "No puedes dejar este campo Vacio";
    }
    if (!nombrePattern.test(nombre)){
        return "Ingresa un nombre valido";
    }
    return null;
}

function validarut(rut){
    var rutPattern = /^[0-9]{1,8}-[0-9Kk]{1}$/;
    if (rut === ""){
        return "No puedes dejar este campo Vacio";
    }
    if (!rutPattern.test(rut)){
        return "Ingresa un RUT valido";
    }
    return null;
}

function validacorreo(correo){
    var correoPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (correo === ""){
        return "No puedes dejar este campo Vacio";
    }
    if (!correoPattern.test(correo)){
        return "Ingresa un correo valido";
    }
    return null;
}

function muestraError(inputElement, message){
    var ElementoError = document.getElementById(inputElement.id + "-error");
    inputElement.style.border = "1px solid red";
    ElementoError.innerHTML = message;
    ElementoError.style.display = "block";
}

function limpiaError(inputElement){
    var ElementoError = document.getElementById(inputElement.id + "-error");
    inputElement.style.border = "";
    ElementoError.innerHTML = "";
    ElementoError.style.display = "none";
}

function validaRegistro(){
    var nombre = document.getElementById('nombre');
    var rut = document.getElementById('rut');
    var correo = document.getElementById('correo');

    limpiaError(nombre);
    limpiaError(rut);
    limpiaError(correo);

    var nombreError = validanombre(nombre.value);
    var rutError = validarut(rut.value);
    var correoError = validacorreo(correo.value);

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
    
    return true;
}