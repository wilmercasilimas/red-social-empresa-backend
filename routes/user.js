// routes/user.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const { auth, esAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/multer"); // ✅ Importación correcta

// Rutas públicas
router.post("/login", UserController.login);

// Subida de avatar
router.post("/subir", auth, upload.single("file0"), UserController.subirAvatar);

// Rutas solo para administradores
router.post("/register", auth, esAdmin, UserController.registrar);
router.get("/usuarios", auth, esAdmin, UserController.listarUsuarios);
router.put("/usuario/:id", auth, esAdmin, UserController.editarUsuario);
router.delete("/usuario/:id", auth, esAdmin, UserController.eliminarUsuario);

// Ruta para obtener perfil del usuario autenticado
router.get("/perfil", auth, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Acceso autorizado.",
    user: req.user,
  });
});

module.exports = router;
