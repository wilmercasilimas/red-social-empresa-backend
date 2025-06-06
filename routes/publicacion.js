const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const PublicacionController = require("../controllers/publicacion");

// ✅ Middleware multer configurado para guardar imágenes en /uploads/publicaciones
const configurarMulter = require("../middlewares/multer");
const upload = configurarMulter("publicaciones");

// ✅ Crear publicación (imagen opcional)
router.post(
  "/crear",
  upload.any(), // acepta imágenes opcionales
  auth,
  PublicacionController.crearPublicacion
);

// ✅ Editar publicación (imagen opcional)
router.put(
  "/editar/:id",
  upload.any(),
  auth,
  PublicacionController.editarPublicacion
);

// ✅ Listar publicaciones del usuario autenticado
router.get("/mis-publicaciones", auth, PublicacionController.misPublicaciones);

// ✅ Eliminar publicación
router.delete("/eliminar/:id", auth, PublicacionController.eliminarPublicacion);

// ✅ Listar todas las publicaciones
router.get("/todas", auth, PublicacionController.listarTodasPublicaciones);

module.exports = router;
