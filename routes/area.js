const express = require("express");
const router = express.Router();

// ✅ Importación correcta y única de todos los controladores de área
const { crearArea, listarAreas, eliminarArea, detalleArea } = require("../controllers/area");

// ✅ Middleware de autenticación y verificación de rol
const { auth, esAdmin } = require("../middlewares/auth");

// ✅ Crear nueva área (solo admin)
router.post("/crear", auth, esAdmin, crearArea);

// ✅ Listar todas las áreas (cualquier usuario autenticado)
router.get("/listar", auth, listarAreas);

// ✅ Eliminar un área por ID (solo admin)
router.delete("/eliminar/:id", auth, esAdmin, eliminarArea);

// ✅ Obtener detalle de un área con sus empleados (solo admin)
router.get("/detalle/:id", auth, esAdmin, detalleArea);

module.exports = router;
