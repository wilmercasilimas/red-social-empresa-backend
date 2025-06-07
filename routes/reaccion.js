const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  reaccionar,
  eliminarReaccion,
  obtenerReacciones,
} = require("../controllers/reaccion");

// Crear o actualizar una reacción
router.post("/", auth, reaccionar);

// Eliminar una reacción
router.delete("/:publicacionId", auth, eliminarReaccion);

// Obtener resumen de reacciones por publicación
router.get("/:publicacionId", auth, obtenerReacciones);

module.exports = router;
