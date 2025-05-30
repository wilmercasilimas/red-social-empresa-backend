const getAvatarUrl = (nombreArchivo) => {
  if (!nombreArchivo) return "";

  if (/^https?:\/\//i.test(nombreArchivo)) return nombreArchivo;

  return `https://red-social-empresa-backend.onrender.com/api/avatar/${nombreArchivo}`;
};

module.exports = { getAvatarUrl }; // ✅ Exporta como objeto
