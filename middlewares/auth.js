const jwt = require("jsonwebtoken");

// Verifica token JWT
const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Acceso denegado. Falta token."
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.error("❌ Token inválido:", error);
    return res.status(401).json({
      status: "error",
      message: "Token inválido o expirado.",
      error: error.message
    });
  }
};

// Verifica si el usuario tiene rol admin
const esAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Acceso denegado. Solo administradores pueden realizar esta acción."
    });
  }
  next();
};

module.exports = {
  auth,
  esAdmin
};
