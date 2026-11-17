import { Router } from "express";
import {
  getNegocio,
  putNegocio,
  getNotificaciones,
  putNotificaciones,
} from "../controllers/settingsController";
import { validateBody } from "../middleware/validate";
import { actualizarNegocioSchema, actualizarNotificacionesSchema } from "../schemas/settingsSchemas";

const router = Router();

router.get("/business", getNegocio);
router.put("/business", validateBody(actualizarNegocioSchema), putNegocio);
router.get("/notifications", getNotificaciones);
router.put("/notifications", validateBody(actualizarNotificacionesSchema), putNotificaciones);

export default router;
