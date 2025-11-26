import { RepartoModel } from "../models/reparto.model.js";

export const RepartoController = {

  listarPorPelicula: async (req, res) => {
    try {
      const { id } = req.params;
      const reparto = await RepartoModel.obtenerPorPelicula(id);
      res.json({ ok: true, reparto });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { id } = req.params;

      const data = {
        id_pelicula: id,
        nombre_actor: req.body.nombre_actor,
        personaje: req.body.personaje || null
      };

      await RepartoModel.crear(data);

      res.json({
        ok: true,
        message: "Actor agregado al reparto correctamente"
      });

    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;

      const data = {
        nombre_actor: req.body.nombre_actor,
        personaje: req.body.personaje
      };

      await RepartoModel.actualizar(id, data);

      res.json({
        ok: true,
        message: "Datos del actor actualizados correctamente"
      });

    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      await RepartoModel.eliminar(id);

      res.json({
        ok: true,
        message: "Actor eliminado del reparto"
      });

    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  }
};
