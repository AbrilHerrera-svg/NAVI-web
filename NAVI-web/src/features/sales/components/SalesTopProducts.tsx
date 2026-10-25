export const SalesTopProducts = () => {
  const topProducts = [
    { name: 'Chai Milk Tea GDE', count: 24 },
    { name: 'Taro Smoothie MED', count: 18 },
    { name: 'Chilaquiles rojos', count: 15 },
    { name: 'Mango Fruit Tea MED', count: 12 },
    { name: 'Crepas de Nutella', count: 9 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Más vendidos */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 mb-4">Más vendidos</h2>
        <div className="space-y-3.5 text-xs">
          {topProducts.map((product, idx) => (
            <div key={idx} className="flex justify-between items-center text-slate-700">
              <span className="font-medium">{product.name}</span>
              <span className="font-bold text-slate-900 text-sm">{product.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Más agotados */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-4">Más agotados</h2>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Coconut Milk Tea</h3>
          <span className="inline-block bg-rose-100 text-rose-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
            3 veces
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Revisa las existencias antes del próximo servicio.
        </p>
      </div>
    </div>
  );
};