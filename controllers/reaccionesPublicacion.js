// controllers/reaccionesPublicacion.js
const Reaccion = require("../models/Reaccion");
const Publicacion = require("../models/Publicacion");

const agregarReaccion = async (req, res) => {
  try {
    const { publicacionId, tipo } = req.body;
    const usuarioId = req.user.id;

    if (!publicacionId || !tipo) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    const tiposPermitidos = ["like", "love", "dislike"];
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ msg: "Tipo de reacción no válido" });
    }

    const existePublicacion = await Publicacion.findById(publicacionId);
    if (!existePublicacion) {
      return res.status(404).json({ msg: "Publicación no encontrada" });
    }

    const reaccionExistente = await Reaccion.findOne({
      publicacion: publicacionId,
      usuario: usuarioId,
    });

    if (reaccionExistente) {
      reaccionExistente.tipo = tipo;
      await reaccionExistente.save();
      return res.json({ msg: "Reacción actualizada correctamente" });
    }

    const nuevaReaccion = new Reaccion({
      publicacion: publicacionId,
      usuario: usuarioId,
      tipo,
    });

    await nuevaReaccion.save();
    res.json({ msg: "Reacción registrada correctamente" });
  } catch (error) {
    console.error("Error al agregar reacción:", error);
    res.status(500).json({ msg: "Error interno al agregar la reacción" });
  }
};

module.exports = agregarReaccion;
