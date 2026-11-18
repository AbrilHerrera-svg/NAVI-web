import { useState } from 'react';
import {
  DashboardHeader,
  UrgentAlerts,
  QuickMetrics,
  LiveOperations,
  InventorySection,
  TeamAndTasks,
  SalesAndFinance,
  useDashboard,
  type DashboardPeriod,
} from '../features/dashboard';
import { useSession } from '../features/profile';
import { type PageId } from '../components/layout/Sidebar';

interface Props {
  onNavigate: (page: PageId) => void;
}

// Los id de cada bloque los usa el buscador (Topbar) para hacer scroll hasta la sección.
export default function DashboardPage({ onNavigate }: Props) {
  const { profile } = useSession();
  const [period, setPeriod] = useState<DashboardPeriod>('hoy');

  // Solo el dueño ve "Ventas y dinero"
  const canSeeFinance = profile.role === 'Dueño';
  const { data, loading, error, reload } = useDashboard(period, canSeeFinance);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <DashboardHeader period={period} onPeriodChange={setPeriod} onRefresh={reload} loading={loading} />

      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
          <span>{error}</span>
          <button onClick={reload} className="font-semibold underline cursor-pointer">
            Reintentar
          </button>
        </div>
      )}

      {!data && loading && <p className="text-sm text-slate-400">Cargando resumen...</p>}

      {data && (
        <>
          <div id="dashboard-alertas" className="scroll-mt-4">
            <UrgentAlerts alerts={data.alerts} onNavigate={onNavigate} />
          </div>
          <div id="dashboard-metricas" className="scroll-mt-4">
            <QuickMetrics metrics={data.metrics} />
          </div>
          <div id="dashboard-operacion" className="scroll-mt-4">
            <LiveOperations queue={data.queue} lateOrders={data.lateOrders} />
          </div>
          <div id="dashboard-inventario" className="scroll-mt-4">
            <InventorySection topProducts={data.topProducts} outOfStock={data.outOfStock} lowStock={data.lowStock} />
          </div>
          <div id="dashboard-equipo" className="scroll-mt-4">
            <TeamAndTasks tasks={data.todayTasks} cleaningSummary={data.cleaningSummary} shift={data.todayShift} />
          </div>
          {canSeeFinance && (
            <div id="dashboard-finanzas" className="scroll-mt-4">
              <SalesAndFinance
                hourlySales={data.hourlySales}
                paymentMethods={data.paymentMethods}
                weeklyFinance={data.weeklyFinance}
                upcomingExpenses={data.upcomingExpenses}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
