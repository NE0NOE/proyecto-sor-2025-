import { db } from "../config/db.js";

export const RepartoModel = {
  
  obtenerPorPelicula: async (id_pelicula) => {
    const [rows] = await db.execute(
      "SELECT * FROM reparto WHERE id_pelicula = ?",
      [id_pelicula]
    );
    return rows;
  },

  crear: async (data) => {
    const { id_pelicula, nombre_actor, personaje } = data;
    await db.execute(
      "INSERT INTO reparto (id_pelicula, nombre_actor, personaje) VALUES (?, ?, ?)",
      [id_pelicula, nombre_actor, personaje]
    );
  },

  actualizar: async (id_reparto, data) => {
    const { nombre_actor, personaje } = data;
    await db.execute(
      "UPDATE reparto SET nombre_actor = ?, personaje = ? WHERE id_reparto = ?",
      [nombre_actor, personaje, id_reparto]
    );
  },

  eliminar: async (id_reparto) => {
    await db.execute(
      "DELETE FROM reparto WHERE id_reparto = ?",
      [id_reparto]
    );
  }
};
