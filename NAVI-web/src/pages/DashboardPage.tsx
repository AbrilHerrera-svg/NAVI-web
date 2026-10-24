import { DashboardHeader, UrgentAlerts, QuickMetrics, LiveOperations } from '../features/dashboard';

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Si cualquiera de estos falla o tiene un error de sintaxis, React te avisará */}
      <DashboardHeader />
      <UrgentAlerts />
      <QuickMetrics />
      <LiveOperations />
    </div>
  );
}