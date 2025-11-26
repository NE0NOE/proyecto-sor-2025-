import { db } from "../config/db.js";
import fs from "fs";
import path from "path";

export const PeliculasModel = {
  obtenerTodas: () => {
    return db.query("SELECT * FROM peliculas ORDER BY id_pelicula DESC");
  },

  obtenerPorId: (id) => {
    return db.query("SELECT * FROM peliculas WHERE id_pelicula = ?", [id]);
  },

  crear: (data) => {
    return db.query("INSERT INTO peliculas SET ?", data);
  },

  actualizar: (id, data) => {
    const {
      titulo,
      sinopsis,
      fecha_estreno,
      duracion,
      genero,
      director,
      pais,
      clasificacion,
      poster
    } = data;

    const sql = `
      UPDATE peliculas 
      SET 
        titulo = ?, 
        sinopsis = ?, 
        fecha_estreno = ?, 
        duracion = ?, 
        genero = ?, 
        director = ?, 
        pais = ?, 
        clasificacion = ?, 
        poster = IFNULL(?, poster)
      WHERE id_pelicula = ?
    `;

    const valores = [
      titulo,
      sinopsis,
      fecha_estreno,
      duracion,
      genero,
      director,
      pais,
      clasificacion,
      poster,
      id
    ];

    return db.query(sql, valores);
  },

  eliminar: async (id) => {
    // 1. Obtener poster principal
    const [rows] = await db.query(
      "SELECT poster FROM peliculas WHERE id_pelicula = ?",
      [id]
    );

    if (rows.length > 0 && rows[0].poster) {
      const rutaPoster = path.resolve(`public${rows[0].poster}`);
      if (fs.existsSync(rutaPoster)) {
        fs.unlinkSync(rutaPoster);
      }
    }

    // 2. Eliminar imágenes de galería (archivos + registros)
    const [imgRows] = await db.query(
      "SELECT ruta FROM imagenes WHERE id_pelicula = ?",
      [id]
    );

    for (const img of imgRows) {
      const rutaImg = path.resolve(`public${img.ruta}`);
      if (fs.existsSync(rutaImg)) {
        fs.unlinkSync(rutaImg);
      }
    }

    await db.query("DELETE FROM imagenes WHERE id_pelicula = ?", [id]);

    // 3. Eliminar reparto
    await db.query("DELETE FROM reparto WHERE id_pelicula = ?", [id]);

    // 4. Eliminar comentarios (incluyendo respuestas)
    await db.query(
      "DELETE FROM comentarios WHERE id_pelicula = ?",
      [id]
    );

    // 5. Eliminar película
    return db.query("DELETE FROM peliculas WHERE id_pelicula = ?", [id]);
  }
};

