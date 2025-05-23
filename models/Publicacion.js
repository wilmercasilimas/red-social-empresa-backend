const { Schema, model, Types } = require("mongoose");

const PublicacionSchema = new Schema({
  texto: {
    type: String,
    trim: true,
    required: true,
  },
  imagen: {
    type: String, // Nombre del archivo de imagen
    default: null,
  },
  tarea: {
    type: Types.ObjectId,
    ref: "Tarea",
    required: true,
  },
  autor: { // 🔁 Renombrado de 'autor' a 'usuario'
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  creado_en: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Publicacion", PublicacionSchema);
