const Publicacion = require("../models/Publicacion");
const fs = require("fs");
const path = require("path");
const { cloudinary, subirImagenPublicacion } = require("../helpers/cloudinary");

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
    if (req.files && req.files.length > 0) {
      const archivo = req.files[0];
      const localPath = path.join(__dirname, "../uploads/publicaciones", archivo.filename);
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
    if (req.files && req.files.length > 0) {
      const archivo = req.files[0];
      const localPath = path.join(__dirname, "../uploads/publicaciones", archivo.filename);
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

// Listar publicaciones del usuario autenticado
const misPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ autor: req.user.id })
      .populate("tarea")
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

// ✅ Listar TODAS las publicaciones (todos los roles) con paginación
const listarTodasPublicaciones = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const skip = (pagina - 1) * limite;

    const total = await Publicacion.countDocuments();
    const publicaciones = await Publicacion.find()
      .populate("tarea")
      .sort({ creado_en: -1 })
      .skip(skip)
      .limit(limite);

    const totalPaginas = Math.ceil(total / limite);

    return res.status(200).json({
      status: "success",
      paginaActual: pagina,
      totalPaginas,
      totalPublicaciones: total,
      publicaciones,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar publicaciones.",
    });
  }
};

// ✅ Eliminar publicación + imagen en Cloudinary
const eliminarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const esAdmin = req.user.rol === "admin";

    const publicacion = await Publicacion.findById(id);
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

    // 🧹 Si tiene imagen, eliminarla de Cloudinary
    if (publicacion.imagen) {
      const publicIdMatch = publicacion.imagen.match(/\/publicaciones_empresa\/(.+)\.(jpg|png|jpeg|gif)/);
      if (publicIdMatch && publicIdMatch[1]) {
        const publicId = `publicaciones_empresa/${publicIdMatch[1]}`;
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Publicacion.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Publicación eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar la publicación.",
    });
  }
};

module.exports = {
  crearPublicacion,
  editarPublicacion,
  misPublicaciones,
  listarTodasPublicaciones,
  eliminarPublicacion,
};
