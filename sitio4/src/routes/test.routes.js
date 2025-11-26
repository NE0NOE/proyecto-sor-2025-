import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

router.get("/test-db", async (req, res) => {
  try {
    const [result] = await db.query("SELECT 1 + 1 AS result");
    res.json({
      ok: true,
      message: "Conexión a MySQL exitosa",
      result: result[0]
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error conectando a MySQL",
      error: error.message
    });
  }
});

export default router;
