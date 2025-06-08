const Reaccion = require("../models/Reaccion");

const agregarReaccion = async (req, res) => {
  try {
    const { publicacionId, tipo } = req.body;
    const usuarioId = req.user.id;

    const nuevaReaccion = new Reaccion({
      publicacion: publicacionId,
      tipo,
      usuario: usuarioId,
    });

    await nuevaReaccion.save();

    res.status(201).json({
      status: "success",
      mensaje: "Reacción registrada correctamente",
      reaccion: nuevaReaccion,
    });
  } catch (error) {
    console.error("Error al agregar reacción:", error);
    res.status(500).json({
      status: "error",
      mensaje: "Error al agregar reacción",
    });
  }
};

module.exports = agregarReaccion; // ⚠️ Exportar como función directa
