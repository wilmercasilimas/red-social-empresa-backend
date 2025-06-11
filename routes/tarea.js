const express = require("express");
const router = express.Router();
const TareaController = require("../controllers/tarea");
const { auth, esAdminOGerencia } = require("../middlewares/auth");


// Crear tarea (solo admin o gerencia)
// ✅ correcto
router.post("/crear", auth, esAdminOGerencia, TareaController.crearTarea);

router.get("/todas", auth, esAdminOGerencia, TareaController.listarTodasTareas);

// Listar tareas del usuario autenticado
router.get("/listar", auth, TareaController.listarTareas);

// Editar tarea (requiere auth)
router.put("/editar/:id", auth, TareaController.editarTarea);

// Eliminar tarea (requiere auth)
router.delete("/eliminar/:id", auth, TareaController.eliminarTarea);

module.exports = router;
