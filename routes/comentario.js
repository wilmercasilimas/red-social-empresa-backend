const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const ComentarioController = require("../controllers/comentario");

// Crear un comentario en una publicación
router.post("/crear", auth, ComentarioController.crearComentario);

// Obtener todos los comentarios de una publicación
router.get("/publicacion/:id", auth, ComentarioController.listarComentariosPorPublicacion);

// Eliminar un comentario (autor o admin)
router.delete("/eliminar/:id", auth, ComentarioController.eliminarComentario);

module.exports = router;
