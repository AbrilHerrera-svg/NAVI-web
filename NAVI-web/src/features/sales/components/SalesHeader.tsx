import { formatLongDateEs } from '../../../lib/date';

export const SalesHeader = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ventas</h1>
        <p className="text-sm text-slate-400">{formatLongDateEs(new Date())}</p>
      </div>

      <div className="w-48">
        <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#5960A1]">
          <option value="today">Hoy</option>
          <option value="yesterday">Ayer</option>
          <option value="this_week">Esta semana</option>
          <option value="this_month">Este mes</option>
        </select>
      </div>
    </div>
  );
};