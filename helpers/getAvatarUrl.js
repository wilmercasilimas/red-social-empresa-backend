const getAvatarUrl = (nombreArchivo) => {
  if (!nombreArchivo) return "";
  
  // Si ya es una URL completa, devolver tal cual
  if (/^https?:\/\//i.test(nombreArchivo)) return nombreArchivo;

  // Si es solo nombre de archivo (imagen local), devolver ruta completa del backend
  return `https://red-social-empresa-backend.onrender.com/api/avatar/${nombreArchivo}`;
};

module.exports = getAvatarUrl;
