// modifica la página en relación al tipo de usuario que se selecciona


document.getElementById("index-seleccion-usertype").addEventListener("change", function() {
    let usertype = document.getElementById("index-seleccion-usertype").value;
    alert("ingresando como " + usertype);
    document.getElementById("overlay").style.display = "none";
    if (usertype == "invitado"){
        console.log("invitado");
        document.getElementById("index-formulario-bloqueado").style.display = "flex";
    }
});