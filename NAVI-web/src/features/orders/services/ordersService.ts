import { peticionAuth } from "../../auth";
import type { OrderItemRecord } from "../types";

// GET /api/orders
export const obtenerPedidos = () => peticionAuth<OrderItemRecord[]>("/orders");
