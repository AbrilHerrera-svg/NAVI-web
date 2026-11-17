import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, refresh } from "../controllers/authController";
import { validateBody } from "../middleware/validate";
import { loginSchema, refreshSchema } from "../schemas/authSchemas";

const router = Router();

// fuerza bruta de contraseña: pocas por IP
const limiteLogin = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
// el front puede pedir un token nuevo varias veces por sesión; más holgado
const limiteRefresh = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false });

// POST /api/auth/login
router.post("/login", limiteLogin, validateBody(loginSchema), login);

// POST /api/auth/refresh — cambia un refreshToken por un idToken nuevo (el idToken expira en 1h)
router.post("/refresh", limiteRefresh, validateBody(refreshSchema), refresh);

export default router;
