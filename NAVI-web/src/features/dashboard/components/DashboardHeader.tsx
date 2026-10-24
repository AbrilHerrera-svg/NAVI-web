export const DashboardHeader = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Resumen de hoy</h1>
        <p className="text-sm text-gray-500">Sábado, 17 de octubre</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar... ⌘K"
            className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navi w-64"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
        </div>
        <select className="border text-sm rounded-lg px-3 py-2 bg-white text-gray-700">
          <option>Hoy</option>
          <option>Esta semana</option>
        </select>
        <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center font-bold text-gray-700">
          U
        </div>
      </div>
    </header>
  );
};