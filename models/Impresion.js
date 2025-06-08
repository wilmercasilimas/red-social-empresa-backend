// models/Impresion.js
const mongoose = require("mongoose");

const ImpresionSchema = new mongoose.Schema(
  {
    publicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publicacion",
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tipo: {
      type: String,
      enum: ["like", "love", "dislike"], // puedes cambiar los valores si deseas
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Impresion", ImpresionSchema);
