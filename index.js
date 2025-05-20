// index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Carga variables de entorno desde .env

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de usuario
const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.status(200).send({
    message: "✅ API Red-Social-Empresa funcionando correctamente",
  });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error de conexión:", error);
  });
