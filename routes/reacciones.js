const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

// ⚠️ Importar como función directa
const agregarReaccion = require("../controllers/reacciones");

router.post("/agregar", auth, agregarReaccion);

module.exports = router;
