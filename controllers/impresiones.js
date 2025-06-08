const Impresion = require("../models/Impresion");

const registrarImpresion = async (req, res) => {
  try {
    const { publicacionId, tipo } = req.body;
    const usuarioId = req.user.id;

    const nuevaImpresion = new Impresion({
      publicacion: publicacionId,
      tipo,
      usuario: usuarioId,
    });

    await nuevaImpresion.save();

    res.status(201).json({
      status: "success",
      mensaje: "Impresión registrada correctamente",
      impresion: nuevaImpresion,
    });
  } catch (error) {
    console.error("Error al registrar impresión:", error);
    res.status(500).json({
      status: "error",
      mensaje: "Error al registrar impresión",
    });
  }
};

module.exports = registrarImpresion;
