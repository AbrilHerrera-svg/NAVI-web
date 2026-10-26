import { createContext, useContext } from 'react';
import type { CartItem, OrderExceptionItem, OrderItemRecord } from '../types';

export interface NewOrderInput {
  origin: OrderItemRecord['origin'];
  customerName?: string;
  cart: CartItem[];
  total: number;
  // Si el pedido ya se cobró al crearlo (ej. mostrador), entra directo a "En preparación"
  // y su inventario ya se considera descontado (ver registerSale en quien llama a addOrder).
  alreadyCharged?: boolean;
}

export interface OrdersContextValue {
  orders: OrderItemRecord[];
  exceptions: OrderExceptionItem[];
  // Agrega un pedido nuevo a la cola compartida (ej. desde Nuevo pedido).
  addOrder: (input: NewOrderInput) => void;
  // Avanza el pedido a su siguiente estado; si la transición es "Cobrar" (Nuevo → En
  // preparación), descuenta inventario real primero y no avanza si no alcanza.
  advanceStatus: (id: string) => void;
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
