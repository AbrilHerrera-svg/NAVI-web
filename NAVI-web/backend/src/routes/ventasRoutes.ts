import { Router } from "express";
import { obtenerVentas } from "../controllers/ventasController";
import { verificarToken } from "../middleware/verificarToken";

const router = Router();

// GET /api/ventas?periodo=hoy|ayer|semana|mes  (requiere sesión iniciada)
router.get("/", verificarToken, obtenerVentas);

export default router;
