import { useState } from 'react';
import {
  OrdersNavHeader,
  OrdersKanbanView,
  OrdersTableView,
  OrdersExceptionsView,
  OrderCancelModal,
  mockOrdersData,
} from '../features/orders';

interface Props {
  onNavigateToNewOrder?: () => void;
}

export default function OrdersPage({ onNavigateToNewOrder }: Props) {
  const [viewMode, setViewMode] = useState<'tarjetas' | 'lista' | 'excepciones'>('tarjetas');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = mockOrdersData.filter(
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
      />

      {viewMode === 'tarjetas' && (
        <OrdersKanbanView
          orders={filteredOrders}
          onOpenCancelModal={handleOpenCancel}
        />
      )}

      {viewMode === 'lista' && (
        <OrdersTableView orders={filteredOrders} />
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