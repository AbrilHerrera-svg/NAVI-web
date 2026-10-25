export const SalesMetrics = () => {
  const metrics = [
    { label: 'Ventas totales', value: '$4,280' },
    { label: 'Pedidos', value: '96' },
    { label: 'Ticket promedio', value: '$44.58' },
    { label: 'Mejor día u hora', value: '1–2 p. m.' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <p className="text-xs text-slate-400 font-medium">{item.label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
};