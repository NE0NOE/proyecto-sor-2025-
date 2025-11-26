import { Router } from "express";
import { PeliculasController } from "../controllers/peliculas.controller.js";
import { uploadPoster } from "../middlewares/multerPoster.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = Router();

// PÚBLICO
router.get("/peliculas", PeliculasController.obtenerTodas);
router.get("/peliculas/:id", PeliculasController.obtenerPorId);

// ADMIN
router.post(
  "/peliculas",
  authAdmin,
  uploadPoster.single("poster"),
  PeliculasController.crear
);

router.put(
  "/peliculas/:id",
  authAdmin,
  uploadPoster.single("poster"),
  PeliculasController.actualizar
);

router.delete(
  "/peliculas/:id",
  authAdmin,
  PeliculasController.eliminar
);

export default router;

