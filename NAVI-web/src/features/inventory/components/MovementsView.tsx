import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Badge, { type BadgeColor } from '../../../components/ui/Badge';
import {
  formatSignedBoxes,
  getLatestMovementDate,
  type InventoryIngredient,
  type InventoryMovement,
  type MovementType,
} from '../types';

interface Props {
  movements: InventoryMovement[];
  ingredients: InventoryIngredient[];
}

const movementTypes: MovementType[] = ['Venta', 'Cancelación', 'Merma', 'Ajuste', 'Compra'];

const typeColor: Record<MovementType, BadgeColor> = {
  Venta: 'neutral',
  Cancelación: 'info',
  Merma: 'danger',
  Ajuste: 'warning',
  Compra: 'success',
};

const selectClass =
  'px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]';

const dateInputClass =
  'px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]';

type RangePreset = 'todo' | 'hoy' | '7d' | 'personalizado';

// Resta días a una fecha ISO (yyyy-mm-dd) sin depender de huso horario del navegador.
const subtractDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};

export const MovementsView = ({ movements, ingredients }: Props) => {
  const [typeFilter, setTypeFilter] = useState('');
  const [ingredientFilter, setIngredientFilter] = useState('');
  const [rangePreset, setRangePreset] = useState<RangePreset>('todo');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const latestDate = getLatestMovementDate(movements);

  const handlePresetChange = (preset: RangePreset) => {
    setRangePreset(preset);
    if (preset === 'todo') {
      setDateFrom('');
      setDateTo('');
    } else if (preset === 'hoy') {
      setDateFrom(latestDate);
      setDateTo(latestDate);
    } else if (preset === '7d') {
      setDateFrom(subtractDays(latestDate, 6));
      setDateTo(latestDate);
    }
    // 'personalizado' deja los campos de fecha como estén para que el usuario los edite.
  };

  const filtered = movements.filter((m) => {
    const matchesType = !typeFilter || m.type === typeFilter;
    const matchesIngredient = !ingredientFilter || m.ingredientName === ingredientFilter;
    const matchesFrom = !dateFrom || m.date >= dateFrom;
    const matchesTo = !dateTo || m.date <= dateTo;
    return matchesType && matchesIngredient && matchesFrom && matchesTo;
  });

  return (
    <Card className="shadow-xs space-y-4">
      <h3 className="font-bold text-sm text-slate-800">Movimientos de existencias</h3>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={rangePreset}
          onChange={(e) => handlePresetChange(e.target.value as RangePreset)}
          className={selectClass}
        >
          <option value="todo">Todas las fechas</option>
          <option value="hoy">Hoy</option>
          <option value="7d">Últimos 7 días</option>
          <option value="personalizado">Rango personalizado</option>
        </select>

        {rangePreset === 'personalizado' && (
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              max={dateTo || undefined}
              className={dateInputClass}
              aria-label="Desde"
            />
            <span className="text-xs text-slate-400">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min={dateFrom || undefined}
              className={dateInputClass}
              aria-label="Hasta"
            />
          </div>
        )}

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">Todos los tipos</option>
          {movementTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={ingredientFilter}
          onChange={(e) => setIngredientFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">Todos los ingredientes</option>
          {ingredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.name}>
              {ingredient.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Ingrediente</th>
                <th className="py-3 px-4">Cantidad</th>
                <th className="py-3 px-4">Referencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 text-slate-500">{item.dateLabel}</td>
                  <td className="py-3.5 px-4">
                    <Badge color={typeColor[item.type]}>{item.type}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.ingredientName}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatSignedBoxes(item.quantity)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{item.reference}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 px-4 text-center text-sm text-slate-400">
                    No hay movimientos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-slate-400">
        {filtered.length} {filtered.length === 1 ? 'movimiento reciente' : 'movimientos recientes'} · Los
        movimientos anteriores forman parte del saldo acumulado.
      </p>

      <div className="bg-[#5960A1]/10 rounded-xl p-3 text-xs text-[#5960A1] font-medium">
        Una compra no se puede editar. Registrar compra suma existencias y crea un gasto en Finanzas →
        Proveedores. Cada ajuste conserva su motivo y referencia.
      </div>
    </Card>
  );
};
