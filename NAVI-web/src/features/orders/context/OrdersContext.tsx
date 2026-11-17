import { useState, type ReactNode } from 'react';
import { useInventory } from '../../inventory';
import { mockOrdersData, mockOrderExceptions } from '../data/ordersMock';
import type { OrderItemRecord, OrderPaymentMethod } from '../types';
import { buildStockLines } from '../utils/buildStockLines';
import { OrdersReactContext, type AdvanceStatusResult, type NewOrderInput } from './useOrders';

// Flujo de estados: a qué estado pasa un pedido al presionar su acción principal
const nextStatus: Partial<Record<OrderItemRecord['status'], OrderItemRecord['status']>> = {
  Nuevo: 'En preparación',
  'En preparación': 'Listo',
  Listo: 'Recogido',
};

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const { ingredients, registerSale, registerCancellation, recipesByProductId } = useInventory();
  const [orders, setOrders] = useState<OrderItemRecord[]>(mockOrdersData);
  const [exceptions, setExceptions] = useState(mockOrderExceptions);
  const [nextOrderNumber, setNextOrderNumber] = useState(99);
  // Pedidos a los que SÍ se les descontó inventario en esta sesión (al cobrar o al
  // crearse ya pagados), para saber si cancelarlos debe restituir existencias. Los
  // pedidos precargados del mock nunca pasaron por este descuento, así que cancelarlos
  // no toca inventario (evita inflar existencias que nunca se restaron).
  const [chargedOrderIds, setChargedOrderIds] = useState<Set<string>>(new Set());

  const addOrder = (input: NewOrderInput) => {
    const id = `ord-${Date.now()}`;
    const orderNumber = `#${nextOrderNumber}`;
    setNextOrderNumber((n) => n + 1);

    const time = new Date().toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
    const productsSummary = input.cart
      .map((item) => `${item.product.name}${item.product.size ? ` ${item.product.size}` : ''}`)
      .join(', ');

    setOrders((prev) => [
      {
        id,
        orderNumber,
        origin: input.origin,
        receivedTime: time,
        dueTime: 'Por definir',
        customerName: input.customerName,
        productsSummary,
        total: input.total,
        status: input.alreadyCharged ? 'En preparación' : 'Nuevo',
        paymentMethod: input.alreadyCharged ? input.paymentMethod : undefined,
        cart: input.cart,
      },
      ...prev,
    ]);

    if (input.alreadyCharged) {
      setChargedOrderIds((prev) => new Set(prev).add(id));
    }
  };

  const advanceStatus = (id: string, paymentMethod?: OrderPaymentMethod): AdvanceStatusResult => {
    const order = orders.find((o) => o.id === id);
    if (!order) return { ok: false, reason: 'El pedido ya no existe.' };
    const next = nextStatus[order.status];
    if (!next) return { ok: false, reason: 'Este pedido no tiene un siguiente estado.' };

    // "Cobrar" es la transición Nuevo → En preparación: no se puede cobrar sin método de
    // pago, y ahí se descuenta inventario real.
    if (order.status === 'Nuevo') {
      if (!paymentMethod) {
        return { ok: false, reason: 'Elige un método de pago para cobrar el pedido.' };
      }
      if (order.cart) {
        const result = registerSale(
          `Pedido ${order.orderNumber}`,
          buildStockLines(order.cart, ingredients, recipesByProductId)
        );
        if (!result.ok) {
          return {
            ok: false,
            reason: `No se puede cobrar ${order.orderNumber}: no alcanza el inventario de ${result.missing
              .map((m) => m.ingredientName)
              .join(', ')}.`,
          };
        }
      }
      setChargedOrderIds((prev) => new Set(prev).add(order.id));
    }

    // "Marcar listo" es En preparación → Listo: todos los renglones deben estar preparados.
    if (order.status === 'En preparación' && order.cart && order.cart.some((item) => !item.prepared)) {
      return { ok: false, reason: 'Marca todos los productos del pedido como preparados antes de pasarlo a Listo.' };
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: next, paymentMethod: paymentMethod ?? o.paymentMethod } : o))
    );
    return { ok: true };
  };

  const toggleItemPrepared = (orderId: string, itemIndex: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.cart
          ? {
              ...o,
              cart: o.cart.map((item, i) => (i === itemIndex ? { ...item, prepared: !item.prepared } : item)),
            }
          : o
      )
    );
  };

  const cancelOrder = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;

    // Solo restituye inventario si esta sesión lo había descontado al cobrar.
    if (chargedOrderIds.has(order.id) && order.cart) {
      registerCancellation(
        `Cancelación ${order.orderNumber}`,
        buildStockLines(order.cart, ingredients, recipesByProductId)
      );
      setChargedOrderIds((prev) => {
        const next = new Set(prev);
        next.delete(order.id);
        return next;
      });
    }

    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'Cancelado' } : o)));
  };

  const resolveException = (id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <OrdersReactContext.Provider
      value={{ orders, exceptions, addOrder, advanceStatus, toggleItemPrepared, cancelOrder, resolveException }}
    >
      {children}
    </OrdersReactContext.Provider>
  );
};
