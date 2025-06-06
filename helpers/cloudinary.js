// helpers/cloudinary.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Subir imagen de publicaciones
const subirImagenPublicacion = async (archivoLocal) => {
  const resultado = await cloudinary.uploader.upload(archivoLocal, {
    folder: "publicaciones_empresa",
  });
  return resultado.secure_url;
};

// Subir imagen de avatar
const subirAvatarCloudinary = async (archivoLocal) => {
  const resultado = await cloudinary.uploader.upload(archivoLocal, {
    folder: "avatars_empresa",
  });
  return resultado.secure_url;
};

module.exports = {
  cloudinary,
  subirImagenPublicacion,
  subirAvatarCloudinary, // ← ESTE es el que necesitas restaurar
};
