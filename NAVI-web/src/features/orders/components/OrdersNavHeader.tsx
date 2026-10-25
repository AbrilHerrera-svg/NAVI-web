interface Props {
  viewMode: 'tarjetas' | 'lista' | 'excepciones';
  onChangeView: (mode: 'tarjetas' | 'lista' | 'excepciones') => void;
  onGoToNewOrder: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const OrdersNavHeader = ({
  viewMode,
  onChangeView,
  onGoToNewOrder,
  searchQuery,
  onSearchChange,
}: Props) => {
  return (
    <div className="space-y-4">
      {/* Fila superior: Título, tabs y botón de acción */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
          <p className="text-xs text-slate-400 mt-0.5">Cola en vivo · actualizada hace un momento</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Selector de Vistas */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => onChangeView('lista')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'lista' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => onChangeView('tarjetas')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'tarjetas' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Tarjetas
            </button>
            <button
              onClick={() => onChangeView('excepciones')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'excepciones' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Excepciones · 4
            </button>
          </div>

          <button
            onClick={onGoToNewOrder}
            className="px-4 py-2 bg-[#5960A1] hover:bg-[#484e85] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            Nuevo pedido
          </button>
        </div>
      </div>

      {/* Fila de Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]">
          <option>Todos los estados</option>
          <option>Nuevo</option>
          <option>En preparación</option>
          <option>Listo</option>
          <option>Recogido</option>
        </select>

        <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]">
          <option>Todos los orígenes</option>
          <option>App</option>
          <option>Mostrador</option>
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar número, cliente, producto"
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#5960A1] shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};