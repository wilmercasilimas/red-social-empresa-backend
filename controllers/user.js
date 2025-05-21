const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Area = require("../models/Area"); // ✅ Referencia necesaria

// REGISTRO DE EMPLEADO POR ADMIN
const registrar = async (req, res) => {
  try {
    const { nombre, apellidos, email, password, cargo, area, rol } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios: nombre, email o contraseña.",
      });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "El formato del correo no es válido.",
      });
    }

    // Verificar si ya existe el usuario
    const existe = await User.findOne({ email: email.toLowerCase() });
    if (existe) {
      return res.status(409).json({
        status: "error",
        message: "El correo ya está registrado.",
      });
    }

    // Si se proporciona área, verificar que exista en BD
    let areaId = null;
    if (area) {
      const areaExiste = await Area.findById(area);
      if (!areaExiste) {
        return res.status(404).json({
          status: "error",
          message: "El área especificada no existe.",
        });
      }
      areaId = area;
    }

    // Encriptar contraseña
    const hashedPass = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      apellidos,
      email: email.toLowerCase(),
      password: hashedPass,
      cargo: cargo || "empleado",
      area: areaId || null,
      rol: rol || "empleado",
    });

    const usuarioGuardado = await nuevoUsuario.save();

    return res.status(201).json({
      status: "success",
      message: "Empleado registrado correctamente.",
      usuario: usuarioGuardado,
    });
  } catch (error) {
    console.error("❌ Error al registrar:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al registrar empleado.",
      error: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación de campos
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos: email o contraseña.",
      });
    }

    // Normalizar el email (eliminar espacios y convertir a minúsculas)
    const emailNormalizado = email.trim().toLowerCase();

    // Buscar al usuario
    const user = await User.findOne({ email: emailNormalizado });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
      });
    }

    // Comparar contraseñas
    const passOK = await bcrypt.compare(password, user.password);
    if (!passOK) {
      return res.status(401).json({
        status: "error",
        message: "Contraseña incorrecta.",
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        cargo: user.cargo,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "Login correcto",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        cargo: user.cargo,
        area: user.area,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error interno en login:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al iniciar sesión.",
      error: error.message,
    });
  }
};

// LISTAR USUARIOS (admin)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find()
      .select("-password")
      .populate("area") // Mostrar datos del área
      .sort({ creado_en: -1 });

    return res.status(200).json({
      status: "success",
      usuarios,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener usuarios.",
      error: error.message,
    });
  }
};

// EDITAR USUARIO (admin)
const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, email, cargo, area, rol } = req.body;

    // Validar área si se proporciona
    if (area) {
      const areaExiste = await Area.findById(area);
      if (!areaExiste) {
        return res.status(404).json({
          status: "error",
          message: "Área especificada no existe.",
        });
      }
    }

    const actualizado = await User.findByIdAndUpdate(
      id,
      { nombre, apellidos, email, cargo, area, rol },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente.",
      usuario: actualizado,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar usuario.",
      error: error.message,
    });
  }
};

// ELIMINAR USUARIO (admin)
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(403).json({
        status: "error",
        message: "No puedes eliminar tu propio usuario.",
      });
    }

    const usuarioAEliminar = await User.findById(id);
    if (!usuarioAEliminar) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
      });
    }

    if (usuarioAEliminar.rol === "admin") {
      const totalAdmins = await User.countDocuments({ rol: "admin" });
      if (totalAdmins <= 1) {
        return res.status(403).json({
          status: "error",
          message: "No se puede eliminar al último administrador del sistema.",
        });
      }
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Usuario eliminado correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar usuario.",
      error: error.message,
    });
  }
};

module.exports = {
  registrar,
  login,
  listarUsuarios,
  editarUsuario,
  eliminarUsuario,
};
