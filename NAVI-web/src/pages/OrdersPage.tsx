import { useState } from 'react';
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
  const { orders, exceptions, advanceStatus, toggleItemPrepared, cancelOrder, resolveException } = useOrders();
  const [viewMode, setViewMode] = useState<'tarjetas' | 'lista' | 'excepciones'>('tarjetas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [chargeOrderId, setChargeOrderId] = useState<string | null>(null);

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
    if (selectedOrderId) cancelOrder(selectedOrderId);
    setCancelModalOpen(false);
    setSelectedOrderId(null);
  };

  // "Cobrar" (Nuevo → En preparación) exige elegir método de pago primero; las demás
  // transiciones se intentan directo y, si el contexto las rechaza, se explica por qué.
  const handleAdvanceStatus = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    if (order.status === 'Nuevo') {
      setChargeOrderId(orderId);
      return;
    }
    const result = advanceStatus(orderId);
    if (!result.ok && result.reason) alert(result.reason);
  };

  const handleConfirmCharge = (method: OrderPaymentMethod) => {
    if (!chargeOrderId) return;
    const result = advanceStatus(chargeOrderId, method);
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

      {viewMode === 'tarjetas' && (
        <OrdersKanbanView
          orders={filteredOrders}
          onOpenCancelModal={handleOpenCancel}
          onAdvanceStatus={handleAdvanceStatus}
          onToggleItemPrepared={toggleItemPrepared}
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
