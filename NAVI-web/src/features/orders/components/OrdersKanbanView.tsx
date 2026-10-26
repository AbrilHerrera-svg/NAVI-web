import { type OrderItemRecord, getPrimaryAction } from '../types';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import type { BadgeColor } from '../../../components/ui/Badge';

interface Props {
  orders: OrderItemRecord[];
  onOpenCancelModal: (orderId: string) => void;
  onAdvanceStatus: (orderId: string) => void;
}

const columns: { status: OrderItemRecord['status']; label: string; badgeColor: BadgeColor }[] = [
  { status: 'Nuevo', label: 'Nuevo', badgeColor: 'info' },
  { status: 'En preparación', label: 'En preparación', badgeColor: 'warning' },
  { status: 'Listo', label: 'Listo', badgeColor: 'success' },
  { status: 'Recogido', label: 'Recogido', badgeColor: 'neutral' },
  { status: 'Cancelado', label: 'Cancelado', badgeColor: 'danger' },
];

export const OrdersKanbanView = ({ orders, onOpenCancelModal, onAdvanceStatus }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.status);

        return (
          <div key={col.status} className="flex flex-col gap-3 min-w-[220px]">
            {/* Header de la columna */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <Badge color={col.badgeColor} className="text-[11px]">
                {col.label}
              </Badge>
              <span className="text-xs font-semibold text-slate-400">{colOrders.length}</span>
            </div>

            {/* Tarjetas */}
            <div className="space-y-3">
              {colOrders.map((order) => {
                const action = getPrimaryAction(order.status);
                return (
                <Card key={order.id} className="shadow-2xs space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-sm text-slate-900">{order.orderNumber}</span>
                    <Badge className="text-[10px]">{order.origin}</Badge>
                  </div>

                  <div>
                    {order.customerName && (
                      <p className="text-[11px] text-slate-400 mb-0.5">
                        {order.customerName} · {order.receivedTime}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {order.productsSummary}
                    </p>
                  </div>

                  {order.dueStatusLabel && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {order.dueTime}
                      </p>
                      <Badge
                        color={
                          order.dueStatusColor === 'urgent'
                            ? 'danger'
                            : order.dueStatusColor === 'warning'
                            ? 'warning'
                            : 'success'
                        }
                        className="rounded-md"
                      >
                        {order.dueStatusLabel}
                      </Badge>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">${order.total}</span>
                    {action && (
                      <Button
                        variant={action.color === 'success' ? 'success' : 'primary'}
                        onClick={() => onAdvanceStatus(order.id)}
                        className="px-3 py-1.5 shadow-2xs"
                      >
                        {action.label}
                      </Button>
                    )}
                  </div>

                  {/* Acciones secundarias */}
                  <div className="flex justify-between text-[11px] pt-1 text-slate-400 font-medium">
                    <button
                      onClick={() => alert('Edición de pedidos próximamente')}
                      className="hover:text-slate-700 cursor-pointer"
                    >
                      Editar
                    </button>
                    {order.status !== 'Cancelado' && order.status !== 'Recogido' && (
                      <button
                        onClick={() => onOpenCancelModal(order.id)}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};