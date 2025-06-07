const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

// ✅ Importa el archivo completo (sin destructurar)
const reaccionController = require("../controllers/reaccion");

// ✅ Usa funciones directamente desde el objeto
router.post("/", auth, reaccionController.reaccionar);
router.delete("/:publicacionId", auth, reaccionController.eliminarReaccion);
router.get("/:publicacionId", auth, reaccionController.obtenerReacciones);

module.exports = router;
