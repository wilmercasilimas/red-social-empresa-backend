// routes/reacciones.js
const express = require("express");
const router = express.Router();
const agregarReaccion = require("../controllers/reacciones"); // ✅ importar función directa
const auth = require("../middlewares/auth");

router.post("/agregar", auth, agregarReaccion);

module.exports = router;
