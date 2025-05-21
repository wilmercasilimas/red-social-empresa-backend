// crearAdmin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// Modelos
const User = require("./models/User");
const Area = require("./models/Area");

const crearAdmin = async () => {
  try {
    // Conexión a la base de datos
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a la base de datos");

    // 1. Buscar o crear el área "Dirección"
    let area = await Area.findOne({ nombre: "Dirección" });

    if (!area) {
      area = new Area({
        nombre: "Dirección",
        descripcion: "Área de dirección general del sistema",
      });
      await area.save();
      console.log("📌 Área 'Dirección' creada correctamente.");
    }

    // 2. Verificar si ya existe un administrador con ese email
    const existe = await User.findOne({ email: "wilmercasilimas@gmail.com" });

    if (existe) {
      console.log("⚠️ Ya existe un administrador con ese correo.");
      return process.exit(0);
    }

    // 3. Crear y guardar administrador
    const password = "wilmer2304"; // Puedes cambiar esta contraseña
    const hashedPass = await bcrypt.hash(password, 10);

    const admin = new User({
      nombre: "Admin",
      apellidos: "Principal",
      email: "wilmercasilimas@gmail.com",
      password: hashedPass,
      cargo: "Administrador",
      area: area._id, // ObjectId correcto del área
      rol: "admin",
    });

    await admin.save();
    console.log("✅ Administrador creado correctamente.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al conectar o crear admin:", error);
    process.exit(1);
  }
};

crearAdmin();
