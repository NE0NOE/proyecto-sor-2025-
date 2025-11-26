import { Router } from "express";
import { ImagenesController } from "../controllers/imagenes.controller.js";
import { uploadGaleria } from "../middlewares/multerGaleria.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = Router();

// PÚBLICO
router.get("/:id/imagenes", ImagenesController.listarPorPelicula);

// ADMIN
router.post(
  "/:id/imagenes",
  authAdmin,
  uploadGaleria.single("imagen"),
  ImagenesController.crear
);

router.delete(
  "/imagenes/:id",
  authAdmin,
  ImagenesController.eliminar
);

export default router;
