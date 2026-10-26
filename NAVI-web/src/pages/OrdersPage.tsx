import { useState } from 'react';
import {
  OrdersNavHeader,
  OrdersKanbanView,
  OrdersTableView,
  OrdersExceptionsView,
  OrderCancelModal,
  mockOrdersData,
  type OrderItemRecord,
} from '../features/orders';

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
  const [orders, setOrders] = useState<OrderItemRecord[]>(mockOrdersData);
  const [viewMode, setViewMode] = useState<'tarjetas' | 'lista' | 'excepciones'>('tarjetas');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productsSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCancel = (id: string) => {
    setSelectedOrderId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedOrderId) {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderId ? { ...o, status: 'Cancelado' } : o))
      );
    }
    setCancelModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleAdvanceStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = nextStatus[o.status];
        return next ? { ...o, status: next } : o;
      })
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <OrdersNavHeader
        viewMode={viewMode}
        onChangeView={setViewMode}
        onGoToNewOrder={() => onNavigateToNewOrder?.()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
        <OrdersExceptionsView />
      )}

      <OrderCancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}