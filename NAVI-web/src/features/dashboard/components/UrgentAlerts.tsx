import AlertCard from "../../../components/ui/AlertCard";
import { mockUrgentAlerts } from "../data/dashboardMock";
export const UrgentAlerts = () => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-gray-800">Requiere atención ahora</h2>
          <p className="text-xs text-gray-400">Alertas y acciones prioritarias</p>
        </div>
        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">{mockUrgentAlerts.length} alertas</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {mockUrgentAlerts.map((item, idx) => (
  <AlertCard key={idx} {...item} />
))}
      </div>
    </section>
  );
};