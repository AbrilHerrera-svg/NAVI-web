import { peticionAuth } from "../../auth";
import type { CreateOrderPayload, OrderItemRecord, UpdateOrderPayload } from "../types";

// GET /api/orders
export const obtenerPedidos = () => peticionAuth<OrderItemRecord[]>("/orders");

// POST /api/orders  (el backend asigna orderNumber y status "Nuevo")
export const crearPedido = (datos: CreateOrderPayload) =>
  peticionAuth<OrderItemRecord>("/orders", {
    method: "POST",
    body: JSON.stringify(datos),
  });

// PUT /api/orders/:id  (cambia estado, método de pago, cliente o carrito)
export const actualizarPedido = (id: string, cambios: UpdateOrderPayload) =>
  peticionAuth<{ ok: boolean }>(`/orders/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(cambios),
  });
