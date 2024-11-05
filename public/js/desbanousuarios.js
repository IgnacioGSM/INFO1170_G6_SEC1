const express = require('express');
const router = express.Router();
const db = require('./db'); // Importar la conexión a la base de datos
const bcrypt = require('bcrypt');

// Ruta para desbanear a un usuario
router.post('/desbanear', async (req, res) => {
    const { userId } = req.body;

    // Verificar si se proporcionó el ID del usuario
    if (!userId) {
        return res.status(400).json({ message: 'Se requiere el ID del usuario' });
    }

    try {
        // Verificar si el usuario está baneado
        const usuario = await db.query('SELECT * FROM Usuarios WHERE id = ? AND estaBaneado = 1', [userId]);

        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado o no está baneado' });
        }

        // Actualizar el estado del usuario para desbanearlo
        await db.query('UPDATE Usuarios SET estaBaneado = 0 WHERE id = ?', [userId]);

        res.status(200).json({ message: 'El usuario ha sido desbaneado con éxito' });
    } catch (error) {
        console.error('Error al desbanear al usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
