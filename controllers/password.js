// controllers/password.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Cambiar contraseña del usuario autenticado
const cambiarPassword = async (req, res) => {
  try {
    const { password_actual, password_nueva } = req.body;

    // Validar campos
    if (!password_actual || !password_nueva) {
      return res.status(400).json({
        status: "error",
        message: "Debes proporcionar la contraseña actual y la nueva.",
      });
    }

    // Obtener el usuario autenticado
    const usuario = await User.findById(req.user.id);

    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
      });
    }

    // Verificar contraseña actual
    const passwordOK = await bcrypt.compare(password_actual, usuario.password);
    if (!passwordOK) {
      return res.status(401).json({
        status: "error",
        message: "La contraseña actual no es correcta.",
      });
    }

    // Encriptar nueva contraseña
    const nuevaEncriptada = await bcrypt.hash(password_nueva, 10);

    // Guardar nueva contraseña
    usuario.password = nuevaEncriptada;
    await usuario.save();

    return res.status(200).json({
      status: "success",
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al cambiar contraseña:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al cambiar contraseña.",
      error: error.message,
    });
  }
};

module.exports = {
  cambiarPassword,
};
