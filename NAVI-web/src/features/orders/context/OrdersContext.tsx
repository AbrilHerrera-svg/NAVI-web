import { useState, type ReactNode } from 'react';
import { useInventory } from '../../inventory';
import { mockOrdersData, mockOrderExceptions } from '../data/ordersMock';
import type { OrderItemRecord } from '../types';
import { buildStockLines } from '../utils/buildStockLines';
import { OrdersReactContext, type NewOrderInput } from './useOrders';

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
        cart: input.cart,
      },
      ...prev,
    ]);

    if (input.alreadyCharged) {
      setChargedOrderIds((prev) => new Set(prev).add(id));
    }
  };

  const advanceStatus = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    const next = nextStatus[order.status];
    if (!next) return;

    // "Cobrar" es la transición Nuevo → En preparación: ahí se descuenta inventario real.
    if (order.status === 'Nuevo' && order.cart) {
      const result = registerSale(
        `Pedido ${order.orderNumber}`,
        buildStockLines(order.cart, ingredients, recipesByProductId)
      );
      if (!result.ok) {
        alert(
          `No se puede cobrar ${order.orderNumber}: no alcanza el inventario de ${result.missing
            .map((m) => m.ingredientName)
            .join(', ')}.`
        );
        return;
      }
      setChargedOrderIds((prev) => new Set(prev).add(order.id));
    }

    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
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
      value={{ orders, exceptions, addOrder, advanceStatus, cancelOrder, resolveException }}
    >
      {children}
    </OrdersReactContext.Provider>
  );
};
