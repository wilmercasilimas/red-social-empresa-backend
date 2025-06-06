const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const { auth, esAdmin } = require("../middlewares/auth");
const PasswordController = require("../controllers/password");

// ✅ Multer configurado para carpeta de avatares
const configurarMulter = require("../middlewares/multer");
const upload = configurarMulter("avatars");

// Rutas públicas
router.post("/login", UserController.login);

// ✅ Subida de avatar a Cloudinary con multer
router.post(
  "/subir",
  auth,
  upload.single("avatar"), // <-- clave esperada desde frontend
  UserController.subirAvatarCloudinary
);

// Rutas solo para administradores
router.post("/register", auth, esAdmin, UserController.registrar);
router.get("/usuarios", auth, UserController.listarUsuarios);
router.put("/usuario/:id", auth, esAdmin, UserController.editarUsuario);
router.delete("/usuario/:id", auth, esAdmin, UserController.eliminarUsuario);

// Cambio de contraseña por el usuario autenticado
router.post("/cambiar-password", auth, PasswordController.cambiarPassword);

// Ruta para obtener perfil del usuario autenticado
router.get("/perfil", auth, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Acceso autorizado.",
    user: req.user,
  });
});

module.exports = router;
