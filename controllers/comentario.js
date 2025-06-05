const Comentario = require("../models/Comentario");
const Publicacion = require("../models/Publicacion");

// Crear un comentario en una publicación
const crearComentario = async (req, res) => {
  try {
    const { contenido, publicacion } = req.body;
    const usuario = req.user.id;

    if (!contenido || !publicacion) {
      return res.status(400).json({
        status: "error",
        message: "Contenido y publicación son obligatorios.",
      });
    }

    // Verificar que la publicación existe
    const existe = await Publicacion.findById(publicacion);
    if (!existe) {
      return res.status(404).json({
        status: "error",
        message: "La publicación no existe.",
      });
    }

    const nuevoComentario = new Comentario({
      contenido,
      publicacion,
      usuario,
    });

    await nuevoComentario.save();

    return res.status(200).json({
      status: "success",
      message: "Comentario creado correctamente.",
      comentario: nuevoComentario,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear comentario.",
    });
  }
};

// Listar comentarios de una publicación
const listarComentariosPorPublicacion = async (req, res) => {
  try {
    const publicacionId = req.params.id;

    const comentarios = await Comentario.find({ publicacion: publicacionId })
      .populate("usuario", "nombre apellidos imagen rol")
      .sort({ creado_en: -1 });

    return res.status(200).json({
      status: "success",
      comentarios,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener comentarios.",
    });
  }
};

// Eliminar un comentario (solo autor o admin)
const eliminarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);

    if (!comentario) {
      return res.status(404).json({
        status: "error",
        message: "Comentario no encontrado.",
      });
    }

    const esAutor = comentario.usuario.toString() === req.user.id;
    const esAdmin = req.user.rol === "admin";

    if (!esAutor && !esAdmin) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para eliminar este comentario.",
      });
    }

    await comentario.deleteOne();

    return res.status(200).json({
      status: "success",
      message: "Comentario eliminado correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar el comentario.",
    });
  }
};

module.exports = {
  crearComentario,
  listarComentariosPorPublicacion,
  eliminarComentario,
};
