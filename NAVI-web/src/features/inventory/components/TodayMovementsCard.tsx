import Card from '../../../components/ui/Card';
import { formatSignedBoxes, type MovementType, type TodayMovement } from '../types';

interface Props {
  items: TodayMovement[];
}

const quantityColor: Partial<Record<MovementType, string>> = {
  Compra: 'text-emerald-600',
  Merma: 'text-rose-600',
};

export const TodayMovementsCard = ({ items }: Props) => {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Movimientos de hoy</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-xs">
          <h3 className="font-semibold text-sm text-slate-800 mb-3">Entradas y salidas</h3>

          <div className="space-y-2 text-xs">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-slate-500">
                <span>
                  {item.time} · {item.label}
                </span>
                <span className={`font-bold ${quantityColor[item.type] ?? 'text-slate-900'}`}>
                  {formatSignedBoxes(item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
