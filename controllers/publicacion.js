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
        message: "Los campos 'texto' y 'tarea' son obligatorios.",
      });
    }

    let imagenUrl = null;

    if (req.file) {
      const localPath = path.join(__dirname, "../uploads/publicaciones", req.file.filename);
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
      message: "Error interno al crear la publicación.",
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

// ✅ Listar todas las publicaciones (con paginación)
const listarTodasPublicaciones = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 5;
    const skip = (pagina - 1) * limite;

    const total = await Publicacion.countDocuments();

    const publicaciones = await Publicacion.find()
      .populate("autor", "nombre apellidos imagen rol")
      .populate("tarea")
      .sort({ creado_en: -1 })
      .skip(skip)
      .limit(limite);

    return res.status(200).json({
      status: "success",
      total,
      pagina,
      limite,
      publicaciones,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener publicaciones.",
    });
  }
};

// ✅ Listar todas las publicaciones (ruta alternativa con paginación)
const misPublicaciones = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 5;
    const skip = (pagina - 1) * limite;

    const total = await Publicacion.countDocuments();

    const publicaciones = await Publicacion.find()
      .populate("autor", "nombre apellidos imagen rol")
      .populate("tarea")
      .sort({ creado_en: -1 })
      .skip(skip)
      .limit(limite);

    return res.status(200).json({
      status: "success",
      total,
      pagina,
      limite,
      publicaciones,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener publicaciones.",
    });
  }
};

// Eliminar publicación
const eliminarPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id);
    const usuarioId = req.user.id;
    const esAdmin = req.user.rol === "admin";

    if (!publicacion) {
      return res.status(404).json({
        status: "error",
        message: "Publicación no encontrada.",
      });
    }

    if (publicacion.autor.toString() !== usuarioId && !esAdmin) {
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
