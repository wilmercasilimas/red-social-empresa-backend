const express = require("express");
const router = express.Router();
const TareaController = require("../controllers/tarea");
const { auth, esAdminOGerencia } = require("../middlewares/auth");

// Crear tarea (solo admin o gerencia)
// ✅ correcto
router.post("/crear", auth, esAdminOGerencia, TareaController.crearTarea);

// Listar todas las tareas (admin o gerencia)
// Soporta filtros por ?asignada_a=ID y ?creada_por=ID
router.get("/todas", auth, esAdminOGerencia, TareaController.listarTodasTareas);

// Listar tareas del usuario autenticado
router.get("/listar", auth, TareaController.listarTareas);

// Editar tarea (solo admin o gerencia)
router.put("/editar/:id", auth, esAdminOGerencia, TareaController.editarTarea);

// Eliminar tarea (solo admin o gerencia)
router.delete(
  "/eliminar/:id",
  auth,
  esAdminOGerencia,
  TareaController.eliminarTarea
);

module.exports = router;
