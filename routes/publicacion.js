const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer"); // ✅ Usa el middleware oficial
const { auth } = require("../middlewares/auth");
const PublicacionController = require("../controllers/publicacion");

// Crear publicación (con imagen opcional)
router.post(
  "/crear",
  upload.single("imagen"),
  auth,
  PublicacionController.crearPublicacion
);

// Editar publicación (con imagen opcional)
router.put(
  "/editar/:id",
  upload.single("imagen"),
  auth,
  PublicacionController.editarPublicacion
);

// Listar publicaciones del usuario autenticado
router.get("/mis-publicaciones", auth, PublicacionController.misPublicaciones);

// Eliminar una publicación
router.delete("/eliminar/:id", auth, PublicacionController.eliminarPublicacion);

// Listar todas las publicaciones
router.get("/todas", auth, PublicacionController.listarTodasPublicaciones);

module.exports = router;
