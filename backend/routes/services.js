const express = require("express");
const db = require("../database");
const router = express.Router();

// Obtener servicios
router.get("/", (req, res) => {
    db.all("SELECT * FROM services", [], (err, rows) => {
        res.json(rows);
    });
});

// Crear servicio
router.post("/", (req, res) => {
    const { name, price } = req.body;
    db.run(
        "INSERT INTO services (name, price) VALUES (?, ?)",
        [name, price],
        () => res.sendStatus(201)
    );
});

// Eliminar servicio
router.delete("/:id", (req, res) => {
    db.run("DELETE FROM services WHERE id = ?", [req.params.id]);
    res.sendStatus(200);
});

module.exports = router;
