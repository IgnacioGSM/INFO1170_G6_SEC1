<?php
// Conexión a la base de datos
$host = "localhost";
$dbname = "Hospitrack";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}

// Si el formulario es enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rut = $_POST["rut"];
    $inputPassword = $_POST["password"];

    // Validar que el RUT exista en la base de datos
    $sql = "SELECT Contrasenia FROM Usuario WHERE RUT = :rut";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(":rut", $rut, PDO::PARAM_STR);
    $stmt->execute();

    // Si el RUT existe
    if ($stmt->rowCount() == 1) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        $hashedPassword = $usuario['Contrasenia'];

        // Verificar la contraseña ingresada con la almacenada
        if (password_verify($inputPassword, $hashedPassword)) {
            // Iniciar sesión y redirigir al mapa o a otra página
            session_start();
            $_SESSION['rut'] = $rut;
            header("Location: index.html");
            exit();
        } else {
            $error = "Contraseña incorrecta.";
        }
    } else {
        $error = "El RUT no está registrado.";
    }
}
?>
