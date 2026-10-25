export const DashboardHeader = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Resumen de hoy</h1>
        <p className="text-sm text-gray-500">Sábado, 17 de octubre</p>
      </div>
      <div className="flex items-center gap-3">
        <select className="border text-sm rounded-lg px-3 py-2 bg-white text-gray-700">
          <option>Hoy</option>
          <option>Esta semana</option>
        </select>
      </div>
    </header>
  );
};