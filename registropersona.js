function validaRegistro(){
    var nombre = document.getElementById('Nombre').value;
    var rut = document.getElementById('rut').value;
    var correo = document.getElementById('correo').value;

    var nombrePattern = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s'-]+$/;
    var rutPattern = /^[0-9]{1,8}-[0-9Kk]{1}$/;
    var correoPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    document.getElementById('Nombre').style.border = "";
    document.getElementById('rut').style.border = "";
    document.getElementById('correo').style.border = "";

    if (nombre === ""){
        alert("No puedes dejar este campo Vacio");
        document.getElementById('Nombre').style.border = "1px solid red";
        return false;
    }
    if (!nombrePattern.test(nombre)){
        alert("Ingresa un nombre valido");
        document.getElementById('Nombre').style.border = "1px solid red";
        return false;
    }

    if (rut === ""){
        alert("No puedes dejar este campo Vacio");
        document.getElementById('rut').style.border = "1px solid red";
        return false;
    }
    if (!rutPattern.test(rut)){
        alert("Ingresa un RUT valido");
        document.getElementById('rut').style.border = "1px solid red";
        return false;
    }

    if (correo === ""){
        alert("No puedes dejar este campo Vacio");
        document.getElementById('correo').style.border = "1px solid red";
        return false;
    }
    if (!correoPattern.test(correo)){
        alert("Ingresa un correo valido");
        document.getElementById('correo').style.border = "1px solid red";
        return false;
    }

    return true;

}