import { createContext, useContext } from 'react';
import type { CartItem, OrderExceptionItem, OrderItemRecord, OrderPaymentMethod } from '../types';

export interface NewOrderInput {
  origin: OrderItemRecord['origin'];
  customerName?: string;
  cart: CartItem[];
  total: number;
  // Si el pedido ya se cobró al crearlo (ej. mostrador), entra directo a "En preparación"
  // y su inventario ya se considera descontado (ver registerSale en quien llama a addOrder).
  alreadyCharged?: boolean;
  // Obligatorio cuando alreadyCharged es true: no se puede cobrar sin método.
  paymentMethod?: OrderPaymentMethod;
}

export interface AdvanceStatusResult {
  ok: boolean;
  reason?: string;
}

export interface OrdersContextValue {
  orders: OrderItemRecord[];
  exceptions: OrderExceptionItem[];
  // Agrega un pedido nuevo a la cola compartida (ej. desde Nuevo pedido).
  addOrder: (input: NewOrderInput) => void;
  // Avanza el pedido a su siguiente estado.
  // - Nuevo → En preparación ("Cobrar"): requiere paymentMethod, descuenta inventario
  //   real y no avanza si no alcanza.
  // - En preparación → Listo: requiere que todos los renglones del carrito estén
  //   marcados como preparados.
  // Regresa { ok: false, reason } cuando no se puede avanzar, sin tronar en silencio.
  advanceStatus: (id: string, paymentMethod?: OrderPaymentMethod) => AdvanceStatusResult;
  // Marca/desmarca un renglón del carrito como preparado.
  toggleItemPrepared: (orderId: string, itemIndex: number) => void;
  // Cancela el pedido; restituye inventario solo si esta sesión ya lo había cobrado.
  cancelOrder: (id: string) => void;
  resolveException: (id: string) => void;
}

export const OrdersReactContext = createContext<OrdersContextValue | null>(null);

export const useOrders = () => {
  const ctx = useContext(OrdersReactContext);
  if (!ctx) throw new Error('useOrders debe usarse dentro de <OrdersProvider>');
  return ctx;
};
