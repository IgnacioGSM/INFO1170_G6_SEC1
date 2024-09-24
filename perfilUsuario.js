document.getElementById('boton-cuenta').addEventListener('click', function() {
    mostrarSeccion('contenidoCuenta');
});

document.getElementById('boton-confCU').addEventListener('click', function() {
    mostrarSeccion('contenidoConfCuenta');
});

document.getElementById('boton-expedientes').addEventListener('click', function() {
    mostrarSeccion('contenidoExpedientes');
});

document.getElementById('boton-borrar').addEventListener('click', function() {
    mostrarSeccion('contenidoBorrarCuenta');
});

function mostrarSeccion(id){
    const secciones = document.querySelectorAll('.ContenidoDinamico');
    secciones.forEach(seccion => seccion.style.display = 'none');

    document.getElementById(id).style.display = 'block';
}

function manejaConfi(event, ContraseñaInputID, mensajeExito){
    event.preventDefault();

    const contraseñaIngresada = document.getElementById(ContraseñaInputID).value;

    validarContraseña(contraseñaIngresada, function(isValid){
        if (isValid){
            alert(mensajeExito);
        }else {
            alert('Contraseña incorrecta intente de nuevo');
        }
    });
}

document.getElementById('CambiarCorreo').addEventListener('submit', function(event){
    manejaConfi(event, 'confirmarCorreo', 'correo actualizado con exito');
});

document.getElementById('CambiarTelefono').addEventListener('submit', function(event){
    manejaConfi(event, 'confirmarTelefono', 'telefono actualizado con exito');
});

document.getElementById('CambiarDireccion').addEventListener('submit', function(event){
    manejaConfi(event, 'confirmarDireccion', 'direccion actualizado con exito');
});