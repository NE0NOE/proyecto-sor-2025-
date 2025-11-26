import { PeliculasModel } from "../models/peliculas.model.js";

function normalizar(v) {
  // Todo lo que venga vacío o "null" lo tratamos como NULL de MySQL
  return v === "" || v === "null" || v === undefined ? null : v;
}

export const PeliculasController = {
  obtenerTodas: async (req, res) => {
    const [rows] = await PeliculasModel.obtenerTodas();
    res.json(rows);
  },

  obtenerPorId: async (req, res) => {
    const [rows] = await PeliculasModel.obtenerPorId(req.params.id);
    rows.length
      ? res.json(rows[0])
      : res.status(404).json({ message: "Película no encontrada" });
  },

  crear: async (req, res) => {
    try {
      const data = {
        titulo: normalizar(req.body.titulo),
        sinopsis: normalizar(req.body.sinopsis),
        fecha_estreno: normalizar(req.body.fecha_estreno),
        duracion: normalizar(req.body.duracion),
        genero: normalizar(req.body.genero),
        director: normalizar(req.body.director),
        pais: normalizar(req.body.pais),
        clasificacion: normalizar(req.body.clasificacion),
        trailer_url: normalizar(req.body.trailer_url),
        poster: req.file ? `/uploads/posters/${req.file.filename}` : null
      };

      await PeliculasModel.crear(data);
      res.json({ ok: true, message: "Película creada correctamente" });
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  },

  actualizar: async (req, res) => {
    try {
      const id = req.params.id;

      // Log para ver qué está llegando realmente
      console.log("REQ.BODY UPDATE PELICULA:", req.body);

      const data = {
        titulo: normalizar(req.body.titulo),
        sinopsis: normalizar(req.body.sinopsis),
        fecha_estreno: normalizar(req.body.fecha_estreno),
        duracion: normalizar(req.body.duracion),
        genero: normalizar(req.body.genero),
        director: normalizar(req.body.director),
        pais: normalizar(req.body.pais),
        clasificacion: normalizar(req.body.clasificacion),
        // poster va aparte
      };

      if (req.file) {
        data.poster = `/uploads/posters/${req.file.filename}`;
      }

      console.log("DATA LIMPIA UPDATE PELICULA:", data);

      await PeliculasModel.actualizar(id, data);

      res.json({ ok: true, message: "Película actualizada correctamente" });
    } catch (error) {
      console.error("ERROR UPDATE PELICULA:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      await PeliculasModel.eliminar(req.params.id);
      res.json({ ok: true, message: "Película eliminada" });
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  }
};
