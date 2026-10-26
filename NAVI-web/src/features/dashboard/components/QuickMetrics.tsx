import Card from "../../../components/ui/Card";
import { mockQuickMetrics } from "../data/dashboardMock";

export const QuickMetrics = () => {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
      {mockQuickMetrics.map((m, idx) => (
        <Card key={idx}>
          <p className="text-xs text-gray-400 font-medium">{m.label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{m.value}</p>
          <p className={`text-[11px] mt-1 ${m.isAlert ? 'text-red-500' : 'text-gray-400'}`}>
            {m.sub}
          </p>
        </Card>
      ))}
    </section>
  );
};
