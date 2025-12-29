const express = require("express");
const cors = require("cors");

const servicesRoutes = require("./routes/services");
const clientsRoutes = require("./routes/clients");
const appointmentsRoutes = require("./routes/appointments");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/services", servicesRoutes);
app.use("/clients", clientsRoutes);
app.use("/appointments", appointmentsRoutes);

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
