import Card from "../../../components/ui/Card";
export const QuickMetrics = () => {
  const metrics = [
    { label: 'Ventas de hoy', value: '$4,280', sub: '+12% vs. el sábado pasado' },
    { label: 'Pedidos', value: '96', sub: '62 app · 34 mostrador' },
    { label: 'Ticket promedio', value: '$44.58', sub: '+4% vs. el mismo día' },
    { label: 'Tiempo de prep.', value: '9 min', sub: 'dentro de lo estimado' },
    { label: 'Utilidad estimada', value: '$1,240', sub: 'margen 29%' },
    { label: 'Productos agotados', value: '3', sub: '+1 vs. el mismo día', isAlert: true },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      {metrics.map((m, idx) => (
        <Card key={idx}>
          <p className="text-xs text-gray-400 font-medium">{m.label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{m.value}</p>
          <p className={`text-[11px] mt-1 ${m.isAlert ? 'text-red-500' : 'text-gray-400'}`}>
            {m.sub}
          </p>
        </Card>
      ))}
    </section>
  );
};