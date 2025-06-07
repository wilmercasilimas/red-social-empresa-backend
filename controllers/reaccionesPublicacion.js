// controllers/reaccionesPublicacion.js
const ReaccionPublicacion = require("../models/ReaccionPublicacion");
const mongoose = require("mongoose");

// ✅ Crear o actualizar una reacción
const reaccionar = async (req, res) => {
  try {
    const { publicacionId, tipo } = req.body;
    const autorId = req.user.id;

    const existente = await ReaccionPublicacion.findOne({
      publicacion: publicacionId,
      autor: autorId,
    });

    if (existente) {
      if (existente.tipo === tipo) {
        return res.status(200).json({ mensaje: "Ya habías reaccionado con este tipo" });
      }
      existente.tipo = tipo;
      await existente.save();
      return res.status(200).json({ mensaje: "Reacción actualizada", reaccion: existente });
    }

    const nueva = new ReaccionPublicacion({
      publicacion: publicacionId,
      tipo,
      autor: autorId,
    });

    await nueva.save();
    res.status(201).json({ mensaje: "Reacción registrada", reaccion: nueva });
  } catch (error) {
    console.error("[reaccionar]", error);
    res.status(500).json({ error: "Error al registrar reacción" });
  }
};

// ✅ Eliminar una reacción del usuario autenticado
const eliminarReaccion = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    const autorId = req.user.id;

    const eliminada = await ReaccionPublicacion.findOneAndDelete({
      publicacion: publicacionId,
      autor: autorId,
    });

    if (!eliminada) {
      return res.status(404).json({ error: "Reacción no encontrada" });
    }

    res.json({ mensaje: "Reacción eliminada" });
  } catch (error) {
    console.error("[eliminarReaccion]", error);
    res.status(500).json({ error: "Error al eliminar reacción" });
  }
};

// ✅ Obtener resumen de reacciones por tipo
const obtenerReacciones = async (req, res) => {
  try {
    const { publicacionId } = req.params;

    const resumen = await ReaccionPublicacion.aggregate([
      { $match: { publicacion: mongoose.Types.ObjectId(publicacionId) } },
      { $group: { _id: "$tipo", total: { $sum: 1 } } },
    ]);

    const resultado = { like: 0, dislike: 0, love: 0 };
    resumen.forEach((r) => {
      resultado[r._id] = r.total;
    });

    res.json({ reacciones: resultado });
  } catch (error) {
    console.error("[obtenerReacciones]", error);
    res.status(500).json({ error: "Error al obtener reacciones" });
  }
};

module.exports = {
  reaccionar,
  eliminarReaccion,
  obtenerReacciones,
};
