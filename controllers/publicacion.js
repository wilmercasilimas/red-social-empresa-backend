const Publicacion = require("../models/Publicacion");
const fs = require("fs");
const path = require("path");
const { subirImagenPublicacion } = require("../helpers/cloudinary");

// Crear nueva publicación
const crearPublicacion = async (req, res) => {
  try {
    const { texto, tarea } = req.body;
    const autor = req.user.id;

    if (!texto || !tarea) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios.",
      });
    }

    let imagenUrl = null;

    if (req.file) {
      const localPath = path.join(__dirname, "../uploads/publicaciones/", req.file.filename);
      imagenUrl = await subirImagenPublicacion(localPath);
      fs.unlinkSync(localPath);
    }

    const nuevaPublicacion = new Publicacion({
      texto,
      tarea,
      autor,
      imagen: imagenUrl,
    });

    await nuevaPublicacion.save();

    return res.status(200).json({
      status: "success",
      message: "Publicación creada correctamente.",
      publicacion: nuevaPublicacion,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear la publicación.",
    });
  }
};

// Editar publicación existente
const editarPublicacion = async (req, res) => {
  try {
    const { texto, tarea } = req.body;
    const publicacionId = req.params.id;
    const usuarioId = req.user.id;
    const esAdmin = req.user.rol === "admin";

    if (!texto || !tarea) {
      return res.status(400).json({
        status: "error",
        message: "Los campos 'texto' y 'tarea' son obligatorios.",
      });
    }

    const publicacion = await Publicacion.findById(publicacionId);

    if (!publicacion) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada.",
      });
    }

    if (publicacion.autor.toString() !== usuarioId && !esAdmin) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para editar esta publicación.",
      });
    }

    let imagenUrl = publicacion.imagen;

    if (req.file) {
      const localPath = path.join(__dirname, "../uploads/publicaciones/", req.file.filename);
      imagenUrl = await subirImagenPublicacion(localPath);
      fs.unlinkSync(localPath);
    }

    publicacion.texto = texto;
    publicacion.tarea = tarea;
    publicacion.imagen = imagenUrl;

    await publicacion.save();

    return res.status(200).json({
      status: "success",
      message: "Publicación actualizada correctamente.",
      publicacion,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al editar la publicación.",
    });
  }
};

// Obtener todas las publicaciones
const listarTodasPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find()
      .populate("autor", "nombre apellidos imagen rol")
      .sort({ creado_en: -1 });

    return res.status(200).json({
      status: "success",
      publicaciones,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener publicaciones.",
    });
  }
};

// Obtener publicaciones del usuario
const misPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ autor: req.user.id })
      .sort({ creado_en: -1 });

    return res.status(200).json({
      status: "success",
      publicaciones,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener tus publicaciones.",
    });
  }
};

// Eliminar publicación
const eliminarPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id);

    if (!publicacion) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada.",
      });
    }

    if (publicacion.autor.toString() !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "No tienes permiso para eliminar esta publicación.",
      });
    }

    await publicacion.deleteOne();

    return res.status(200).json({
      status: "success",
      message: "Publicación eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar publicación.",
    });
  }
};

module.exports = {
  crearPublicacion,
  editarPublicacion,
  listarTodasPublicaciones,
  misPublicaciones,
  eliminarPublicacion,
};
