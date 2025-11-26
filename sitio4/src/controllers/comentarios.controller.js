import { ComentariosModel } from "../models/comentarios.model.js";
import { nombreAnonimo } from "../utils/nombreAnonimo.js";

export const ComentariosController = {

  listarPorPelicula: async (req, res) => {
    try {
      const { id } = req.params;
      const comentarios = await ComentariosModel.obtenerPorPelicula(id);
      res.json({ ok: true, comentarios });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { id } = req.params;

      const data = {
        id_pelicula: id,
        user_token: req.user_token,
        nombre_generado: nombreAnonimo(),
        comentario: req.body.comentario,
        id_padre: req.body.id_padre || null
      };

      await ComentariosModel.crear(data);

      res.json({ ok: true, message: "Comentario agregado correctamente" });

    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { comentario } = req.body;

      await ComentariosModel.actualizar(id, comentario);

      res.json({ ok: true, message: "Comentario editado correctamente" });

    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      await ComentariosModel.eliminar(id);

      res.json({ ok: true, message: "Comentario eliminado" });

    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  }
};
