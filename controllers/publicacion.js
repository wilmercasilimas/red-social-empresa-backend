const Publicacion = require("../models/Publicacion");
const fs = require("fs");
const path = require("path");

// Crear publicación con o sin imagen
const crearPublicacion = async (req, res) => {
  try {
    const { texto, tarea } = req.body;

    if (!texto || !tarea) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios: texto o tarea.",
      });
    }

    let nueva = new Publicacion({
      autor: req.user.id,
      texto,
      tarea,
    });

    // Si se sube una imagen
    if (req.file) {
      nueva.imagen = req.file.filename;
    }

    const guardada = await nueva.save();

    return res.status(201).json({
      status: "success",
      message: "Publicación creada correctamente.",
      publicacion: guardada,
    });
  } catch (error) {
    console.error("❌ Error al crear publicación:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al crear publicación.",
      error: error.message,
    });
  }
};

// Obtener publicaciones del usuario logueado
const misPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ autor: req.user.id })
      .populate("tarea", "titulo")
      .sort({ creado_en: -1 });

    return res.status(200).json({
      status: "success",
      total: publicaciones.length,
      publicaciones,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener publicaciones.",
      error: error.message,
    });
  }
};

// Listar todas las publicaciones (admin u otros usuarios autenticados)
const listarTodasPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate("autor", "nombre apellidos email imagen") // ✅ Corrección aquí
      .populate("tarea", "titulo")
      .sort({ creado_en: -1 });

    return res.status(200).json({
      status: "success",
      message: "Listado general de publicaciones.",
      total: publicaciones.length,
      publicaciones,
    });
  } catch (error) {
    console.error("❌ Error al listar publicaciones:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al obtener las publicaciones.",
      error: error.message,
    });
  }
};

// Eliminar una publicación (propietario o admin)
const eliminarPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id);

    if (!publicacion) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada.",
      });
    }

    if (
      publicacion.autor.toString() !== req.user.id &&
      req.user.rol !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "No autorizado para eliminar esta publicación.",
      });
    }

    // Eliminar imagen del sistema si existe
    if (publicacion.imagen) {
      const rutaImagen = path.join(
        __dirname,
        "..",
        "uploads",
        "publicaciones",
        publicacion.imagen
      );
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
    }

    await Publicacion.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "success",
      message: "Publicación eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar publicación.",
      error: error.message,
    });
  }
};

module.exports = {
  crearPublicacion,
  misPublicaciones,
  eliminarPublicacion,
  listarTodasPublicaciones,
};
