// crearAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, { // ✅ corregido aquí
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Conectado a la base de datos");

    // Verifica si ya hay un admin
    const existeAdmin = await User.findOne({ rol: "admin" });
    if (existeAdmin) {
      console.log("⚠️ Ya existe un administrador, abortando...");
      return mongoose.disconnect();
    }

    // Datos del administrador
    const password = "wilmer2304"; // Cambia esto si quieres
    const hashedPass = await bcrypt.hash(password, 10);

    const admin = new User({
      nombre: "Admin",
      apellidos: "Principal",
      email: "wilmercasilimas@gmail.com",
      password: hashedPass,
      cargo: "Administrador",
      area: "Dirección",
      rol: "admin",
    });

    await admin.save();
    console.log("✅ Administrador creado con éxito:");
    console.log({
      email: admin.email,
      password: password,
    });

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error al conectar o crear admin:", err);
  });
