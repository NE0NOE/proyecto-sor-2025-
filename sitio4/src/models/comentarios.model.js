import { db } from "../config/db.js";

export const ComentariosModel = {

  obtenerPorPelicula: async (id_pelicula) => {
    const [rows] = await db.execute(
      "SELECT * FROM comentarios WHERE id_pelicula = ? ORDER BY fecha ASC",
      [id_pelicula]
    );
    return rows;
  },

  crear: async (data) => {
    const { id_pelicula, user_token, nombre_generado, comentario, id_padre } = data;
    await db.execute(
      `INSERT INTO comentarios
      (id_pelicula, user_token, nombre_generado, comentario, id_padre)
      VALUES (?, ?, ?, ?, ?)`,
      [id_pelicula, user_token, nombre_generado, comentario, id_padre]
    );
  },

  actualizar: async (id_comentario, contenido) => {
    await db.execute(
      "UPDATE comentarios SET comentario = ?, editado = 1 WHERE id_comentario = ?",
      [contenido, id_comentario]
    );
  },

  eliminar: async (id_comentario) => {
    await db.execute(
      "DELETE FROM comentarios WHERE id_comentario = ?",
      [id_comentario]
    );
  }
};
