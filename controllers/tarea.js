const Tarea = require("../models/Tarea");
const User = require("../models/User");

// Crear tarea
const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, asignada_a, fecha_entrega } = req.body;

    // Verificar si el creador tiene rol válido
    const creador = req.user;

    if (!["admin", "gerencia"].includes(creador.rol)) {
      return res.status(403).json({
        status: "error",
        message: "Solo administradores o gerencia pueden crear tareas.",
      });
    }

    // Verificar que el usuario asignado exista y tenga un cargo permitido
    const usuarioAsignado = await User.findById(asignada_a);

    if (!usuarioAsignado) {
      return res.status(404).json({
        status: "error",
        message: "Usuario asignado no encontrado.",
      });
    }

    const cargosNoPermitidos = ["admin", "gerencia", "ejecutivos", "precidencia"];
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

// Listar tareas del usuario autenticado
const listarTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ asignada_a: req.user.id })
      .populate("creada_por", "nombre apellidos email")
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

// Editar tarea
const editarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, fecha_entrega } = req.body;

    const tareaActualizada = await Tarea.findByIdAndUpdate(
      id,
      { titulo, descripcion, estado, fecha_entrega },
      { new: true }
    );

    if (!tareaActualizada) {
      return res.status(404).json({
        status: "error",
        message: "Tarea no encontrada.",
      });
    }

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

// Eliminar tarea
const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const tareaEliminada = await Tarea.findByIdAndDelete(id);

    if (!tareaEliminada) {
      return res.status(404).json({
        status: "error",
        message: "Tarea no encontrada.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Tarea eliminada correctamente.",
      tarea: tareaEliminada,
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
};
