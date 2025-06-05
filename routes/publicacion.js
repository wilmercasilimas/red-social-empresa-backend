// routes/publicacion.js
const express = require("express");
const router = express.Router();
const path = require("path");

const { auth } = require("../middlewares/auth");
const PublicacionController = require("../controllers/publicacion");

// ✅ Middleware de multer ya personalizado (memoryStorage + filtro de imagen)
const upload = require("../middlewares/multer");

// ✅ Crear publicación (imagen opcional)
router.post(
  "/crear",
  upload.any(), // ✅ permite que imagen esté presente o no
  auth,
  PublicacionController.crearPublicacion
);

// ✅ Editar publicación (con nueva imagen opcional)
router.put(
  "/editar/:id",
  upload.any(), // ✅ mismo enfoque para permitir imagen opcional
  auth,
  PublicacionController.editarPublicacion
);

// ✅ Listar publicaciones del usuario autenticado
router.get("/mis-publicaciones", auth, PublicacionController.misPublicaciones);

// ✅ Eliminar publicación
router.delete("/eliminar/:id", auth, PublicacionController.eliminarPublicacion);

// ✅ Listar todas las publicaciones (admin/gerencia)
router.get("/todas", auth, PublicacionController.listarTodasPublicaciones);

module.exports = router;
