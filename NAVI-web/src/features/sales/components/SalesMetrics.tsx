import Card from "../../../components/ui/Card";
import type { SalesMetric } from "../types";

interface Props {
  metrics: SalesMetric[];
}

export const SalesMetrics = ({ metrics }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => (
        <Card key={item.label} className="shadow-xs">
          <p className="text-xs text-slate-400 font-medium">{item.label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{item.value}</p>
        </Card>
      ))}
    </div>
  );
};
