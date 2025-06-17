const Tarea = require("../models/Tarea");
const User = require("../models/User");
const { enviarCorreoTarea } = require("../helpers/enviarCorreoTareaAsignada");

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

    const fechaEntregaAjustada = new Date(fecha_entrega);
    fechaEntregaAjustada.setHours(23, 59, 59, 999);

    const nuevaTarea = new Tarea({
      titulo,
      descripcion,
      asignada_a,
      fecha_entrega: fechaEntregaAjustada.toISOString(),
      creada_por: creador.id,
    });

    const tareaGuardada = await nuevaTarea.save();

    try {
      await enviarCorreoTarea(
        "asignada",
        usuarioAsignado.email,
        usuarioAsignado.nombre,
        titulo,
        fechaEntregaAjustada.toISOString()
      );
    } catch (_) {}

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
    const { asignada_a, creada_por, area, pagina = 1, limite = 10 } = req.query;

    const filtro = {};
    if (asignada_a) filtro["asignada_a"] = asignada_a;
    if (creada_por) filtro["creada_por"] = creada_por;

    const page = parseInt(pagina);
    const limit = parseInt(limite);

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
        (t) => t.asignada_a?.area?._id?.toString() === area
      );
    }

    const total = tareas.length;
    const inicio = (page - 1) * limit;
    const tareasPaginadas = tareas.slice(inicio, inicio + limit);

    return res.status(200).json({
      status: "success",
      message: "Listado de todas las tareas.",
      total,
      pagina: page,
      limite: limit,
      paginas: Math.ceil(total / limit),
      tareas: tareasPaginadas,
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
    const { pagina = 1, limite = 10 } = req.query;
    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    const limit = parseInt(limite);

    const filtro = { asignada_a: req.user.id };

    const [tareas, total] = await Promise.all([
      Tarea.find(filtro)
        .populate("creada_por", "nombre apellidos email")
        .populate("asignada_a", "nombre apellidos email")
        .sort({ creada_en: -1 })
        .skip(skip)
        .limit(limit),
      Tarea.countDocuments(filtro),
    ]);

    return res.status(200).json({
      status: "success",
      message: "Listado de tareas.",
      total,
      pagina: parseInt(pagina),
      paginas: Math.ceil(total / limit),
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

    const tarea = await Tarea.findById(id).populate(
      "asignada_a",
      "email nombre"
    );

    if (!["admin", "gerente"].includes(req.user.rol.toLowerCase())) {
      return res.status(403).json({
        status: "error",
        message: "No autorizado para editar esta tarea.",
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

    try {
      const destinatario = tarea.asignada_a?.email;
      const nombre = tarea.asignada_a?.nombre;

      if (destinatario && nombre) {
        const tipoCorreo = estado === "completada" ? "completada" : "editada";
        await enviarCorreoTarea(
          tipoCorreo,
          destinatario,
          nombre,
          titulo,
          fecha_entrega
        );
      }
    } catch (_) {}

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

    if (!["admin", "gerente"].includes(req.user.rol.toLowerCase())) {
      return res.status(403).json({
        status: "error",
        message: "No autorizado para eliminar esta tarea.",
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
