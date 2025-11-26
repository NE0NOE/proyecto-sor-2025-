import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = Router();

// POST /api/admin/login
router.post("/admin/login", AuthController.login);

// POST /api/admin/logout
router.post("/admin/logout", AuthController.logout);

// GET /api/admin/me (ver quién está logueado)
router.get("/admin/me", authAdmin, AuthController.perfil);

export default router;
