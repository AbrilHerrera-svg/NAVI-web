import { Router } from "express";
import { getSesion, getUltimoCierre, postAbrir, postCerrar } from "../controllers/cashRegisterController";
import { ROLES_STAFF, requireRole } from "../middleware/auth";
import { validateBody, validateIdParam } from "../middleware/validate";
import { abrirSesionSchema, cerrarSesionSchema } from "../schemas/cashRegisterSchemas";

const router = Router();

// La caja es de staff, no de clientes.
router.use(requireRole(...ROLES_STAFF));

router.get("/", getSesion);
router.get("/last-close", getUltimoCierre);
router.post("/open", validateBody(abrirSesionSchema), postAbrir);
router.post("/:id/close", validateIdParam("id"), validateBody(cerrarSesionSchema), postCerrar);

export default router;