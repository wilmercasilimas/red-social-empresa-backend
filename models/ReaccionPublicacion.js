// models/ReaccionPublicacion.js
const mongoose = require("mongoose");

const ReaccionPublicacionSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ["like", "dislike", "love"], // Tipos permitidos de reacción
      required: true,
    },
    publicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publicacion",
      required: true,
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creado_en: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// ✅ Índice único para que un usuario solo pueda tener una reacción por publicación
ReaccionPublicacionSchema.index({ publicacion: 1, autor: 1 }, { unique: true });

module.exports = mongoose.model("ReaccionPublicacion", ReaccionPublicacionSchema);
