// Textarea de reporte
document.getElementById('reporte').addEventListener('input', function(){
    this.value = this.value.trimStart();    // Elimina espacios al inicio
});

// Botón de enviar reporte
document.getElementById('enviar-reporte').addEventListener('click', () => {
    let reporte = document.getElementById('reporte').value;
    if (reporte.length === 0) {
        alert('El reporte no puede estar vacío');
    } else {
        console.log("ya envié el reporte uy si");
    }
});