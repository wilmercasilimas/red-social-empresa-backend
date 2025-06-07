const Reaccion = require("../models/Reaccion");

// Crear o actualizar una reacción
const reaccionar = async (req, res) => {
  try {
    const { publicacionId, tipo } = req.body;
    const autorId = req.user.id;

    // Verifica si ya existe una reacción del mismo tipo
    const existente = await Reaccion.findOne({
      publicacion: publicacionId,
      autor: autorId,
    });

    if (existente) {
      if (existente.tipo === tipo) {
        return res.status(200).json({ mensaje: "Ya habías reaccionado con este tipo" });
      }
      // Actualiza si es distinto
      existente.tipo = tipo;
      await existente.save();
      return res.status(200).json({ mensaje: "Reacción actualizada", reaccion: existente });
    }

    // Crear nueva
    const nueva = new Reaccion({
      publicacion: publicacionId,
      tipo,
      autor: autorId,
    });

    await nueva.save();
    res.status(201).json({ mensaje: "Reacción registrada", reaccion: nueva });
  } catch (err) {
    console.error("[reaccionar]", err);
    res.status(500).json({ error: "Error al registrar reacción" });
  }
};

// Eliminar reacción propia
const eliminarReaccion = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    const autorId = req.user.id;

    const eliminada = await Reaccion.findOneAndDelete({
      publicacion: publicacionId,
      autor: autorId,
    });

    if (!eliminada) {
      return res.status(404).json({ error: "Reacción no encontrada" });
    }

    res.json({ mensaje: "Reacción eliminada" });
  } catch (err) {
    console.error("[eliminarReaccion]", err);
    res.status(500).json({ error: "Error al eliminar reacción" });
  }
};

// Obtener resumen por publicación
const obtenerReacciones = async (req, res) => {
  try {
    const { publicacionId } = req.params;

    const resumen = await Reaccion.aggregate([
      { $match: { publicacion: publicacionId } },
      { $group: { _id: "$tipo", total: { $sum: 1 } } },
    ]);

    const resultado = {
      like: 0,
      dislike: 0,
      love: 0,
    };

    resumen.forEach((r) => {
      resultado[r._id] = r.total;
    });

    res.json({ reacciones: resultado });
  } catch (err) {
    console.error("[obtenerReacciones]", err);
    res.status(500).json({ error: "Error al obtener reacciones" });
  }
};

module.exports = {
  reaccionar,
  eliminarReaccion,
  obtenerReacciones,
};
