<?php

$conexion = new mysqli('localhost', 'root', '', 'hospitrack');

if ($conexion->connect_error){
    die('Error de conexion: ' . $conexion->connect_error);

}

$nombre = $_POST['Nombre'];
$rut = $_POST['rut'];
$correo = $_POST['correo'];

$sql = "INSERT INTO usuarios (nombre, rut, correo) VALUES ('$nombre', '$rut', '$correo')";

if ($conexion->query($sql) === TRUE){
    echo "Registro exitoso";
} else {
    echo "Error: " . $sql . "<br>" . $conexion->error;
}

$conexion->close();

?>