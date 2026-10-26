import { useState } from 'react';
import {
  DashboardHeader,
  UrgentAlerts,
  QuickMetrics,
  LiveOperations,
  InventorySection,
  TeamAndTasks,
  SalesAndFinance,
  mockQuickMetrics,
  mockQuickMetricsWeek,
  type DashboardPeriod,
} from '../features/dashboard';

export default function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>('hoy');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <DashboardHeader period={period} onPeriodChange={setPeriod} />
      <UrgentAlerts />
      <QuickMetrics metrics={period === 'hoy' ? mockQuickMetrics : mockQuickMetricsWeek} />
      <LiveOperations />
      <InventorySection />
      <TeamAndTasks />
      <SalesAndFinance />
    </div>
  );
}
