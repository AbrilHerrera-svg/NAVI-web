import { Router } from "express";
import {
  getNegocio,
  putNegocio,
  getNotificaciones,
  putNotificaciones,
} from "../controllers/settingsController";
import { ROLES_STAFF, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { actualizarNegocioSchema, actualizarNotificacionesSchema } from "../schemas/settingsSchemas";

const router = Router();

// GET /business lo usa también la app móvil (nombre/dirección de la
// sucursal), así que se queda abierto a cualquier autenticado. Solo editar
// la configuración es de staff.
router.get("/business", getNegocio);
router.put("/business", requireRole(...ROLES_STAFF), validateBody(actualizarNegocioSchema), putNegocio);
router.get("/notifications", requireRole(...ROLES_STAFF), getNotificaciones);
router.put("/notifications", requireRole(...ROLES_STAFF), validateBody(actualizarNotificacionesSchema), putNotificaciones);

export default router;
