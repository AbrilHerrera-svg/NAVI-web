import { mockTopProducts, mockOutOfStock, mockLowStock } from "../data/dashboardMock";
export const InventorySection = () => {

  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Productos e inventario</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Más vendidos hoy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-800 mb-4">Más vendidos hoy</h3>
          <div className="space-y-3 text-xs">
            {mockTopProducts.map((p, i) => (
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
            {mockOutOfStock.map((p, i) => (
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
            {mockLowStock.map((ing, i) => (
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