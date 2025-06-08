const express = require("express");
const router = express.Router();
const agregarReaccion = require("../controllers/reaccionesPublicacion");
const auth = require("../middlewares/auth");

router.post("/agregar", auth, agregarReaccion);

module.exports = router;
