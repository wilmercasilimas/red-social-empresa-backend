// ✅ models/Area.js
const { Schema, model } = require("mongoose");

const AreaSchema = Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  creado_en: {
    type: Date,
    default: Date.now
  },
  activa: {
    type: Boolean,
    default: true
  }
});

module.exports = model("Area", AreaSchema);