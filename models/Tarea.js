const { Schema, model, Types } = require("mongoose");

const TareaSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  asignada_a: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  creada_por: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  estado: {
    type: String,
    enum: ["pendiente", "en progreso", "completada"],
    default: "pendiente"
  },
  fecha_entrega: {
    type: Date
  },
  creada_en: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("Tarea", TareaSchema);
