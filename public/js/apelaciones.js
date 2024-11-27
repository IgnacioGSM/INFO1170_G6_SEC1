const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Obtener todas las apelaciones
router.get("/", async (req, res) => {
    try {
        const query = "SELECT * FROM Solicitud WHERE estado = 'pendiente'";
        db.query(query, (err, results) => {
            if (err) throw err;
            res.status(200).json(results);
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener apelaciones", error });
    }
});

// Agregar una nueva apelación
router.post("/", async (req, res) => {
    const { idusuario, mensaje } = req.body;
    try {
        const query = "INSERT INTO Solicitud (idusuario, mensaje, estado, horasolicitud) VALUES (?, ?, 'pendiente', NOW())";
        db.query(query, [idusuario, mensaje], (err, results) => {
            if (err) throw err;
            res.status(201).json({ message: "Apelación creada exitosamente", id: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar la apelación", error });
    }
});

// Actualizar una apelación existente
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { mensaje } = req.body;
    try {
        const query = "UPDATE Solicitud SET mensaje = ? WHERE idsolicitud = ?";
        db.query(query, [mensaje, id], (err) => {
            if (err) throw err;
            res.status(200).json({ message: "Apelación actualizada correctamente" });
        });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la apelación", error });
    }
});

// Eliminar una apelación
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const query = "DELETE FROM Solicitud WHERE idsolicitud = ?";
        db.query(query, [id], (err) => {
            if (err) throw err;
            res.status(200).json({ message: "Apelación eliminada correctamente" });
        });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la apelación", error });
    }
});

module.exports = router;
