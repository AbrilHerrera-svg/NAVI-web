import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import type { SalesTopProduct } from "../types";

interface Props {
  topProducts: SalesTopProduct[];
  outOfStock: string[];
}

const MAX_AGOTADOS = 5;

export const SalesTopProducts = ({ topProducts, outOfStock }: Props) => {
  const visibles = outOfStock.slice(0, MAX_AGOTADOS);
  const restantes = outOfStock.length - visibles.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Más vendidos */}
      <Card className="shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 mb-4">Más vendidos</h2>
        {topProducts.length === 0 ? (
          <p className="text-xs text-slate-400">Aún no hay pedidos en este periodo.</p>
        ) : (
          <div className="space-y-3.5 text-xs">
            {topProducts.map((product) => (
              <div key={product.name} className="flex justify-between items-center text-slate-700">
                <span className="font-medium">{product.name}</span>
                <span className="font-bold text-slate-900 text-sm">{product.count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Agotados en este momento */}
      <Card className="shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-4">Agotados ahora</h2>
          {outOfStock.length === 0 ? (
            <p className="text-sm text-slate-700">Todo el menú está disponible.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {visibles.map((nombre) => (
                <div key={nombre} className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">{nombre}</span>
                  <Badge color="danger">Agotado</Badge>
                </div>
              ))}
              {restantes > 0 && <p className="text-slate-400">y {restantes} más</p>}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Revisa las existencias antes del próximo servicio.
        </p>
      </Card>
    </div>
  );
};
