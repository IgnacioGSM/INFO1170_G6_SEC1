function validacorreo(correo){
    var correoPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (correo === ""){
        return "Este campo no puede estar vacio";
    }
    if (!correoPattern.test(correo)){
        return "Por favor ingresa un correo valido";
    }
    return null;
}

function validapassword(password){
    var passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password === ""){
        return "No puedes dejar este campo vacio";
    }
    if (!passwordPattern.test(password)){
        return "La contraseña debe contener al menos 8 caracteres, una letra mayuscula, un miniscula y un numero y un caracter especial";
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

function validaFormu(){
    var correo = document.getElementById('correo');
    var password = document.getElementById('password');

    limpiaError(correo);
    limpiaError(password);

    var correoError = validacorreo(correo.value);
    var passwordError = validapassword(password.value);

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