import { formatLongDateEs } from '../../../lib/date';
import Button from '../../../components/ui/Button';
import type { DashboardPeriod } from '../types';

interface Props {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const DashboardHeader = ({ period, onPeriodChange, onRefresh, loading }: Props) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {period === 'hoy' ? 'Resumen de hoy' : 'Resumen de la semana'}
        </h1>
        <p className="text-sm text-gray-500">{formatLongDateEs(new Date())}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={onRefresh} disabled={loading} className="disabled:opacity-60">
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value as DashboardPeriod)}
          className="border text-sm rounded-lg px-3 py-2 bg-white text-gray-700"
        >
          <option value="hoy">Hoy</option>
          <option value="semana">Esta semana</option>
        </select>
      </div>
    </header>
  );
};
