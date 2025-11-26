import { Router } from "express";
import { ComentariosController } from "../controllers/comentarios.controller.js";
import { ensureUserToken } from "../middlewares/userToken.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = Router();

// PÚBLICO
router.get("/:id/comentarios", ComentariosController.listarPorPelicula);

// USUARIOS ANÓNIMOS (con cookie)
router.post("/:id/comentarios", ensureUserToken, ComentariosController.crear);
router.put("/comentarios/:id", ensureUserToken, ComentariosController.actualizar);

// ADMIN — moderación
router.delete("/comentarios/:id", authAdmin, ComentariosController.eliminar);

export default router;
