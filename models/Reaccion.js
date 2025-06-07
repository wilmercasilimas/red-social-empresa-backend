// models/Reaccion.js
const mongoose = require("mongoose");

const ReaccionSchema = new mongoose.Schema(
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
      enum: ["like", "love", "dislike"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reaccion", ReaccionSchema);
