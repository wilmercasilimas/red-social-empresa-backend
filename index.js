const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Carga variables de entorno desde .env

const app = express();

// Configuración global de Mongoose
mongoose.set("strictPopulate", false); // ✅ Para evitar errores con populate

// CORS configurado para desarrollo local
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Servir archivos estáticos desde uploads/avatars
app.use(
  "/api/avatar",
  express.static(path.join(__dirname, "uploads", "avatars"))
);

// ✅ Redirección para imagen por defecto
app.get("/api/avatar/default.png", (req, res) => {
  res.redirect(process.env.DEFAULT_AVATAR_URL);
});

// Rutas
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

const areaRoutes = require("./routes/area");
app.use("/api/area", areaRoutes);

const cargoRoutes = require("./routes/cargo");
app.use("/api/cargo", cargoRoutes);

const tareaRoutes = require("./routes/tarea");
app.use("/api/tarea", tareaRoutes);

const publicacionRoutes = require("./routes/publicacion");
app.use("/api/publicacion", publicacionRoutes);

const comentarioRoutes = require("./routes/comentario");
app.use("/api/comentario", comentarioRoutes);

const incidenciaRoutes = require("./routes/incidencia");
app.use("/api/incidencia", incidenciaRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.status(200).send({
    message: "✅ API Red-Social-Empresa funcionando correctamente",
  });
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(
        `🚀 Servidor corriendo en http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("❌ Error de conexión:", error);
  });
