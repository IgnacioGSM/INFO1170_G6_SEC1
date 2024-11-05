function validarut(rut){
    var rutPattern = /^[0-9]{1,8}-[0-9Kk]{1}$/;
    if (rut === ""){
        return "No puedes dejar este campo vacio";
    }
    if (!rutPattern.test(rut)){
        return "Por favor, ingresar un rut valido";
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

function validateform(){
    var rut = document.getElementById('rut');
    var password = document.getElementById('password');

    limpiaError(rut);
    limpiaError(password);

    var rutERROR = validarut(rut.value);
    var passwordERROR = validapassword(password.value);

    if (rutERROR){
        muestraError(rut, rutERROR);
        return false;
    }
    if (passwordERROR){
        muestraError(password, passwordERROR);
        return false;
    }

    return true;
}
