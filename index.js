const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Carga variables de entorno desde .env

const app = express();

// Configuración global de Mongoose
mongoose.set("strictPopulate", false); // ✅ Para evitar errores con populate

// ✅ CORS dinámico con whitelist (localhost + producción)
const whitelist = [
  "http://localhost:5173",
  "https://red-social-empresa-frontend-9nrj.vercel.app", // ✅ URL real de Vercel
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
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

// ✅ Endpoint keep-alive para Render
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
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
      console.log(`🚀 Servidor corriendo en el puerto ${process.env.PORT}`);
      console.log(`🌐 URL de https://red-social-empresa-backend.onrender.com`);
    });
  })
  .catch((error) => {
    console.error("❌ Error de conexión:", error);
  });

// trigger deploy
