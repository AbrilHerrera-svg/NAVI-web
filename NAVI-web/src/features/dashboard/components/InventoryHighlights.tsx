export const InventorySection = () => {
  const topProducts = [
    { name: 'Chai Milk Tea GDE', count: 24 },
    { name: 'Taro Smoothie MED', count: 18 },
    { name: 'Chilaquiles rojos', count: 15 },
    { name: 'Mango Fruit Tea MED', count: 12 },
    { name: 'Crepas de Nutella', count: 9 },
  ];

  const outOfStock = [
    { name: 'Coconut Milk Tea', status: 'agotado' },
    { name: 'Biscoff Smoothie', status: 'agotado 6:40 p. m.' },
    { name: 'Waffle Dulce', status: 'agotado 7:10 p. m.' },
  ];

  const lowStock = [
    { name: 'Leche entera', detail: '4,200 de 6,000 ml', time: '~2 days', isUrgent: false },
    { name: 'Jarabe de chocolate', detail: '0 ml', time: 'agotado', isUrgent: true },
    { name: 'Base de té', detail: '900 de 500 g', time: '~4 days', isUrgent: false },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Productos e inventario</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Más vendidos hoy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-800 mb-4">Más vendidos hoy</h3>
          <div className="space-y-3 text-xs">
            {topProducts.map((p, i) => (
              <div key={i} className="flex justify-between items-center text-slate-700">
                <span>{p.name}</span>
                <span className="font-bold text-slate-900">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Productos agotados */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-slate-800">Productos agotados</h3>
            <p className="text-[11px] text-slate-400">Por ingrediente o caducidad</p>
          </div>
          <div className="space-y-3 text-xs">
            {outOfStock.map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-700">{p.name}</span>
                <span className="text-rose-500 font-medium">{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredientes bajo mínimo */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-slate-800">Ingredientes bajo mínimo</h3>
            <p className="text-[11px] text-slate-400">Compras sugeridas: leche, jarabe</p>
          </div>
          <div className="space-y-3 text-xs">
            {lowStock.map((ing, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-700">
                  {ing.name} <span className="text-slate-400">· {ing.detail}</span>
                </span>
                <span className={`font-semibold ${ing.isUrgent ? 'text-rose-500' : 'text-amber-600'}`}>
                  {ing.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};