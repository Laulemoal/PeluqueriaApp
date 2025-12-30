const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/", (req, res) => {
    db.all("SELECT * FROM services WHERE is_preset = 0", [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

router.get("/catalog", (req, res) => {
    db.all("SELECT * FROM services", [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

router.post("/", (req, res) => {
    const { name, price } = req.body;

    db.run(
        "INSERT INTO services (name, price, is_preset) VALUES (?, ?, 0)",
        [name, price],
        function (err) {
            if (err) return res.status(500).send(err.message);
            res.sendStatus(201);
        }
    );
});

router.delete("/:id", (req, res) => {
    db.run(
        "DELETE FROM services WHERE id = ? AND is_preset = 0",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).send(err.message);
            res.sendStatus(200);
        }
    );
});

module.exports = router;
