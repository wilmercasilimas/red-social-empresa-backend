const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Función para definir carpeta de destino dinámica
const definirCarpetaDestino = (tipo) => {
  const basePath = path.join(__dirname, "..", "uploads");
  const carpetasPermitidas = ["avatars", "publicaciones"];
  const carpeta = carpetasPermitidas.includes(tipo) ? path.join(basePath, tipo) : path.join(basePath, "otros");

  // Crear carpeta si no existe
  if (!fs.existsSync(carpeta)) {
    fs.mkdirSync(carpeta, { recursive: true });
  }

  return carpeta;
};

// Middleware dinámico según tipo de carpeta
const configurarMulter = (tipo = "otros") => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const carpetaDestino = definirCarpetaDestino(tipo);
      cb(null, carpetaDestino);
    },
    filename: function (req, file, cb) {
      const nombreArchivo = Date.now() + "-" + file.originalname;
      cb(null, nombreArchivo);
    },
  });

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".gif"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (png, jpg, jpeg, gif)"));
    }
  };

  return multer({ storage, fileFilter });
};

module.exports = configurarMulter;
