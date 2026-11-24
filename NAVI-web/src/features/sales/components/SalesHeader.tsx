import { formatLongDateEs } from '../../../lib/date';
import Button from '../../../components/ui/Button';
import type { SalesPeriod } from '../types';

interface Props {
  period: SalesPeriod;
  onPeriodChange: (period: SalesPeriod) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const SalesHeader = ({ period, onPeriodChange, onRefresh, loading }: Props) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ventas</h1>
        <p className="text-sm text-slate-400">{formatLongDateEs(new Date())}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-48">
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as SalesPeriod)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#5960A1]"
          >
            <option value="today">Hoy</option>
            <option value="yesterday">Ayer</option>
            <option value="this_week">Esta semana</option>
            <option value="this_month">Este mes</option>
          </select>
        </div>
        <Button variant="secondary" onClick={onRefresh} disabled={loading} className="disabled:opacity-60">
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>
    </div>
  );
};
