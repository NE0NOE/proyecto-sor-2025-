import { db } from "../config/db.js";

export const UsuariosModel = {

  buscarPorEmail: async (email) => {
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  }
};
