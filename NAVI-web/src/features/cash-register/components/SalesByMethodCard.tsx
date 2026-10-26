import Card from '../../../components/ui/Card';
import type { SalesByMethodItem } from '../types';

interface Props {
  items: SalesByMethodItem[];
}

export const SalesByMethodCard = ({ items }: Props) => {
  const total = items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <Card className="shadow-xs">
      <h3 className="font-bold text-sm text-slate-800 mb-3">Ventas por método</h3>

      <div className="space-y-2 text-xs">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-slate-500">
            <span>{item.label}</span>
            <span className="font-bold text-slate-900">${item.amount}</span>
          </div>
        ))}

        <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
          <span>Ventas totales</span>
          <span>${total}</span>
        </div>
      </div>
    </Card>
  );
};
