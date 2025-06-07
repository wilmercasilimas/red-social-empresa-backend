const mongoose = require("mongoose");

const ReaccionSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ["like", "dislike", "love"], // 👍 👎 ❤️
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

// ✅ Garantizar una sola reacción por usuario por publicación
ReaccionSchema.index({ publicacion: 1, autor: 1 }, { unique: true });

module.exports = mongoose.model("Reaccion", ReaccionSchema);
