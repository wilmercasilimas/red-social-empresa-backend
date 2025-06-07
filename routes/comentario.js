// ✅ routes/comentario.js
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

const {
  crearComentario,
  obtenerComentarios,
} = require("../controllers/comentario");

// Crear nuevo comentario
router.post("/crear", auth, crearComentario);

// Obtener comentarios por publicación
router.get("/publicacion/:publicacionId", auth, obtenerComentarios);

module.exports = router;