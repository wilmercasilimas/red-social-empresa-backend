// models/Incidencia.js
const { Schema, model, Types } = require("mongoose");

const IncidenciaSchema = new Schema({
  tipo: {
    type: String,
    required: true,
    enum: [
      "permiso",
      "reposo",
      "falta",
      "cumpleaños",
      "aniversario"
    ]
  },
  descripcion: {
    type: String,
    trim: true
  },
  usuario: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  asignada_por: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  fecha_inicio: {
    type: Date,
    required: true
  },
  fecha_fin: {
    type: Date,
    required: true
  },
  creada_en: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("Incidencia", IncidenciaSchema);
