import { mockQueueStatus } from "../data/dashboardMock";
import { mockOrdersData } from "../../orders";

export const LiveOperations = () => {
  const lateOrders = mockOrdersData.filter(
    (o) => o.dueStatusColor === "urgent" || o.dueStatusColor === "warning"
  );

  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-gray-800 mb-3">Operación en vivo</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cola de pedidos */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-sm mb-3">Cola de pedidos</h3>
          <ul className="text-xs space-y-2 text-gray-600">
            {mockQueueStatus.map((q, idx) => (
              <li key={idx} className={`flex justify-between ${q.isAlert ? "text-red-500" : ""}`}>
                <span>{q.label}</span> <span className="font-bold">{q.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pedidos atrasados */}
        <div className="bg-white border rounded-xl p-4 shadow-sm col-span-2">
          <h3 className="font-semibold text-sm mb-3">Pedidos atrasados</h3>
          <ul className="text-xs space-y-3">
            {lateOrders.map((o, idx) => (
              <li
                key={o.id}
                className={`flex justify-between ${idx !== lateOrders.length - 1 ? "border-b pb-2" : ""}`}
              >
                <span className="font-medium text-gray-700">
                  {o.orderNumber} · {o.productsSummary} · {o.origin}
                </span>
                <span
                  className={`font-semibold ${
                    o.dueStatusColor === "urgent" ? "text-red-500" : "text-amber-600"
                  }`}
                >
                  {o.dueStatusLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};