// middlewares/auth.js
const jwt = require("jsonwebtoken");

/**
 * Middleware: Verifica si el token JWT es válido.
 */
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Acceso denegado. Token no proporcionado.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token inválido:", error);
    return res.status(401).json({
      status: "error",
      message: "Token inválido o expirado.",
      error: error.message,
    });
  }
};

/**
 * Middleware: Verifica si el usuario tiene rol 'admin'.
 */
const esAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({
      status: "error",
      message:
        "Acceso denegado. Solo administradores pueden realizar esta acción.",
    });
  }
  next();
};

/**
 * Middleware: Permite acceso a 'admin' o 'gerente'
 */
const esAdminOGerencia = (req, res, next) => {
  if (!req.user || !["admin", "gerente"].includes(req.user.rol)) {
    return res.status(403).json({
      status: "error",
      message:
        "Acceso denegado. Solo administradores o gerencia pueden realizar esta acción.",
    });
  }
  next();
};

module.exports = {
  auth,
  esAdmin,
  esAdminOGerencia,
};
