import Badge from '../../../components/ui/Badge';
import { formatBoxes, formatMoney, getStockStatus, type InventoryIngredient, type StockStatus } from '../types';

interface Props {
  ingredients: InventoryIngredient[];
}

const statusColor: Record<StockStatus, 'success' | 'warning' | 'danger'> = {
  Disponible: 'success',
  Bajo: 'warning',
  Agotado: 'danger',
};

export const IngredientsTableView = ({ ingredients }: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Ingrediente</th>
              <th className="py-3 px-4">Existencia</th>
              <th className="py-3 px-4">Mínimo</th>
              <th className="py-3 px-4">Costo por caja</th>
              <th className="py-3 px-4">Valor</th>
              <th className="py-3 px-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {ingredients.map((item) => {
              const status = getStockStatus(item);
              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3.5 px-4 text-slate-800">{formatBoxes(item.stock)}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatBoxes(item.minStock)}</td>
                  <td className="py-3.5 px-4 text-slate-500">{formatMoney(item.costPerBox)}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatMoney(item.stock * item.costPerBox)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge color={statusColor[status]}>{status}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
