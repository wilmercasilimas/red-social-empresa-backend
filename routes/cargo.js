// routes/cargo.js

const express = require("express");
const router = express.Router();

// Controladores
const { crearCargo, listarCargos, eliminarCargo } = require("../controllers/cargo");

// Middlewares de autenticación y rol
const { auth, esAdmin } = require("../middlewares/auth");

// Crear un cargo (solo admin)
router.post("/crear", auth, esAdmin, crearCargo);

// Listar todos los cargos (usuarios autenticados)
router.get("/listar", auth, listarCargos);

// Eliminar un cargo por ID (solo admin)
router.delete("/eliminar/:id", auth, esAdmin, eliminarCargo);

module.exports = router;
