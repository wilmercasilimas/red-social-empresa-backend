const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const registrarImpresion = require("../controllers/impresiones");

router.post("/registrar", auth, registrarImpresion);

module.exports = router;
