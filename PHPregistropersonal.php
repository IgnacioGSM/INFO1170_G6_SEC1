<?php
// Configuración de la base de datos
$host = "localhost";  // Cambia esto si tu host es diferente
$dbname = "Hospitrack";  // Nombre de la base de datos
$username = "root";  // Nombre de usuario de la base de datos
$password = "";  // Contraseña de la base de datos

// Crear la conexión
$conn = new mysqli($host, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Verificar si el formulario ha sido enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger los datos del formulario
    $nombre = $conn->real_escape_string($_POST["Nombre"]);
    $rut = $conn->real_escape_string($_POST["rut"]);
    $correo = $conn->real_escape_string($_POST["correo"]);
    $contrasenia = $conn->real_escape_string($_POST["password"]);

    // Verificar si el RUT ya está registrado
    $checkRut = "SELECT RUT FROM Usuario WHERE RUT = '$rut'";
    $result = $conn->query($checkRut);

    if ($result->num_rows > 0) {
        echo "<script>alert('El RUT ya está registrado.'); window.location.href='registropersona.html';</script>";
    } else {
        // Insertar los datos en la base de datos
        $sql = "INSERT INTO Usuario (RUT, Nombre, CorreoElectronico, Contrasenia) 
                VALUES ('$rut', '$nombre', '$correo', '$contrasenia')";

        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Registro exitoso'); window.location.href='iniciosesion.html';</script>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

// Cerrar la conexión
$conn->close();
?>
