import type { LateOrderItem, QueueStatusItem } from "../types";

interface Props {
  queue: QueueStatusItem[];
  lateOrders: LateOrderItem[];
}

export const LiveOperations = ({ queue, lateOrders }: Props) => {
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-gray-800 mb-3">Operación en vivo</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cola de pedidos */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-sm mb-3">Cola de pedidos</h3>
          <ul className="text-xs space-y-2 text-gray-600">
            {queue.map((q, idx) => (
              <li key={idx} className={`flex justify-between ${q.isAlert && q.count > 0 ? "text-red-500" : ""}`}>
                <span>{q.label}</span> <span className="font-bold">{q.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pedidos atrasados */}
        <div className="bg-white border rounded-xl p-4 shadow-sm col-span-2">
          <h3 className="font-semibold text-sm mb-3">Pedidos atrasados</h3>
          {lateOrders.length === 0 ? (
            <p className="text-xs text-slate-400">No hay pedidos atrasados.</p>
          ) : (
            <ul className="text-xs space-y-3">
              {lateOrders.map((o, idx) => (
                <li
                  key={o.id}
                  className={`flex justify-between ${idx !== lateOrders.length - 1 ? "border-b pb-2" : ""}`}
                >
                  <span className="font-medium text-gray-700">{o.label}</span>
                  <span className={`font-semibold ${o.urgent ? "text-red-500" : "text-amber-600"}`}>
                    {o.statusLabel}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
