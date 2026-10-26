import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import { mockTopProducts } from "../../dashboard";

export const SalesTopProducts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Más vendidos */}
      <Card className="shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 mb-4">Más vendidos</h2>
        <div className="space-y-3.5 text-xs">
          {mockTopProducts.map((product, idx) => (
            <div key={idx} className="flex justify-between items-center text-slate-700">
              <span className="font-medium">{product.name}</span>
              <span className="font-bold text-slate-900 text-sm">{product.count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Más agotados */}
      <Card className="shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-4">Más agotados</h2>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Coconut Milk Tea</h3>
          <Badge color="danger" className="inline-block mb-4">
            3 veces
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Revisa las existencias antes del próximo servicio.
        </p>
      </Card>
    </div>
  );
};