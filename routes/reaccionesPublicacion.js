// routes/reaccionesPublicacion.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const reaccionesController = require("../controllers/reaccionesPublicacion");

// ✅ Crear o actualizar reacción
router.post("/", auth, reaccionesController.reaccionar);

// ✅ Eliminar reacción del usuario autenticado
router.delete("/:publicacionId", auth, reaccionesController.eliminarReaccion);

// ✅ Obtener resumen de reacciones por publicación
router.get("/:publicacionId", auth, reaccionesController.obtenerReacciones);

module.exports = router;
