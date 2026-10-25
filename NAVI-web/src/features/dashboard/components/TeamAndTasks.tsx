
export const TeamAndTasks = () => {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Equipo y tareas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tareas de hoy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-slate-800">Tareas de hoy</h3>
            <p className="text-[11px] text-slate-400">
              Limpieza por área: Cocina ✓ · Barra pendiente · Mesas ✓ · Baños ✓
            </p>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-slate-700">Apertura · Barista · 9:00 a. m.</span>
              <span className="text-emerald-600 font-semibold">Completado</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-slate-700">Inventario de leche · Cocina · 6:00 p. m.</span>
              <span className="text-amber-600 font-semibold">Pendiente</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-slate-700">Limpieza de cierre · Cocina · 9:00 p. m.</span>
              <span className="text-amber-600 font-semibold">Pendiente</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Cierre de caja · Venceño · 9:30 p. m.</span>
              <span className="text-slate-400 font-medium">Bloqueado</span>
            </div>
          </div>
        </div>

        {/* Turno de hoy */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-800 mb-4">Turno de hoy</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Venceño · Abril Herrera</span>
              <span className="text-emerald-600 font-semibold">En turno</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Cajero</span>
              <span className="text-emerald-600 font-semibold">En turno</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Barista</span>
              <span className="text-emerald-600 font-semibold">En turno</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Cocina</span>
              <span className="text-slate-500 font-medium">Inicia 3:00 p. m.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};