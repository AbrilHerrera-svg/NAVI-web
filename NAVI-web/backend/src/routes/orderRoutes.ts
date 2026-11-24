import { Router } from "express";
import {
  getPedidos,
  getPedido,
  getMisPedidos,
  postPedido,
  putPedido,
  postNotificarPedido,
} from "../controllers/orderController";
import { ROLES_STAFF, requireRole } from "../middleware/auth";
import { validateBody, validateIdParam } from "../middleware/validate";
import { crearPedidoSchema, actualizarPedidoSchema, notificarPedidoSchema } from "../schemas/orderSchemas";

const router = Router();

// Ver todos los pedidos o el de alguien más, y cambiar su estado/cobrarlo,
// es de staff. Crear un pedido (origin "App" o "Mostrador") y ver los
// propios ("mine") se quedan abiertos a cualquier autenticado.
router.get("/", requireRole(...ROLES_STAFF), getPedidos);
// Antes de "/:id" para que "mine" no se interprete como un id de pedido.
router.get("/mine", getMisPedidos);
router.get("/:id", requireRole(...ROLES_STAFF), validateIdParam("id"), getPedido);
router.post("/", validateBody(crearPedidoSchema), postPedido);
router.put("/:id", requireRole(...ROLES_STAFF), validateIdParam("id"), validateBody(actualizarPedidoSchema), putPedido);
// Mensaje manual del staff a este pedido (no una promoción a todos los clientes).
router.post(
  "/:id/notify",
  requireRole(...ROLES_STAFF),
  validateIdParam("id"),
  validateBody(notificarPedidoSchema),
  postNotificarPedido
);

export default router;
