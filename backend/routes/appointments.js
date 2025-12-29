const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/", (req, res) => {
    db.all(`
    SELECT a.id, c.name AS client, s.name AS service, a.date, a.time
    FROM appointments a
    JOIN clients c ON a.client_id = c.id
    JOIN services s ON a.service_id = s.id
  `, [], (err, rows) => {
        res.json(rows);
    });
});

router.post("/", (req, res) => {
    const { client_id, service_id, date, time } = req.body;
    db.run(
        "INSERT INTO appointments (client_id, service_id, date, time) VALUES (?, ?, ?, ?)",
        [client_id, service_id, date, time],
        () => res.sendStatus(201)
    );
});

module.exports = router;
