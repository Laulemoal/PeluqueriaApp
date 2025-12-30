const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "peluqueria.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // ===== SERVICES =====
  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      is_preset INTEGER DEFAULT 0
    )
  `);

  // Seed presets (solo si no hay presets)
  db.get("SELECT COUNT(*) AS count FROM services WHERE is_preset = 1", [], (err, row) => {
    if (err) return console.error(err);

    if (row.count === 0) {
      const presetServices = [
        ["Corte", 5000],
        ["Balayage", 25000],
        ["Tintura", 18000],
        ["Brushing", 7000],
        ["Peinado", 12000],
        ["Botox capilar", 22000],
        ["Nutrición", 15000]
      ];

      const stmt = db.prepare(
        "INSERT INTO services (name, price, is_preset) VALUES (?, ?, 1)"
      );

      presetServices.forEach(([name, price]) => stmt.run(name, price));
      stmt.finalize();

      console.log("✅ Presets de servicios cargados");
    }
  });

  // ===== CLIENTS =====
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT
    )
  `);

  // ===== APPOINTMENTS =====
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      FOREIGN KEY(client_id) REFERENCES clients(id),
      FOREIGN KEY(service_id) REFERENCES services(id)
    )
  `);
});

module.exports = db;
