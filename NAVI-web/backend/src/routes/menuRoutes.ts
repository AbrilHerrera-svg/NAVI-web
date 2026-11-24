import { Router } from "express";
import { getMenu, postProducto, putProducto, deleteProducto } from "../controllers/menuController";
import { ROLES_STAFF, requireRole } from "../middleware/auth";
import { validateBody, validateIdParam } from "../middleware/validate";
import { crearProductoSchema, actualizarProductoSchema } from "../schemas/menuSchemas";

const router = Router();

// GET lo usa también la app móvil para mostrar el menú; solo editarlo es de staff.
router.get("/", getMenu);
router.post("/", requireRole(...ROLES_STAFF), validateBody(crearProductoSchema), postProducto);
router.put("/:id", requireRole(...ROLES_STAFF), validateIdParam("id"), validateBody(actualizarProductoSchema), putProducto);
router.delete("/:id", requireRole(...ROLES_STAFF), validateIdParam("id"), deleteProducto);

export default router;
