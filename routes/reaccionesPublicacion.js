// routes/reaccionesPublicacion.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  reaccionar,
  eliminarReaccion,
  obtenerReacciones,
} = require("../controllers/reaccionesPublicacion");

// ✅ Crear o actualizar reacción
router.post("/", auth, reaccionar);

// ✅ Eliminar reacción del usuario autenticado
router.delete("/:publicacionId", auth, eliminarReaccion);

// ✅ Obtener resumen de reacciones por publicación
router.get("/:publicacionId", auth, obtenerReacciones);

module.exports = router;
