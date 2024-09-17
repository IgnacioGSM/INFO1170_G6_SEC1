// modifica la página en relación al tipo de usuario que se selecciona


document.getElementById("index-seleccion-usertype").addEventListener("change", function() {
    let usertype = document.getElementById("index-seleccion-usertype").value;
    alert("ingresando como " + usertype);
    document.getElementById("overlay").style.display = "none";
    if (usertype == "invitado"){
        console.log("invitado");
        document.getElementById("index-formulario-invitado").style.display = "flex";
    }

    if (usertype == "suspendido"){
        console.log("suspendido");
        document.getElementById("index-formulario-suspendido").style.display = "flex";
    }
});