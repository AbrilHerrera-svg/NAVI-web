import { useState } from 'react';
import {
  OrdersNavHeader,
  OrdersKanbanView,
  OrdersTableView,
  OrdersExceptionsView,
  OrderCancelModal,
  mockOrdersData,
  mockOrderExceptions,
  buildStockLines,
  type OrderItemRecord,
} from '../features/orders';
import { useInventory } from '../features/inventory';

interface Props {
  onNavigateToNewOrder?: () => void;
}

// Flujo de estados: a qué estado pasa un pedido al presionar su acción principal
const nextStatus: Partial<Record<OrderItemRecord['status'], OrderItemRecord['status']>> = {
  Nuevo: 'En preparación',
  'En preparación': 'Listo',
  Listo: 'Recogido',
};

export default function OrdersPage({ onNavigateToNewOrder }: Props) {
  const { ingredients, registerSale, registerCancellation } = useInventory();
  const [orders, setOrders] = useState<OrderItemRecord[]>(mockOrdersData);
  const [exceptions, setExceptions] = useState(mockOrderExceptions);
  const [viewMode, setViewMode] = useState<'tarjetas' | 'lista' | 'excepciones'>('tarjetas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  // Pedidos a los que SÍ se les descontó inventario en esta sesión (al cobrar), para
  // saber si cancelarlos debe restituir existencias. Los pedidos precargados que ya
  // estaban "En preparación" o más avanzados en el mock nunca pasaron por este descuento,
  // así que cancelarlos no toca inventario (evita inflar existencias que nunca se restaron).
  const [chargedOrderIds, setChargedOrderIds] = useState<Set<string>>(new Set());

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productsSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    const matchesOrigin = !originFilter || o.origin === originFilter;
    return matchesSearch && matchesStatus && matchesOrigin;
  });

  const handleOpenCancel = (id: string) => {
    setSelectedOrderId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    const order = orders.find((o) => o.id === selectedOrderId);
    if (order) {
      // Solo restituye inventario si esta sesión lo había descontado al cobrar.
      if (chargedOrderIds.has(order.id) && order.cart) {
        registerCancellation(`Cancelación ${order.orderNumber}`, buildStockLines(order.cart, ingredients));
        setChargedOrderIds((prev) => {
          const next = new Set(prev);
          next.delete(order.id);
          return next;
        });
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: 'Cancelado' } : o))
      );
    }
    setCancelModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleAdvanceStatus = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    const next = nextStatus[order.status];
    if (!next) return;

    // "Cobrar" es la transición Nuevo → En preparación: ahí se descuenta inventario real.
    if (order.status === 'Nuevo' && order.cart) {
      const result = registerSale(`Pedido ${order.orderNumber}`, buildStockLines(order.cart, ingredients));
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

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <OrdersNavHeader
        viewMode={viewMode}
        onChangeView={setViewMode}
        onGoToNewOrder={() => onNavigateToNewOrder?.()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        exceptionsCount={exceptions.length}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        originFilter={originFilter}
        onOriginFilterChange={setOriginFilter}
      />

      {viewMode === 'tarjetas' && (
        <OrdersKanbanView
          orders={filteredOrders}
          onOpenCancelModal={handleOpenCancel}
          onAdvanceStatus={handleAdvanceStatus}
        />
      )}

      {viewMode === 'lista' && (
        <OrdersTableView
          orders={filteredOrders}
          onAdvanceStatus={handleAdvanceStatus}
          onOpenCancelModal={handleOpenCancel}
        />
      )}

      {viewMode === 'excepciones' && (
        <OrdersExceptionsView
          exceptions={exceptions}
          onResolve={(id) => setExceptions((prev) => prev.filter((e) => e.id !== id))}
        />
      )}

      <OrderCancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}