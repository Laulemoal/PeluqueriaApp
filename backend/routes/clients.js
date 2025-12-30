const express = require("express");
const db = require("../database");
const router = express.Router();

// LISTAR clientes
router.get("/", (req, res) => {
    db.all("SELECT * FROM clients", [], (err, rows) => {
        res.json(rows);
    });
});

// CREAR cliente
router.post("/", (req, res) => {
    const { name, phone } = req.body;

    db.run(
        "INSERT INTO clients (name, phone) VALUES (?, ?)",
        [name, phone],
        function () {
            res.sendStatus(201);
        }
    );
});

// ELIMINAR cliente
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.run(
        "DELETE FROM clients WHERE id = ?",
        [id],
        function () {
            res.sendStatus(200);
        }
    );
});

module.exports = router;

