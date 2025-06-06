const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ✅ Subir imagen de publicaciones desde archivo local
const subirImagenPublicacion = async (archivoLocal) => {
  try {
    const resultado = await cloudinary.uploader.upload(archivoLocal, {
      folder: "publicaciones_empresa",
    });
    return resultado.secure_url;
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    throw new Error("No se pudo subir la imagen");
  }
};

module.exports = { cloudinary, subirImagenPublicacion };
