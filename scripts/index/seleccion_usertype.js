// modifica la página en relación al tipo de usuario que se selecciona


document.getElementById("index-seleccion-usertype").addEventListener("change", function() {
    let usertype = document.getElementById("index-seleccion-usertype").value;
    alert("ingresando como " + usertype);
    document.getElementById("overlay").style.display = "none";
    if (usertype == "invitado"){
        console.log("invitado");
        let invitado_elements = document.getElementsByClassName("invitado-only");
        for (let i = 0; i < invitado_elements.length; i++){
            if (invitado_elements[i].tagName == "LI"){
                invitado_elements[i].style.display = "inline";
            }
            else{
                invitado_elements[i].style.display = "flex";
            }
        }
    }
    else if (usertype == "recepcionista"){
        console.log("recepcionista");
        let recepcionista_elements = document.getElementsByClassName("recepcionista-only");
        for (let i = 0; i < recepcionista_elements.length; i++){
            if (recepcionista_elements[i].tagName == "LI"){
                recepcionista_elements[i].style.display = "inline";
            }
        }
    }
    else if (usertype == "admin"){
        console.log("admin");
        let admin_elements = document.getElementsByClassName("admin-only");
        for (let i = 0; i < admin_elements.length; i++){
            if (admin_elements[i].tagName == "LI"){
                admin_elements[i].style.display = "inline";
            }
        }
    }
    else if (usertype == "suspendido"){
        console.log("suspendido");
        document.getElementById("index-formulario-suspendido").style.display = "flex";
    }
});