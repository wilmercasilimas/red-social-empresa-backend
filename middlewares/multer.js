// middlewares/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Carpeta donde se guardarán los avatares
const carpeta = path.join(__dirname, "..", "uploads", "avatars");

// Crear carpeta si no existe
if (!fs.existsSync(carpeta)) {
  fs.mkdirSync(carpeta, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, carpeta);
  },
  filename: function (req, file, cb) {
    const nombreArchivo = Date.now() + "-" + file.originalname;
    cb(null, nombreArchivo);
  },
});

// Filtro para validar que solo se suban imágenes
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".gif") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (png, jpg, jpeg, gif)"));
  }
};

// ✅ Exportar instancia de multer ya configurada
const upload = multer({ storage, fileFilter });
module.exports = upload;
