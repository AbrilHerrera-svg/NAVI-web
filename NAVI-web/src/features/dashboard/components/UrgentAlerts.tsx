export const UrgentAlerts = () => {
  const alerts = [
    { tag: 'Atrasado', color: 'bg-red-100 text-red-600', count: 2, title: 'Pedidos atrasados / por vencer', desc: '#88 Chilaquiles rojos · atrasado +8 min', link: 'Ver Pedidos →' },
    { tag: 'Por vencer', color: 'bg-yellow-100 text-yellow-700', count: 2, title: 'Ingredientes bajos / agotados', desc: 'Leche entera 4,200 ml · Jarabe de chocolate agotado', link: 'Ver Inventario →' },
    { tag: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', count: 1, title: 'Limpieza de cierre pendiente', desc: 'Lista de cierre incompleta', link: 'Ver Tareas →' },
    { tag: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', count: 2, title: 'Tareas de apertura / cierre pendientes', desc: '2 tareas sin completar', link: 'Ver Tareas →' },
    { tag: 'Revisar', color: 'bg-yellow-100 text-yellow-700', count: 1, title: 'Caja abierta con diferencia', desc: 'Cierre pendiente · diferencia detectada', link: 'Ver Caja →' },
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
          <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-gray-300 transition">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.color}`}>
                  {item.tag}
                </span>
                <span className="text-xl font-bold text-gray-700">{item.count}</span>
              </div>
              <h3 className="font-semibold text-sm text-gray-800">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.desc}</p>
            </div>
            <button className="text-left text-xs font-semibold text-navi hover:underline mt-4 hover:underline">
              {item.link}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};