import { useState } from 'react';
import {
  SalesHeader,
  SalesMetrics,
  SalesCharts,
  SalesTopProducts,
  useSales,
  type SalesPeriod,
} from '../features/sales';

export default function SalesPage() {
  const [period, setPeriod] = useState<SalesPeriod>('today');
  const { data, loading, error, reload } = useSales(period);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <SalesHeader period={period} onPeriodChange={setPeriod} onRefresh={reload} loading={loading} />

      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
          <span>{error}</span>
          <button onClick={reload} className="font-semibold underline cursor-pointer">
            Reintentar
          </button>
        </div>
      )}

      {!data && loading && <p className="text-sm text-slate-400">Cargando ventas...</p>}

      {data && (
        <>
          <SalesMetrics metrics={data.metrics} />
          <SalesCharts
            title={data.chartTitle}
            chart={data.chart}
            paymentMethods={data.paymentMethods}
            totalLabel={data.totalLabel}
          />
          <SalesTopProducts topProducts={data.topProducts} outOfStock={data.outOfStock} />
        </>
      )}
    </div>
  );
}
