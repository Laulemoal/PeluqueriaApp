const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./backend/peluqueria.db");

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      service_id INTEGER,
      date TEXT,
      time TEXT,
      FOREIGN KEY(client_id) REFERENCES clients(id),
      FOREIGN KEY(service_id) REFERENCES services(id)
    )
  `);
});

module.exports = db;
