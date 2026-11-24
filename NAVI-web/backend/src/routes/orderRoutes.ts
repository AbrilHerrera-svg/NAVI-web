import { Router } from "express";
import { getPedidos, getPedido, getMisPedidos, postPedido, putPedido } from "../controllers/orderController";
import { validateBody, validateIdParam } from "../middleware/validate";
import { crearPedidoSchema, actualizarPedidoSchema } from "../schemas/orderSchemas";

const router = Router();

router.get("/", getPedidos);
// Antes de "/:id" para que "mine" no se interprete como un id de pedido.
router.get("/mine", getMisPedidos);
router.get("/:id", validateIdParam("id"), getPedido);
router.post("/", validateBody(crearPedidoSchema), postPedido);
router.put("/:id", validateIdParam("id"), validateBody(actualizarPedidoSchema), putPedido);

export default router;
