import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UsuariosModel } from "../models/usuarios.model.js";

export const AuthController = {

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ ok: false, message: "Email y contraseña son obligatorios" });
      }

      const usuario = await UsuariosModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ ok: false, message: "Credenciales inválidas" });
      }

      const passwordValida = await bcrypt.compare(password, usuario.password_hash);
      if (!passwordValida) {
        return res.status(401).json({ ok: false, message: "Credenciales inválidas" });
      }

      const payload = {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.rol
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );

      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: false,      // ponelo en true cuando uses HTTPS
        sameSite: "lax"
      });

      res.json({
        ok: true,
        message: "Login exitoso",
        admin: {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      });

    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("admin_token");
      res.json({ ok: true, message: "Sesión cerrada correctamente" });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  perfil: async (req, res) => {
    // Solo se llama si pasa por authAdmin
    res.json({
      ok: true,
      admin: req.admin
    });
  }
};
