function validateform(){
    var rut = document.getElementById('rut').value;
    var password = document.getElementById('password').value;

    var rutPattern = /^[0-9]{1,8}-[0-9Kk]{1}$/;
    var passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    document.getElementById('rut').style.border = "";
    document.getElementById('password').style.border = "";

    if (rut === ""){
        alert("No puedes dejar este campo vacio");
        document.getElementById('rut').style.border = "1px solid red";
        return false;
    }
    if (!rutPattern.test(rut)){
        alert("Por favor, ingresar un rut valido");
        document.getElementById('rut').style.border = "1px solid red";
        return false;
    }

    if (password === ""){
        alert("No puedes dejar este campo vacio");
        document.getElementById('password').style.border = "1px solid red";
        return false;
    }
    if (!passwordPattern.test(password)){
        alert("La contraseña debe contener al menos 8 caracteres, una letra mayuscula, un miniscula y un numero y un caracter especial");
        document.getElementById('password').style.border = "1px solid red";
        return false;
    }

    return true;
}