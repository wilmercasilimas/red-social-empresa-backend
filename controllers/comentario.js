// ✅ controllers/comentario.js
const Comentario = require("../models/Comentario");

const crearComentario = async (req, res) => {
  try {
    const { contenido, publicacion } = req.body;
    const nuevoComentario = new Comentario({
      contenido,
      publicacion,
      autor: req.user.id,
    });
    const guardado = await nuevoComentario.save();
    await guardado.populate("autor", "nombre apellidos imagen");
    res.status(201).json({ comentario: guardado });
  } catch (err) {
    console.error("[crearComentario]", err);
    res.status(500).json({ error: "Error al crear comentario" });
  }
};

const obtenerComentarios = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    const comentarios = await Comentario.find({ publicacion: publicacionId })
      .populate("autor", "nombre apellidos imagen")
      .sort({ creado_en: -1 });
    res.json({ comentarios });
  } catch (err) {
    console.error("[obtenerComentarios]", err);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};

module.exports = {
  crearComentario,
  obtenerComentarios,
};