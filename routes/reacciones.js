const express = require("express");
const router = express.Router();
const agregarReaccion = require("../controllers/reacciones");
const auth = require("../middlewares/auth");

router.post("/agregar", auth, agregarReaccion);

module.exports = router;
