import { Router } from "express";
import { getMenu, postProducto, putProducto, deleteProducto } from "../controllers/menuController";
import { validateBody, validateIdParam } from "../middleware/validate";
import { crearProductoSchema, actualizarProductoSchema } from "../schemas/menuSchemas";

const router = Router();

router.get("/", getMenu);
router.post("/", validateBody(crearProductoSchema), postProducto);
router.put("/:id", validateIdParam("id"), validateBody(actualizarProductoSchema), putProducto);
router.delete("/:id", validateIdParam("id"), deleteProducto);

export default router;
