const bcrypt = require('bcrypt');

// Función para verificar la contraseña
async function verifyPassword(password, hashedPassword) {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}

// Uso de la función
(async () => {
    const password = 'miContraseñaSegura';
    const hashedPassword = '$2b$10$somehashedpasswordhere'; // El hash almacenado en la base de datos

    const isMatch = await verifyPassword(password, hashedPassword);
    if (isMatch) {
        console.log('La contraseña es correcta');
    } else {
        console.log('La contraseña es incorrecta');
    }
})();
