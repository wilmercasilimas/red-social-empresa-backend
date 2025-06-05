const { Schema, model, Types } = require("mongoose");

const ComentarioSchema = new Schema({
  publicacion: {
    type: Types.ObjectId,
    ref: "Publicacion",
    required: true,
  },
  usuario: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  contenido: {
    type: String,
    required: true,
    trim: true,
  },
  creado_en: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Comentario", ComentarioSchema);
