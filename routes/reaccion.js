const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const reaccionController = require("../controllers/reaccion");

router.post("/", auth, reaccionController.reaccionar);
router.delete("/:publicacionId", auth, reaccionController.eliminarReaccion);
router.get("/:publicacionId", auth, reaccionController.obtenerReacciones);

module.exports = router;
