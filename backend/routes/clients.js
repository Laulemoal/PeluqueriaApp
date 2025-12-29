const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/", (req, res) => {
    db.all("SELECT * FROM clients", [], (err, rows) => {
        res.json(rows);
    });
});

router.post("/", (req, res) => {
    const { name, phone } = req.body;
    db.run(
        "INSERT INTO clients (name, phone) VALUES (?, ?)",
        [name, phone],
        () => res.sendStatus(201)
    );
});

module.exports = router;
