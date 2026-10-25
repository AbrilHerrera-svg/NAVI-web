import {
  SalesHeader,
  SalesMetrics,
  SalesCharts,
  SalesTopProducts,
} from '../features/sales';

export default function SalesPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <SalesHeader />
      <SalesMetrics />
      <SalesCharts />
      <SalesTopProducts />
    </div>
  );
}