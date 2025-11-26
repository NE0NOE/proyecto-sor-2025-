// server.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import testRoutes from "./src/routes/test.routes.js";
import peliculasRoutes from "./src/routes/peliculas.routes.js";
import imagenesRoutes from "./src/routes/imagenes.routes.js";
import repartoRoutes from "./src/routes/reparto.routes.js";
import comentariosRoutes from "./src/routes/comentarios.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

// ------- Middlewares -------
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ------- Archivos estáticos -------
app.use(express.static("public"));

// ------- Rutas de API -------
app.use("/api", testRoutes);
app.use("/api", peliculasRoutes);

// rutas dependientes de películas
app.use("/api/peliculas", imagenesRoutes);
app.use("/api/peliculas", repartoRoutes);
app.use("/api/peliculas", comentariosRoutes);

// autenticación admin
app.use("/api", authRoutes);

// ------- Ruta base -------
app.get("/", (req, res) => {
  res.send("Servidor Express funcionando correctamente");
});

// ------- Puerto -------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
