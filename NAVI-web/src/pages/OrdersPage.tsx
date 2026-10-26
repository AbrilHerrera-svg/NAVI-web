import { useState } from 'react';
import {
  OrdersNavHeader,
  OrdersKanbanView,
  OrdersTableView,
  OrdersExceptionsView,
  OrderCancelModal,
  useOrders,
} from '../features/orders';

interface Props {
  onNavigateToNewOrder?: () => void;
}

export default function OrdersPage({ onNavigateToNewOrder }: Props) {
  const { orders, exceptions, advanceStatus, cancelOrder, resolveException } = useOrders();
  const [viewMode, setViewMode] = useState<'tarjetas' | 'lista' | 'excepciones'>('tarjetas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [originFilter, setOriginFilter] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

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
          onAdvanceStatus={advanceStatus}
        />
      )}

      {viewMode === 'lista' && (
        <OrdersTableView
          orders={filteredOrders}
          onAdvanceStatus={advanceStatus}
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
    </div>
  );
}
