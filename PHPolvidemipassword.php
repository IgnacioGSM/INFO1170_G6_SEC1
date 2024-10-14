<?php
// Conexión a la base de datos
include('Recuperacion.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['correo'];

    // Verificar si el correo existe en la tabla de Usuario
    $query = $conn->prepare("SELECT * FROM Usuario WHERE CorreoElectronico = ?");
    $query->bind_param("s", $correo);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        // Generar un token único para restablecimiento de contraseña
        $token = bin2hex(random_bytes(50));
        $expira = date("Y-m-d H:i:s", strtotime('+1 hour')); // El token expira en 1 hora

        // Insertar o actualizar el token en la tabla RecuperacionContrasena
        $stmt = $conn->prepare("INSERT INTO RecuperacionContrasena (CorreoElectronico, TokenRecuperacion, Expira) 
                                VALUES (?, ?, ?) 
                                ON DUPLICATE KEY UPDATE TokenRecuperacion = ?, Expira = ?");
        $stmt->bind_param("sssss", $correo, $token, $expira, $token, $expira);
        $stmt->execute();

        // Enviar el correo con el enlace de recuperación
        $enlace = "http://tu_sitio.com/restablecer_contrasena.php?token=" . $token;
        $asunto = "Recupera tu contraseña";
        $mensaje = "Haga clic en el siguiente enlace para restablecer su contraseña: " . $enlace;
        $cabeceras = 'From: no-reply@tu_sitio.com' . "\r\n" .
                     'Reply-To: no-reply@tu_sitio.com' . "\r\n" .
                     'X-Mailer: PHP/' . phpversion();

        mail($correo, $asunto, $mensaje, $cabeceras);

        echo "Correo enviado para recuperar la contraseña.";
    } else {
        echo "El correo no existe en nuestro sistema.";
    }
}
?>
