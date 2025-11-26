import { db } from "../config/db.js";

export const ImagenesModel = {
  
  obtenerPorPelicula: async (id_pelicula) => {
    const [rows] = await db.execute(
      "SELECT * FROM imagenes_pelicula WHERE id_pelicula = ?",
      [id_pelicula]
    );
    return rows;
  },

  crear: async (data) => {
    const { id_pelicula, ruta, descripcion } = data;
    await db.execute(
      "INSERT INTO imagenes_pelicula (id_pelicula, ruta, descripcion) VALUES (?, ?, ?)",
      [id_pelicula, ruta, descripcion]
    );
  },

  eliminar: async (id_imagen) => {
    await db.execute(
      "DELETE FROM imagenes_pelicula WHERE id_imagen = ?",
      [id_imagen]
    );
  }
};
