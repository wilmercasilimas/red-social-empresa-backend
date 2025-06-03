const Incidencia = require("../models/Incidencia");
const User = require("../models/User");

// Crear una incidencia (admin o gerencia)
const crearIncidencia = async (req, res) => {
  try {
    const { tipo, descripcion, usuario, fecha_inicio, fecha_fin } = req.body;

    if (!tipo || !usuario || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios.",
      });
    }

    const empleado = await User.findById(usuario);
    if (!empleado) {
      return res.status(404).json({
        status: "error",
        message: "Usuario asignado no encontrado.",
      });
    }

    const nuevaIncidencia = new Incidencia({
      tipo,
      descripcion,
      usuario,
      asignada_por: req.user.id,
      fecha_inicio,
      fecha_fin,
    });

    const guardada = await nuevaIncidencia.save();

    return res.status(201).json({
      status: "success",
      message: "Incidencia creada correctamente.",
      incidencia: guardada,
    });
  } catch (error) {
    console.error("❌ Error al crear incidencia:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al crear incidencia.",
      error: error.message,
    });
  }
};

// Listar incidencias por usuario
const listarPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const incidencias = await Incidencia.find({ usuario: id })
      .populate("asignada_por", "nombre apellidos email")
      .sort({ fecha_inicio: -1 });

    return res.status(200).json({
      status: "success",
      total: incidencias.length,
      incidencias,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar incidencias.",
      error: error.message,
    });
  }
};

// Eliminar incidencia
const eliminarIncidencia = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminada = await Incidencia.findByIdAndDelete(id);
    if (!eliminada) {
      return res.status(404).json({
        status: "error",
        message: "Incidencia no encontrada.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Incidencia eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar incidencia.",
      error: error.message,
    });
  }
};

// Obtener historial completo de incidencias de un usuario
const obtenerIncidenciasPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    const incidencias = await Incidencia.find({ usuario: usuarioId })
      .populate("usuario", "nombre apellidos email cargo imagen")
      .populate("asignada_por", "nombre apellidos email")
      .sort({ fecha_inicio: -1 });

    return res.status(200).json({
      status: "success",
      message: "Historial de incidencias del usuario.",
      total: incidencias.length,
      incidencias,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener incidencias del usuario.",
      error: error.message,
    });
  }
};

// Listar incidencias activas
const listarIncidenciasActivas = async (req, res) => {
  try {
    const ahora = new Date(); // 🟢 Comparación directa sin truncar UTC

    const incidencias = await Incidencia.find({
      fecha_inicio: { $lte: ahora },
      fecha_fin: { $gte: ahora },
    })
      .populate("usuario", "nombre apellidos email cargo area imagen")
      .populate("asignada_por", "nombre apellidos email");

    return res.status(200).json({
      status: "success",
      total: incidencias.length,
      incidencias,
    });
  } catch (error) {
    console.error("❌ Error al listar incidencias activas:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al obtener incidencias activas.",
      error: error.message,
    });
  }
};

module.exports = {
  crearIncidencia,
  listarPorUsuario,
  eliminarIncidencia,
  obtenerIncidenciasPorUsuario,
  listarIncidenciasActivas,
};
