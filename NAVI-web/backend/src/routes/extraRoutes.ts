import { Router } from "express";
import { getExtras, postExtra, putExtra, deleteExtra } from "../controllers/extraController";
import { ROLES_STAFF, requireRole } from "../middleware/auth";
import { validateBody, validateIdParam } from "../middleware/validate";
import { crearExtraSchema, actualizarExtraSchema } from "../schemas/extraSchemas";

const router = Router();

// GET lo usa también la app móvil/el flujo de pedidos para mostrar el catálogo de extras;
// solo crear/editar/borrar es de staff.
router.get("/", getExtras);
router.post("/", requireRole(...ROLES_STAFF), validateBody(crearExtraSchema), postExtra);
router.put("/:id", requireRole(...ROLES_STAFF), validateIdParam("id"), validateBody(actualizarExtraSchema), putExtra);
router.delete("/:id", requireRole(...ROLES_STAFF), validateIdParam("id"), deleteExtra);

export default router;
