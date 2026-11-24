import AlertCard from "../../../components/ui/AlertCard";
import type { PageId } from "../../../components/layout/Sidebar";
import type { AlertCardItem } from "../types";

interface Props {
  alerts: AlertCardItem[];
  onNavigate: (page: PageId) => void;
}

export const UrgentAlerts = ({ alerts, onNavigate }: Props) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-gray-800">Requiere atención ahora</h2>
          <p className="text-xs text-gray-400">Alertas y acciones prioritarias</p>
        </div>
        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">
          {alerts.length} {alerts.length === 1 ? "alerta" : "alertas"}
        </span>
      </div>

      {alerts.length === 0 ? (
        <p className="text-xs text-slate-400 bg-white border border-slate-200 rounded-xl p-4">
          Todo en orden por ahora. No hay alertas pendientes.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.map((item, idx) => (
            <AlertCard
              key={idx}
              tag={item.tag}
              tagColor={item.tagColor}
              count={item.count}
              title={item.title}
              desc={item.desc}
              link={item.link}
              onLinkClick={() => onNavigate(item.target)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
