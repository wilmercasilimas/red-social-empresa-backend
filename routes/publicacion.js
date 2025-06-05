const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { auth } = require("../middlewares/auth");
const PublicacionController = require("../controllers/publicacion");

// Configuración de subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/publicaciones");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Crear publicación (con imagen)
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
