// routes/incidencia.js
const express = require("express");
const router = express.Router();
const IncidenciaController = require("../controllers/incidencia");
const { auth } = require("../middlewares/auth");

// Middleware para permitir solo a admin o gerencia
const esAdminOGerencia = (req, res, next) => {
  const rol = req.user.rol;
  if (rol === "admin" || rol === "gerencia") {
    return next();
  } else {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado: solo administradores o gerencia.",
    });
  }
};

// Crear una incidencia (solo admin o gerencia)
router.post("/crear", auth, esAdminOGerencia, IncidenciaController.crearIncidencia);

// Listar incidencias por usuario (cualquier usuario autenticado)
router.get("/usuario/:id", auth, IncidenciaController.listarPorUsuario);

// Eliminar una incidencia (solo admin o gerencia)
router.delete("/eliminar/:id", auth, esAdminOGerencia, IncidenciaController.eliminarIncidencia);

// Ver historial de incidencias por usuario
router.get("/usuario/:id", auth, IncidenciaController.obtenerIncidenciasPorUsuario);

// Listar todas las incidencias (solo admin o gerencia)
router.get("/activas", auth, esAdminOGerencia, IncidenciaController.listarIncidenciasActivas);




module.exports = router;
