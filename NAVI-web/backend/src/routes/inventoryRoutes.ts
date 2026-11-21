import { Router } from "express";
import {
  getIngredientes,
  postIngrediente,
  putIngrediente,
  deleteIngrediente,
  getMovimientos,
  postAjuste,
  postCompra,
  postConsumo,
} from "../controllers/inventoryController";
import { getReceta, getRecetas, putReceta } from "../controllers/recipeController";
import { validateBody, validateIdParam } from "../middleware/validate";
import {
  crearIngredienteSchema,
  actualizarIngredienteSchema,
  registrarAjusteSchema,
  registrarCompraSchema,
  registrarConsumoSchema,
} from "../schemas/inventorySchemas";
import { guardarRecetaSchema } from "../schemas/recipeSchemas";

const router = Router();

router.get("/ingredients", getIngredientes);
router.post("/ingredients", validateBody(crearIngredienteSchema), postIngrediente);
router.put("/ingredients/:id", validateIdParam("id"), validateBody(actualizarIngredienteSchema), putIngrediente);
router.delete("/ingredients/:id", validateIdParam("id"), deleteIngrediente);

router.get("/movements", getMovimientos);
router.post("/adjustments", validateBody(registrarAjusteSchema), postAjuste);
router.post("/purchases", validateBody(registrarCompraSchema), postCompra);
router.post("/consumption", validateBody(registrarConsumoSchema), postConsumo);

router.get("/recipes", getRecetas);
router.get("/recipes/:productId", validateIdParam("productId"), getReceta);
router.put("/recipes/:productId", validateIdParam("productId"), validateBody(guardarRecetaSchema), putReceta);

export default router;