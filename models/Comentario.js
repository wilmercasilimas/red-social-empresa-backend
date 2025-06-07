// ✅ models/Comentario.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ComentarioSchema = new Schema({
  contenido: {
    type: String,
    required: true,
    trim: true,
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  publicacion: {
    type: Schema.Types.ObjectId,
    ref: "Publicacion",
    required: true,
  },
  creado_en: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Comentario", ComentarioSchema);