// models/User.js
const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellidos: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  cargo: {
    type: String,
    default: "empleado",
  },
  area: {
    type: Types.ObjectId,
    ref: "Area",
    default: null,
  },
  rol: {
    type: String,
    enum: ["admin", "gerente", "presidencia", "empleado"],
    default: "empleado",
  },
  imagen: {
    type: String,
    default: "default.png",
  },
  creado_en: {
    type: Date,
    default: Date.now,
  },
  activo: {
    type: Boolean,
    default: true,
  },
  fecha_ingreso: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("User", UserSchema);
