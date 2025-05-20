const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTRO DE EMPLEADO POR ADMIN
const registrar = async (req, res) => {
  try {
    const { nombre, apellidos, email, password, cargo, area, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios: nombre, email o contraseña."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "El formato del correo no es válido."
      });
    }

    const existe = await User.findOne({ email: email.toLowerCase() });
    if (existe) {
      return res.status(409).json({
        status: "error",
        message: "El correo ya está registrado."
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
      nombre,
      apellidos,
      email: email.toLowerCase(),
      password: hashedPass,
      cargo: cargo || "empleado",
      area: area || "Sin asignar",
      rol: rol || "empleado"
    });

    const usuarioGuardado = await nuevoUsuario.save();

    return res.status(201).json({
      status: "success",
      message: "Empleado registrado correctamente.",
      usuario: usuarioGuardado
    });

  } catch (error) {
    console.error("❌ Error al registrar:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al registrar empleado.",
      error: error.message
    });
  }
};

// LOGIN CON VALIDACIONES
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Faltan datos: email o contraseña."
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ status: "error", message: "Usuario no encontrado." });
    }

    const passOK = await bcrypt.compare(password, user.password);
    if (!passOK) {
      return res.status(401).json({ status: "error", message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        cargo: user.cargo,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

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
        rol: user.rol
      }
    });

  } catch (error) {
    console.error("❌ Error interno en login:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al iniciar sesión.",
      error: error.message
    });
  }
};

// LISTAR USUARIOS (admin)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password").sort({ creado_en: -1 });
    return res.status(200).json({
      status: "success",
      usuarios
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener usuarios.",
      error: error.message
    });
  }
};

// EDITAR USUARIO (admin)
const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, email, cargo, area, rol } = req.body;

    const actualizado = await User.findByIdAndUpdate(
      id,
      { nombre, apellidos, email, cargo, area, rol },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado."
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente.",
      usuario: actualizado
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar usuario.",
      error: error.message
    });
  }
};

// ELIMINAR USUARIO (admin)
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Verificar si el usuario que quiere eliminar es él mismo
    if (req.user.id === id) {
      return res.status(403).json({
        status: "error",
        message: "No puedes eliminar tu propio usuario."
      });
    }

    // 2. Buscar al usuario a eliminar
    const usuarioAEliminar = await User.findById(id);
    if (!usuarioAEliminar) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado."
      });
    }

    // 3. Si el usuario es admin, verificar que no sea el último admin
    if (usuarioAEliminar.rol === "admin") {
      const totalAdmins = await User.countDocuments({ rol: "admin" });
      if (totalAdmins <= 1) {
        return res.status(403).json({
          status: "error",
          message: "No se puede eliminar al último administrador del sistema."
        });
      }
    }

    // 4. Eliminar usuario
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Usuario eliminado correctamente."
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar usuario.",
      error: error.message
    });
  }
};

module.exports = {
  registrar,
  login,
  listarUsuarios,
  editarUsuario,
  eliminarUsuario
};
