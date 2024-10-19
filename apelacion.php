<?php
// Procesar apelación
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener datos del formulario
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $razon = $_POST['razon'];

    // Conectar a la base de datos
    $servername = "localhost"; //cambiar por hospitrack
    $username = "root"; //cambiar por hospitrack
    $password = ""; //cambiar por hospitrack
    $dbname = "hospital"; //cambiar por hospitrack

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Insertar datos en la tabla 'apelaciones'
    $sql = "INSERT INTO apelaciones (nombre, email, razon) VALUES ('$nombre', '$email', '$razon')";

    if ($conn->query($sql) === TRUE) {
        echo "Apelación enviada con éxito";
    } else {
        echo "Error al enviar apelación: " . $conn->error;
    }

    // Cerrar conexión
    $conn->close();
}
?>
