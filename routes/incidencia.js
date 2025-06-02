// routes/incidencia.js
const express = require("express");
const router = express.Router();
const IncidenciaController = require("../controllers/incidencia");
const { auth, esAdminOGerencia } = require("../middlewares/auth");

// Crear una incidencia (admin o gerencia)
router.post("/crear", auth, esAdminOGerencia, IncidenciaController.crearIncidencia);

// Eliminar una incidencia (admin o gerencia)
router.delete("/eliminar/:id", auth, esAdminOGerencia, IncidenciaController.eliminarIncidencia);

// Listar incidencias activas (admin o gerencia)
router.get("/activas", auth, esAdminOGerencia, IncidenciaController.listarIncidenciasActivas);

// Ver historial de incidencias por usuario (admin o gerencia)
router.get("/usuario/:id", auth, esAdminOGerencia, IncidenciaController.obtenerIncidenciasPorUsuario);

module.exports = router;
