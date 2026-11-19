import { useEffect, useState } from 'react';
import {
  OrdersNavHeader,
  OrdersKanbanView,
  OrdersTableView,
  OrdersExceptionsView,
  OrderCancelModal,
  OrderChargeModal,
  useOrders,
  type OrderPaymentMethod,
} from '../features/orders';

interface Props {
  onNavigateToNewOrder?: () => void;
}

export default function OrdersPage({ onNavigateToNewOrder }: Props) {
  const { orders, exceptions, loading, error, reload, advanceStatus, toggleItemPrepared, cancelOrder, resolveException } =
    useOrders();
  const [viewMode, setViewMode] = useState<'tarjetas' | 'lista' | 'excepciones'>('tarjetas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chargeOrderId, setChargeOrderId] = useState<string | null>(null);

  // Cada vez que se entra a Pedidos se vuelven a pedir, para ver los que llegaron desde la app.
  useEffect(() => {
    reload();
  }, [reload]);

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

  const handleConfirmCancel = async () => {
    const id = selectedOrderId;
    setCancelModalOpen(false);
    setSelectedOrderId(null);
    if (!id) return;
    const result = await cancelOrder(id);
    if (!result.ok && result.reason) alert(result.reason);
  };

  // Marcar/desmarcar un producto como preparado; si el servidor falla, se avisa.
  const handleTogglePrepared = async (orderId: string, itemIndex: number) => {
    const result = await toggleItemPrepared(orderId, itemIndex);
    if (!result.ok && result.reason) alert(result.reason);
  };

  // "Cobrar" (Nuevo → En preparación) exige elegir método de pago primero; las demás
  // transiciones se intentan directo y, si el contexto las rechaza, se explica por qué.
  const handleAdvanceStatus = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    if (order.status === 'Nuevo') {
      setChargeOrderId(orderId);
      return;
    }
    const result = await advanceStatus(orderId);
    if (!result.ok && result.reason) alert(result.reason);
  };

  const handleConfirmCharge = async (method: OrderPaymentMethod) => {
    if (!chargeOrderId) return;
    const result = await advanceStatus(chargeOrderId, method);
    if (!result.ok && result.reason) {
      alert(result.reason);
      return;
    }
    setChargeOrderId(null);
  };

  const chargeOrder = orders.find((o) => o.id === chargeOrderId);

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

      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
          <span>{error}</span>
          <button onClick={reload} className="font-semibold underline cursor-pointer">
            Reintentar
          </button>
        </div>
      )}

      {loading && orders.length === 0 && <p className="text-sm text-slate-400">Cargando pedidos...</p>}

      {viewMode === 'tarjetas' && (
        <OrdersKanbanView
          orders={filteredOrders}
          onOpenCancelModal={handleOpenCancel}
          onAdvanceStatus={handleAdvanceStatus}
          onToggleItemPrepared={handleTogglePrepared}
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
        <OrdersExceptionsView exceptions={exceptions} onResolve={resolveException} />
      )}

      <OrderCancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />

      <OrderChargeModal
        isOpen={!!chargeOrder}
        orderNumber={chargeOrder?.orderNumber}
        total={chargeOrder?.total ?? 0}
        onClose={() => setChargeOrderId(null)}
        onConfirm={handleConfirmCharge}
      />
    </div>
  );
}
