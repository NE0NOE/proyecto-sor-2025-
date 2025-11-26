import { ImagenesModel } from "../models/imagenes.model.js";

export const ImagenesController = {

  listarPorPelicula: async (req, res) => {
    try {
      const { id } = req.params;
      const imagenes = await ImagenesModel.obtenerPorPelicula(id);
      res.json({ ok: true, imagenes });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { id } = req.params;

      const data = {
        id_pelicula: id,
        descripcion: req.body.descripcion || null,
        ruta: req.file ? `/uploads/galeria/${req.file.filename}` : null
      };

      await ImagenesModel.crear(data);

      res.json({
        ok: true,
        message: "Imagen agregada a la galería correctamente"
      });

    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      await ImagenesModel.eliminar(id);

      res.json({
        ok: true,
        message: "Imagen eliminada correctamente"
      });

    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  }
};
