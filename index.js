// index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fileUpload = require("express-fileupload"); // ✅ nuevo

dotenv.config(); // Carga variables de entorno desde .env

const app = express();

// Configuración global de Mongoose
mongoose.set("strictPopulate", false); // ✅ Para evitar errores con populate

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Habilitar subida de archivos con express-fileupload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// Rutas de usuario
const userRoutes = require("./routes/user");
// Servir archivos estáticos desde uploads/avatars
app.use(
  "/api/avatar",
  express.static(path.join(__dirname, "uploads", "avatars"))
);

app.use("/api/user", userRoutes);

// Rutas de área
const areaRoutes = require("./routes/area");
app.use("/api/area", areaRoutes);

// Rutas de cargo
const cargoRoutes = require("./routes/cargo");
app.use("/api/cargo", cargoRoutes);

// Rutas de tareas
const tareaRoutes = require("./routes/tarea");
app.use("/api/tarea", tareaRoutes);

// Rutas de publicaciones
const publicacionRoutes = require("./routes/publicacion");
app.use("/api/publicacion", publicacionRoutes);

// Rutas de incidencias
const incidenciaRoutes = require("./routes/incidencia");
app.use("/api/incidencia", incidenciaRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.status(200).send({
    message: "✅ API Red-Social-Empresa funcionando correctamente",
  });
});

// Conexión a MongoDB (simplificada para Mongoose moderno)
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
