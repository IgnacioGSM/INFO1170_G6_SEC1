document.getElementById('boton-cuenta').addEventListener('click', function() {
    mostrarSeccion('contenidoCuenta');
});

document.getElementById('boton-contra').addEventListener('click', function() {
    mostrarSeccion('contenidoCambiarContra');
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