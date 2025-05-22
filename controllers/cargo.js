// controllers/cargo.js

const Cargo = require("../models/Cargo");

// Crear un nuevo cargo (solo admin)
const crearCargo = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    // Validación: nombre obligatorio
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "El nombre del cargo es obligatorio.",
      });
    }

    // Validar duplicados
    const existe = await Cargo.findOne({ nombre: nombre.trim() });
    if (existe) {
      return res.status(409).json({
        status: "error",
        message: "Ya existe un cargo con ese nombre.",
      });
    }

    // Crear nuevo cargo
    const nuevoCargo = new Cargo({
      nombre: nombre.trim(),
      descripcion,
    });

    const cargoGuardado = await nuevoCargo.save();

    return res.status(201).json({
      status: "success",
      message: "Cargo creado correctamente.",
      cargo: cargoGuardado,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear el cargo.",
      error: error.message,
    });
  }
};

// Listar todos los cargos
const listarCargos = async (req, res) => {
  try {
    const cargos = await Cargo.find().sort({ creado_en: -1 });

    return res.status(200).json({
      status: "success",
      message: "Listado de cargos.",
      total: cargos.length,
      cargos,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar los cargos.",
      error: error.message,
    });
  }
};

// Eliminar cargo (solo admin)
const eliminarCargo = async (req, res) => {
  try {
    const { id } = req.params;

    const cargo = await Cargo.findByIdAndDelete(id);

    if (!cargo) {
      return res.status(404).json({
        status: "error",
        message: "Cargo no encontrado.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Cargo eliminado correctamente.",
      cargo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar el cargo.",
      error: error.message,
    });
  }
};

module.exports = {
  crearCargo,
  listarCargos,
  eliminarCargo,
};
