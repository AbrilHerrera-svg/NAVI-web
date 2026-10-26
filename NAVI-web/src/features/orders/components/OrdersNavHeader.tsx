import { Search } from "lucide-react";
import Button from "../../../components/ui/Button";

interface Props {
  viewMode: 'tarjetas' | 'lista' | 'excepciones';
  onChangeView: (mode: 'tarjetas' | 'lista' | 'excepciones') => void;
  onGoToNewOrder: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  exceptionsCount: number;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  originFilter: string;
  onOriginFilterChange: (origin: string) => void;
}

export const OrdersNavHeader = ({
  viewMode,
  onChangeView,
  onGoToNewOrder,
  searchQuery,
  onSearchChange,
  exceptionsCount,
  statusFilter,
  onStatusFilterChange,
  originFilter,
  onOriginFilterChange,
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
              Excepciones · {exceptionsCount}
            </button>
          </div>

        <Button onClick={onGoToNewOrder}>Nuevo pedido</Button> 
        </div>
      </div>

      {/* Fila de Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
        >
          <option value="">Todos los estados</option>
          <option value="Nuevo">Nuevo</option>
          <option value="En preparación">En preparación</option>
          <option value="Listo">Listo</option>
          <option value="Recogido">Recogido</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        <select
          value={originFilter}
          onChange={(e) => onOriginFilterChange(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
        >
          <option value="">Todos los orígenes</option>
          <option value="App">App</option>
          <option value="Mostrador">Mostrador</option>
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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