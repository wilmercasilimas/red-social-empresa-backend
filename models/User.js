const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    default: "empleado"
  },
  // Área como texto simple (sin ref ni ObjectId)
  area: {
    type: String,
    default: "Sin asignar"
  },
  // Rol del usuario: admin o empleado
  rol: {
    type: String,
    enum: ["admin", "empleado"],
    default: "empleado"
  },
  imagen: {
    type: String,
    default: "default.png"
  },
  creado_en: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("User", UserSchema);
