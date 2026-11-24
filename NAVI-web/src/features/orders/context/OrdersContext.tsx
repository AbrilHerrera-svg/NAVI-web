import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useInventory } from '../../inventory';
import { actualizarPedido, crearPedido, obtenerPedidos } from '../services/ordersService';
import type { OrderExceptionItem, OrderItemRecord, OrderPaymentMethod } from '../types';
import { buildStockLines } from '../utils/buildStockLines';
import { OrdersReactContext, type AdvanceStatusResult, type NewOrderInput } from './useOrders';

// Flujo de estados: a qué estado pasa un pedido al presionar su acción principal
const nextStatus: Partial<Record<OrderItemRecord['status'], OrderItemRecord['status']>> = {
  Nuevo: 'En preparación',
  'En preparación': 'Listo',
  Listo: 'Recogido',
};

// El backend los devuelve sin orden: los más nuevos (folio más alto) van primero.
const folio = (order: OrderItemRecord) => parseInt(order.orderNumber.replace(/\D/g, ''), 10) || 0;
const newestFirst = (list: OrderItemRecord[]) => [...list].sort((a, b) => folio(b) - folio(a));

const messageOf = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const { ingredients, registerSale, registerCancellation, recipesByProductId } = useInventory();
  const [orders, setOrders] = useState<OrderItemRecord[]>([]);
  // Las excepciones aún no existen en el backend, así que empiezan vacías.
  const [exceptions, setExceptions] = useState<OrderExceptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  // Pedidos a los que SÍ se les descontó inventario en esta sesión (al cobrar o al
  // crearse ya pagados), para saber si cancelarlos debe restituir existencias.
  const [chargedOrderIds, setChargedOrderIds] = useState<Set<string>>(new Set());
  // Pedidos con una acción en curso: evita doble clic (ej. cobrar dos veces).
  const busy = useRef(new Set<string>());

  useEffect(() => {
    let cancelled = false; // evita actualizar el estado si el componente ya se cerró

    obtenerPedidos()
      .then((datos) => {
        if (cancelled) return;
        setOrders(newestFirst(datos));
        setError('');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(messageOf(err, 'No se pudieron cargar los pedidos'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  const patchOrder = (id: string, changes: Partial<OrderItemRecord>) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...changes } : o)));

  const markCharged = (id: string) => setChargedOrderIds((prev) => new Set(prev).add(id));

  const addOrder = async (input: NewOrderInput): Promise<AdvanceStatusResult> => {
    const time = new Date().toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
    const productsSummary = input.cart
      .map((item) => `${item.product.name}${item.product.size ? ` ${item.product.size}` : ''}`)
      .join(', ')
      .slice(0, 500); // el backend acepta máximo 500 caracteres

    let created: OrderItemRecord;
    try {
      created = await crearPedido({
        origin: input.origin,
        receivedTime: time,
        dueTime: 'Por definir',
        customerName: input.customerName,
        productsSummary,
        total: input.total,
        paymentMethod: input.alreadyCharged ? input.paymentMethod : undefined,
        cart: input.cart,
      });
    } catch (err) {
      return { ok: false, reason: messageOf(err, 'No se pudo guardar el pedido') };
    }

    // El backend siempre crea el pedido como "Nuevo"; si ya se cobró, se pasa a preparación.
    if (!input.alreadyCharged) {
      setOrders((prev) => [created, ...prev]);
      return { ok: true };
    }

    try {
      await actualizarPedido(created.id, { status: 'En preparación' });
      setOrders((prev) => [{ ...created, status: 'En preparación' }, ...prev]);
      markCharged(created.id);
      return { ok: true };
    } catch {
      // El pedido sí quedó guardado (como "Nuevo"); no se reintenta para no duplicarlo.
      setOrders((prev) => [created, ...prev]);
      return {
        ok: true,
        reason: `El pedido ${created.orderNumber} se guardó, pero no se pudo pasar a preparación. Cóbralo desde Pedidos.`,
      };
    }
  };

  const advanceStatus = async (id: string, paymentMethod?: OrderPaymentMethod): Promise<AdvanceStatusResult> => {
    const order = orders.find((o) => o.id === id);
    if (!order) return { ok: false, reason: 'El pedido ya no existe.' };
    const next = nextStatus[order.status];
    if (!next) return { ok: false, reason: 'Este pedido no tiene un siguiente estado.' };
    if (busy.current.has(id)) return { ok: false, reason: 'Espera un momento, el pedido se está actualizando.' };

    busy.current.add(id);
    let soldLines: ReturnType<typeof buildStockLines> | null = null;

    try {
      // "Cobrar" es la transición Nuevo → En preparación: no se puede cobrar sin método de
      // pago, y ahí se descuenta inventario real.
      if (order.status === 'Nuevo') {
        if (!paymentMethod) {
          return { ok: false, reason: 'Elige un método de pago para cobrar el pedido.' };
        }
        if (order.cart) {
          const lines = buildStockLines(order.cart, ingredients, recipesByProductId);
          const result = registerSale(`Pedido ${order.orderNumber}`, lines);
          if (!result.ok) {
            return {
              ok: false,
              reason: `No se puede cobrar ${order.orderNumber}: no alcanza el inventario de ${result.missing
                .map((m) => m.ingredientName)
                .join(', ')}.`,
            };
          }
          soldLines = lines;
        }
      }

      // "Marcar listo" es En preparación → Listo: todos los renglones deben estar preparados.
      if (order.status === 'En preparación' && order.cart && order.cart.some((item) => !item.prepared)) {
        return { ok: false, reason: 'Marca todos los productos del pedido como preparados antes de pasarlo a Listo.' };
      }

      await actualizarPedido(id, { status: next, ...(paymentMethod ? { paymentMethod } : {}) });
      patchOrder(id, { status: next, paymentMethod: paymentMethod ?? order.paymentMethod });
      if (order.status === 'Nuevo') markCharged(id);
      return { ok: true };
    } catch (err) {
      // No se guardó el cobro: se regresa el inventario que ya se había descontado.
      if (soldLines) registerCancellation(`Reversa por error al cobrar ${order.orderNumber}`, soldLines);
      return { ok: false, reason: messageOf(err, 'No se pudo actualizar el pedido') };
    } finally {
      busy.current.delete(id);
    }
  };

  const toggleItemPrepared = async (orderId: string, itemIndex: number): Promise<AdvanceStatusResult> => {
    const order = orders.find((o) => o.id === orderId);
    if (!order?.cart) return { ok: false };
    if (busy.current.has(orderId)) return { ok: false }; // ya hay un cambio en curso

    const cart = order.cart.map((item, i) => (i === itemIndex ? { ...item, prepared: !item.prepared } : item));

    busy.current.add(orderId);
    try {
      await actualizarPedido(orderId, { cart });
      patchOrder(orderId, { cart });
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: messageOf(err, 'No se pudo marcar el producto') };
    } finally {
      busy.current.delete(orderId);
    }
  };

  const cancelOrder = async (id: string): Promise<AdvanceStatusResult> => {
    const order = orders.find((o) => o.id === id);
    if (!order) return { ok: false, reason: 'El pedido ya no existe.' };
    if (busy.current.has(id)) return { ok: false, reason: 'Espera un momento, el pedido se está actualizando.' };

    busy.current.add(id);
    try {
      await actualizarPedido(id, { status: 'Cancelado' });

      // Solo restituye inventario si esta sesión lo había descontado al cobrar.
      if (chargedOrderIds.has(id) && order.cart) {
        registerCancellation(
          `Cancelación ${order.orderNumber}`,
          buildStockLines(order.cart, ingredients, recipesByProductId)
        );
        setChargedOrderIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }

      patchOrder(id, { status: 'Cancelado' });
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: messageOf(err, 'No se pudo cancelar el pedido') };
    } finally {
      busy.current.delete(id);
    }
  };

  const resolveException = (id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <OrdersReactContext.Provider
      value={{
        orders,
        exceptions,
        loading,
        error,
        reload,
        addOrder,
        advanceStatus,
        toggleItemPrepared,
        cancelOrder,
        resolveException,
      }}
    >
      {children}
    </OrdersReactContext.Provider>
  );
};
