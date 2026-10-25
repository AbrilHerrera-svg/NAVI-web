import AlertCard, {type AlertTagColor} from "../../../components/ui/AlertCard";
export const UrgentAlerts = () => {
const alerts: { tag: string; tagColor: AlertTagColor; count: number; title: string; desc: string; link: string }[] = [
  { tag: 'Atrasado', tagColor: 'danger', count: 2, title: 'Pedidos atrasados / por vencer', desc: '#88 Chilaquiles rojos · atrasado +8 min', link: 'Ver Pedidos →' },
  { tag: 'Por vencer', tagColor: 'warning', count: 2, title: 'Ingredientes bajos / agotados', desc: 'Leche entera 4,200 ml · Jarabe de chocolate agotado', link: 'Ver Inventario →' },
  { tag: 'Pendiente', tagColor: 'warning', count: 1, title: 'Limpieza de cierre pendiente', desc: 'Lista de cierre incompleta', link: 'Ver Tareas →' },
  { tag: 'Pendiente', tagColor: 'warning', count: 2, title: 'Tareas de apertura / cierre pendientes', desc: '2 tareas sin completar', link: 'Ver Tareas →' },
  { tag: 'Revisar', tagColor: 'warning', count: 1, title: 'Caja abierta con diferencia', desc: 'Cierre pendiente · diferencia detectada', link: 'Ver Caja →' },
];
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-gray-800">Requiere atención ahora</h2>
          <p className="text-xs text-gray-400">Alertas y acciones prioritarias</p>
        </div>
        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">6 alertas</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {alerts.map((item, idx) => (
  <AlertCard key={idx} {...item} />
))}
      </div>
    </section>
  );
};