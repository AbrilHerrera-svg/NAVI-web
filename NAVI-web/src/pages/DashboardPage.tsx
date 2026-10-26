import {
  DashboardHeader,
  UrgentAlerts,
  QuickMetrics,
  LiveOperations,
  InventorySection,
  TeamAndTasks,
  SalesAndFinance,
} from '../features/dashboard';

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <DashboardHeader />
      <UrgentAlerts />
      <QuickMetrics />
      <LiveOperations />
      <InventorySection />
      <TeamAndTasks />
      <SalesAndFinance />
    </div>
  );
}