const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

// ✅ Cargar las funciones del controlador
const reaccionController = require("../controllers/reaccion");

// Crear o actualizar una reacción
router.post("/", auth, reaccionController.reaccionar);

// Eliminar una reacción
router.delete("/:publicacionId", auth, reaccionController.eliminarReaccion);

// Obtener resumen de reacciones por publicación
router.get("/:publicacionId", auth, reaccionController.obtenerReacciones);

module.exports = router;
