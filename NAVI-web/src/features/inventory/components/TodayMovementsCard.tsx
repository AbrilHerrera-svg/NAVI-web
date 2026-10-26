import Card from '../../../components/ui/Card';
import { formatSignedBoxes, getLatestMovementDate, type InventoryMovement, type MovementType } from '../types';

interface Props {
  movements: InventoryMovement[];
}

const quantityColor: Partial<Record<MovementType, string>> = {
  Compra: 'text-emerald-600',
  Merma: 'text-rose-600',
};

// "17 Oct 2026 · 13:58" → "13:58"
const timeFromLabel = (dateLabel: string) => dateLabel.split('·').pop()?.trim() ?? dateLabel;

export const TodayMovementsCard = ({ movements }: Props) => {
  const latestDate = getLatestMovementDate(movements);
  const today = movements
    .filter((m) => m.date === latestDate)
    .sort((a, b) => b.dateLabel.localeCompare(a.dateLabel));

  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Movimientos de hoy</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-xs">
          <h3 className="font-semibold text-sm text-slate-800 mb-3">Entradas y salidas</h3>

          <div className="space-y-2 text-xs">
            {today.length === 0 && <p className="text-slate-400">Sin movimientos todavía hoy.</p>}
            {today.map((item) => (
              <div key={item.id} className="flex justify-between text-slate-500">
                <span>
                  {timeFromLabel(item.dateLabel)} · {item.type} · {item.ingredientName}
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
