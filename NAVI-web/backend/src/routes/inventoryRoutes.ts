import { Router } from "express";
import {
  getIngredientes,
  postIngrediente,
  putIngrediente,
  deleteIngrediente,
  getMovimientos,
  postAjuste,
  postCompra,
} from "../controllers/inventoryController";
import { getReceta, putReceta } from "../controllers/recipeController";
import { ROLES_STAFF, requireRole } from "../middleware/auth";
import { validateBody, validateIdParam } from "../middleware/validate";
import {
  crearIngredienteSchema,
  actualizarIngredienteSchema,
  registrarAjusteSchema,
  registrarCompraSchema,
} from "../schemas/inventorySchemas";
import { guardarRecetaSchema } from "../schemas/recipeSchemas";

const router = Router();

// Todo el inventario es de staff; un cliente no tiene por qué tocar esto.
router.use(requireRole(...ROLES_STAFF));

router.get("/ingredients", getIngredientes);
router.post("/ingredients", validateBody(crearIngredienteSchema), postIngrediente);
router.put("/ingredients/:id", validateIdParam("id"), validateBody(actualizarIngredienteSchema), putIngrediente);
router.delete("/ingredients/:id", validateIdParam("id"), deleteIngrediente);

router.get("/movements", getMovimientos);
router.post("/adjustments", validateBody(registrarAjusteSchema), postAjuste);
router.post("/purchases", validateBody(registrarCompraSchema), postCompra);

router.get("/recipes/:productId", validateIdParam("productId"), getReceta);
router.put("/recipes/:productId", validateIdParam("productId"), validateBody(guardarRecetaSchema), putReceta);

export default router;
