const Area = require("../models/Area");
const User = require("../models/User");

// Crear nueva área
const crearArea = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        status: "error",
        message: "El nombre del área es obligatorio."
      });
    }

    const yaExiste = await Area.findOne({ nombre: nombre.trim() });
    if (yaExiste) {
      return res.status(409).json({
        status: "error",
        message: "Ya existe un área con ese nombre."
      });
    }

    const nuevaArea = new Area({ nombre: nombre.trim(), descripcion });

    const areaGuardada = await nuevaArea.save();

    return res.status(201).json({
      status: "success",
      message: "Área creada correctamente.",
      area: areaGuardada
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear el área.",
      error: error.message
    });
  }
};

// Listar todas las áreas
const listarAreas = async (req, res) => {
  try {
    const areas = await Area.find().sort({ creado_en: -1 });

    return res.status(200).json({
      status: "success",
      message: "Listado de áreas.",
      total: areas.length,
      areas
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar áreas.",
      error: error.message
    });
  }
};

// Detalle de un área con sus empleados
const detalleArea = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await Area.findById(id);
    if (!area) {
      return res.status(404).json({
        status: "error",
        message: "Área no encontrada."
      });
    }

    const empleados = await User.find({ area: id }).select("-password").sort({ creado_en: -1 });

    return res.status(200).json({
      status: "success",
      message: "Área encontrada.",
      area,
      total_empleados: empleados.length,
      empleados
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener el detalle del área.",
      error: error.message
    });
  }
};

// Eliminar un área
const eliminarArea = async (req, res) => {
  try {
    const { id } = req.params;

    const area = await Area.findByIdAndDelete(id);

    if (!area) {
      return res.status(404).json({
        status: "error",
        message: "Área no encontrada."
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Área eliminada correctamente.",
      area
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar el área.",
      error: error.message
    });
  }
};

// Editar un área
const editarArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        status: "error",
        message: "El nombre del área es obligatorio.",
      });
    }

    const areaActualizada = await Area.findByIdAndUpdate(
      id,
      { nombre: nombre.trim(), descripcion },
      { new: true }
    );

    if (!areaActualizada) {
      return res.status(404).json({
        status: "error",
        message: "Área no encontrada.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Área actualizada correctamente.",
      area: areaActualizada,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar el área.",
      error: error.message,
    });
  }
};


module.exports = {
  crearArea,
  listarAreas,
  eliminarArea,
  detalleArea,
  editarArea,
};
