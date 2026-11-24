import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, refresh, registerCliente, me, actualizarMiPerfil, actualizarFcmToken } from "../controllers/authController";
import { verificarToken } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { loginSchema, refreshSchema, registerSchema, actualizarPerfilSchema, fcmTokenSchema } from "../schemas/authSchemas";

const router = Router();

// fuerza bruta de contraseña: pocas por IP
const limiteLogin = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });
// el front puede pedir un token nuevo varias veces por sesión; más holgado
const limiteRefresh = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false });
// crear perfil tras registrarse en Firebase Auth: poco frecuente por cuenta
const limiteRegistro = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

// POST /api/auth/login
router.post("/login", limiteLogin, validateBody(loginSchema), login);

// POST /api/auth/refresh — cambia un refreshToken por un idToken nuevo (el idToken expira en 1h)
router.post("/refresh", limiteRefresh, validateBody(refreshSchema), refresh);

// POST /api/auth/register — crea el perfil (rol "cliente") de una cuenta que la
// app móvil ya registró en Firebase Auth; requiere el idToken de esa cuenta.
router.post("/register", limiteRegistro, verificarToken, validateBody(registerSchema), registerCliente);

// GET /api/auth/me — perfil del usuario autenticado (lo pide la app móvil tras login)
router.get("/me", verificarToken, me);

// PUT /api/auth/me — edita el propio nombre/teléfono (pantalla de Perfil)
router.put("/me", verificarToken, validateBody(actualizarPerfilSchema), actualizarMiPerfil);

// PUT /api/auth/fcm-token — registra/renueva el token de push del dispositivo
router.put("/fcm-token", verificarToken, validateBody(fcmTokenSchema), actualizarFcmToken);

export default router;
