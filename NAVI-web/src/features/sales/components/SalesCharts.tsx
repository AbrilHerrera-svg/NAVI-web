export const SalesCharts = () => {
  const hourlyData = [
    { hour: '8h', height: 'h-16' },
    { hour: '9h', height: 'h-24' },
    { hour: '10h', height: 'h-36', peak: true },
    { hour: '11h', height: 'h-28' },
    { hour: '12h', height: 'h-20' },
    { hour: '1h', height: 'h-40' },
    { hour: '2h', height: 'h-32' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ventas por hora */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-bold text-slate-800">Ventas por hora</h2>
          <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-2xs">
            Exportar
          </button>
        </div>

        {/* Gráfica de barras */}
        <div className="flex items-end justify-between h-48 px-2 border-b border-slate-100 gap-2 sm:gap-4">
          {hourlyData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-full max-w-[48px] rounded-t-lg transition-all ${
                  item.peak ? 'bg-[#5960A1]' : 'bg-[#5960A1]/35'
                } ${item.height}`}
              />
              <span className="text-xs text-slate-400 font-medium">{item.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Por método de pago */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-6">Por método de pago</h2>
          <div className="space-y-5 text-sm">
            <div className="flex justify-between items-center text-slate-700">
              <span>Efectivo</span>
              <span className="font-bold text-slate-900">$1,860</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Terminal de tarjeta</span>
              <span className="font-bold text-slate-900">$1,620</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Transferencia</span>
              <span className="font-bold text-slate-900">$800</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 mt-6">
          <p className="text-xs text-slate-400">Todos los pagos · $4,280 en total</p>
        </div>
      </div>
    </div>
  );
};