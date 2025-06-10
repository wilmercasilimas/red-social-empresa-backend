const Publicacion = require("../models/Publicacion");
const fs = require("fs");
const path = require("path");
const { cloudinary, subirImagenPublicacion } = require("../helpers/cloudinary");

// ... [crearPublicacion, editarPublicacion, misPublicaciones y eliminarPublicacion sin cambios]

const listarTodasPublicaciones = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const skip = (pagina - 1) * limite;

    const { autor, tarea, area } = req.query;
    const matchStage = {};

    if (tarea) matchStage.tarea = tarea;
    if (autor) matchStage.autor = autor;

    const pipelineBase = [
      { $match: matchStage },

      {
        $lookup: {
          from: "users",
          localField: "autor",
          foreignField: "_id",
          as: "autor",
        },
      },
      { $unwind: "$autor" },

      ...(area ? [{ $match: { "autor.area": area } }] : []),

      {
        $lookup: {
          from: "tareas",
          localField: "tarea",
          foreignField: "_id",
          as: "tarea",
        },
      },
      { $unwind: "$tarea" },
    ];

    // Conteo total (sin paginación)
    const pipelineConteo = [...pipelineBase, { $count: "total" }];

    // Pipeline con paginación
    const pipelinePaginado = [
      ...pipelineBase,
      { $sort: { creado_en: -1 } },
      { $skip: skip },
      { $limit: limite },
    ];

    const [publicaciones, conteo] = await Promise.all([
      Publicacion.aggregate(pipelinePaginado),
      Publicacion.aggregate(pipelineConteo),
    ]);

    const total = conteo[0]?.total || 0;
    const totalPaginas = Math.ceil(total / limite);

    return res.status(200).json({
      status: "success",
      paginaActual: pagina,
      totalPaginas,
      totalPublicaciones: total,
      publicaciones,
    });
  } catch (error) {
    console.error("Error en listarTodasPublicaciones:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al listar publicaciones.",
    });
  }
};

module.exports = {
  crearPublicacion,
  editarPublicacion,
  misPublicaciones,
  listarTodasPublicaciones,
  eliminarPublicacion,
};
