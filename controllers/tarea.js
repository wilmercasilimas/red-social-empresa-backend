const Tarea = require("../models/Tarea");
const User = require("../models/User");
const {
  enviarCorreoTareaAsignada,
} = require("../helpers/enviarCorreoTareaAsignada");

const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, asignada_a, fecha_entrega } = req.body;
    const creador = req.user;

    if (!["admin", "gerente"].includes(creador.rol?.toLowerCase())) {
      return res.status(403).json({
        status: "error",
        message: "Solo administradores o gerencia pueden crear tareas.",
      });
    }

    const usuarioAsignado = await User.findById(asignada_a);
    if (!usuarioAsignado) {
      return res.status(404).json({
        status: "error",
        message: "Usuario asignado no encontrado.",
      });
    }

    const cargosNoPermitidos = [
      "admin",
      "gerencia",
      "ejecutivos",
      "precidencia",
    ];
    if (cargosNoPermitidos.includes(usuarioAsignado.cargo.toLowerCase())) {
      return res.status(400).json({
        status: "error",
        message: "No se puede asignar tareas a este cargo.",
      });
    }

    const nuevaTarea = new Tarea({
      titulo,
      descripcion,
      asignada_a,
      fecha_entrega,
      creada_por: creador.id,
    });

    const tareaGuardada = await nuevaTarea.save();

    // ✅ Envío de correo al asignado
    try {
      await enviarCorreoTareaAsignada(
        usuarioAsignado.email,
        usuarioAsignado.nombre,
        titulo,
        fecha_entrega
      );
    } catch (correoError) {
      console.warn(
        "⚠️ Tarea creada, pero fallo al enviar correo:",
        correoError.message
      );
    }

    return res.status(201).json({
      status: "success",
      message: "Tarea creada correctamente.",
      tarea: tareaGuardada,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear tarea.",
      error: error.message,
    });
  }
};

const listarTodasTareas = async (req, res) => {
  try {
    const { asignada_a, creada_por, area } = req.query;

    const filtro = {};

    if (asignada_a) filtro["asignada_a"] = asignada_a;
    if (creada_por) filtro["creada_por"] = creada_por;

    let tareas = await Tarea.find(filtro)
      .populate({
        path: "asignada_a",
        select: "nombre apellidos email area",
        populate: { path: "area", select: "nombre" },
      })
      .populate("creada_por", "nombre apellidos email")
      .sort({ creada_en: -1 });

    if (area) {
      tareas = tareas.filter(
        (tarea) =>
          typeof tarea.asignada_a === "object" &&
          tarea.asignada_a.area &&
          tarea.asignada_a.area._id.toString() === area
      );
    }

    return res.status(200).json({
      status: "success",
      message: "Listado de todas las tareas.",
      total: tareas.length,
      tareas,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener las tareas.",
      error: error.message,
    });
  }
};


const listarTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ asignada_a: req.user.id })
      .populate("creada_por", "nombre apellidos email")
      .populate("asignada_a", "nombre apellidos email")
      .sort({ creada_en: -1 });

    return res.status(200).json({
      status: "success",
      message: "Listado de tareas.",
      total: tareas.length,
      tareas,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener tareas.",
      error: error.message,
    });
  }
};

const editarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, fecha_entrega } = req.body;

    const tarea = await Tarea.findById(id);

    if (!tarea) {
      return res.status(404).json({
        status: "error",
        message: "Tarea no encontrada.",
      });
    }

    if (
      tarea.creada_por.toString() !== req.user.id &&
      req.user.rol !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "No autorizado para editar esta tarea.",
      });
    }

    tarea.titulo = titulo;
    tarea.descripcion = descripcion;
    tarea.estado = estado;
    tarea.fecha_entrega = fecha_entrega;

    const tareaActualizada = await tarea.save();

    return res.status(200).json({
      status: "success",
      message: "Tarea actualizada correctamente.",
      tarea: tareaActualizada,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar tarea.",
      error: error.message,
    });
  }
};

const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findById(id);

    if (!tarea) {
      return res.status(404).json({
        status: "error",
        message: "Tarea no encontrada.",
      });
    }

    if (
      tarea.creada_por.toString() !== req.user.id &&
      req.user.rol !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "No autorizado para eliminar esta tarea.",
      });
    }

    await Tarea.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Tarea eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar tarea.",
      error: error.message,
    });
  }
};

module.exports = {
  crearTarea,
  listarTareas,
  editarTarea,
  eliminarTarea,
  listarTodasTareas,
};
