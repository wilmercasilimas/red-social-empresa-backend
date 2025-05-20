const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const { auth, esAdmin } = require("../middlewares/auth");

// Rutas públicas
router.post("/login", UserController.login);

// Rutas solo para administradores
router.post("/register", auth, esAdmin, UserController.registrar);  // Registrar nuevo usuario
router.get("/usuarios", auth, esAdmin, UserController.listarUsuarios);  // Listar todos los usuarios
router.put("/usuario/:id", auth, esAdmin, UserController.editarUsuario); // Modificar usuario
router.delete("/usuario/:id", auth, esAdmin, UserController.eliminarUsuario); // Eliminar usuario

// Ruta para obtener perfil del usuario autenticado
router.get("/perfil", auth, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Acceso autorizado.",
    user: req.user,
  });
});

module.exports = router;
