import Card from '../../../components/ui/Card';
import { formatMoney, getStockStatus, type InventoryIngredient } from '../types';

interface Props {
  ingredients: InventoryIngredient[];
}

export const InventoryMetrics = ({ ingredients }: Props) => {
  const lowStock = ingredients.filter((i) => getStockStatus(i) === 'Bajo');
  const depleted = ingredients.filter((i) => getStockStatus(i) === 'Agotado');
  const inventoryValue = ingredients.reduce((acc, i) => acc + i.stock * i.costPerBox, 0);
  const dependentProducts = depleted.reduce((acc, i) => acc + i.dependentProducts, 0);
  const atMinimum = lowStock.length + depleted.length;

  const metrics = [
    {
      label: 'Ingredientes en mínimo',
      value: String(atMinimum),
      sub:
        atMinimum > 0
          ? `${lowStock.length} bajo · ${depleted.length} agotado · Requiere atención ahora`
          : 'Todo el inventario por encima del mínimo',
    },
    {
      label: 'Agotado',
      value: String(depleted.length),
      sub:
        depleted.length > 0
          ? `${depleted.map((i) => i.name).join(', ')} · ${dependentProducts} productos dependientes`
          : 'Sin ingredientes agotados',
    },
    {
      label: 'Valor del inventario',
      value: formatMoney(inventoryValue),
      sub: 'MXN · costo unitario × existencias',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((item, idx) => (
        <Card key={idx} className="shadow-xs">
          <p className="text-xs text-slate-400 font-medium">{item.label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{item.value}</p>
          <p className="text-[11px] text-slate-400 mt-1">{item.sub}</p>
        </Card>
      ))}
    </div>
  );
};
