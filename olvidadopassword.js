function validaFormu(){
    var correo = document.getElementById('correo').value;
    var password = document.getElementById('password').value;

    var correoPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    document.getElementById('correo').style.border = "";
    document.getElementById('password').style.border = "";

    if (correo === ""){
        alert("Este campo no puede estar vacio");
        document.getElementById('correo').style.border = "1px solid red";
        return false;
    }
    if (!correoPattern.test(correo)){
        alert("Por favor ingresa un correo valido");
        document.getElementById('correo').style.border = "1px solid red";
        return false;
    }

    if (password === ""){
        alert("No puedes dajar este campo vacio");
        document.getElementById('password').style.border = "1px solid red";
        return false;
    }
    if (!passwordPattern.test(password)){
        alert("Por favor ingresa un correo valido");
        document.getElementById('password').style.border = "1px solid red";
        return false;
    }

    return true;

}