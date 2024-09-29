const nombrePattern = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s'-]+$/;
const rutPattern = /^[0-9]{1,8}-[0-9Kk]{1}$/;
const correoPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

    limpiaError(nombre);
    limpiaError(rut);
    limpiaError(correo);

    const nombreError = validacampo(nombre.value, nombrePattern, "Ingresa un nombre valido");
    const rutError = validacampo(rut.value, rutPattern, "Ingresa un RUT valido, sin puntos y usando comilla");
    const correoError = validacampo(correo.value, correoPattern, "Ingresa un correo valido" );

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