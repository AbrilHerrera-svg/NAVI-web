import type { OrderItemRecord } from '../types';

interface Props {
  orders: OrderItemRecord[];
  onOpenCancelModal: (orderId: string) => void;
}

const columns: { status: OrderItemRecord['status']; label: string; count: number; badgeColor: string }[] = [
  { status: 'Nuevo', label: 'Nuevo', count: 2, badgeColor: 'bg-indigo-100 text-indigo-700' },
  { status: 'En preparación', label: 'En preparación', count: 2, badgeColor: 'bg-amber-100 text-amber-800' },
  { status: 'Listo', label: 'Listo', count: 1, badgeColor: 'bg-emerald-100 text-emerald-800' },
  { status: 'Recogido', label: 'Recogido', count: 2, badgeColor: 'bg-slate-200 text-slate-700' },
  { status: 'Cancelado', label: 'Cancelado', count: 1, badgeColor: 'bg-rose-100 text-rose-700' },
];

export const OrdersKanbanView = ({ orders, onOpenCancelModal }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.status);

        return (
          <div key={col.status} className="flex flex-col gap-3 min-w-[220px]">
            {/* Header de la columna */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                {col.label}
              </span>
              <span className="text-xs font-semibold text-slate-400">{col.count}</span>
            </div>

            {/* Tarjetas */}
            <div className="space-y-3">
              {colOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-sm text-slate-900">{order.orderNumber}</span>
                    <span className="text-[10px] bg-slate-100 font-semibold text-slate-600 px-2 py-0.5 rounded-full">
                      {order.origin}
                    </span>
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
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          order.dueStatusColor === 'urgent'
                            ? 'bg-rose-100 text-rose-600'
                            : order.dueStatusColor === 'warning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {order.dueStatusLabel}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">${order.total}</span>
                    {order.primaryActionLabel && (
                      <button
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg text-white transition cursor-pointer shadow-2xs ${
                          order.primaryActionColor === 'success'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-[#5960A1] hover:bg-[#484e85]'
                        }`}
                      >
                        {order.primaryActionLabel}
                      </button>
                    )}
                  </div>

                  {/* Acciones secundarias */}
                  <div className="flex justify-between text-[11px] pt-1 text-slate-400 font-medium">
                    <button className="hover:text-slate-700 cursor-pointer">Editar</button>
                    <button
                      onClick={() => onOpenCancelModal(order.id)}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};