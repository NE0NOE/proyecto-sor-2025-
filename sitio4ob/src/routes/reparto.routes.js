import { Router } from "express";
import { RepartoController } from "../controllers/reparto.controller.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = Router();

// PÚBLICO
router.get("/:id/reparto", RepartoController.listarPorPelicula);

// ADMIN
router.post("/:id/reparto", authAdmin, RepartoController.crear);
router.put("/reparto/:id", authAdmin, RepartoController.actualizar);
router.delete("/reparto/:id", authAdmin, RepartoController.eliminar);

export default router;
