import Badge from "../../../components/ui/Badge";
import type { OrderItemRecord } from "../types";

interface Props {
  orders: OrderItemRecord[];
}

export const OrdersTableView = ({ orders }: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Origen</th>
              <th className="py-3 px-4">Recibido</th>
              <th className="py-3 px-4">Vence</th>
              <th className="py-3 px-4">Productos</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {orders.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {item.orderNumber}
                </td>
                <td className="py-3.5 px-4">
                  <Badge>{item.origin}</Badge>
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  {item.receivedTime}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      item.dueStatusColor === "urgent"
                        ? "bg-rose-100 text-rose-600"
                        : item.dueStatusColor === "warning"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {item.dueTime}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-800">
                  {item.productsSummary}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  ${item.total}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.status === "En preparación"
                        ? "bg-amber-100 text-amber-800"
                        : item.status === "Nuevo"
                          ? "bg-indigo-50 text-indigo-700"
                          : item.status === "Listo"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  {item.primaryActionLabel ? (
                    <button className="px-3 py-1 bg-[#5960A1] text-white rounded-lg text-xs font-semibold hover:bg-[#484e85] transition shadow-2xs">
                      {item.primaryActionLabel}
                    </button>
                  ) : (
                    <button className="px-3 py-1 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-100 transition">
                      Ver
                    </button>
                  )}
                  <button className="text-slate-400 hover:text-slate-600 text-xs font-medium">
                    Más ▾
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
