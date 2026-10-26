import { useState, type FormEvent } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { todayISO } from '../../../lib/date';
import { useSession } from '../../profile';
import { IngredientSearchInput } from './IngredientSearchInput';
import {
  formatBoxes,
  formatSignedBoxes,
  roundBoxes,
  type AdjustmentType,
  type InventoryIngredient,
  type StockAdjustmentInput,
} from '../types';

interface Props {
  ingredients: InventoryIngredient[];
  onCancel: () => void;
  onSubmit: (input: StockAdjustmentInput) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]';

export const AdjustStockForm = ({ ingredients, onCancel, onSubmit }: Props) => {
  const { profile } = useSession();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<InventoryIngredient | null>(null);
  const [notes, setNotes] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType | ''>('');
  const [countedBoxes, setCountedBoxes] = useState('');
  const [date, setDate] = useState(todayISO());
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');

  const counted = parseFloat(countedBoxes);
  const hasCounted = !isNaN(counted) && counted >= 0;
  const difference = selected && hasCounted ? roundBoxes(counted - selected.stock) : null;

  const canSave =
    !!selected &&
    adjustmentType !== '' &&
    hasCounted &&
    difference !== 0 &&
    reason.trim().length > 0 &&
    date.trim().length > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    onSubmit({
      ingredientId: selected.id,
      type: adjustmentType,
      countedBoxes: counted,
      notes: notes.trim(),
      // Quien hace el ajuste es quien tiene la sesión abierta, no texto libre capturado a mano.
      responsible: profile.name,
      date,
      reason: reason.trim(),
      reference: reference.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ajustar existencias</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Corrige la cantidad real de un ingrediente. Cada ajuste queda registrado con su motivo.
        </p>
      </div>

      <Card className="rounded-2xl shadow-2xs space-y-4">
        <h2 className="font-bold text-sm text-slate-900">Ingrediente</h2>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Ingrediente</label>
          <IngredientSearchInput
            ingredients={ingredients}
            query={query}
            onQueryChange={(value) => {
              setQuery(value);
              setSelected(null);
            }}
            onSelect={(ingredient) => {
              setSelected(ingredient);
              setQuery(ingredient.name);
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Notas del ajuste</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Explica qué pasó (opcional)"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tipo de ajuste</label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value as AdjustmentType | '')}
              className={`${inputClass} bg-white ${adjustmentType ? 'text-slate-800' : 'text-slate-400'}`}
            >
              <option value="" disabled>
                Selecciona un tipo
              </option>
              <option value="Ajuste">Ajuste</option>
              <option value="Merma">Merma</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Cajas contadas</label>
            <input
              type="text"
              inputMode="decimal"
              value={countedBoxes}
              onChange={(e) => setCountedBoxes(e.target.value)}
              placeholder="ej. 3 cajas"
              className={inputClass}
            />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl shadow-2xs space-y-4">
        <h2 className="font-bold text-sm text-slate-900">Motivo</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Responsable</label>
            <div className={`${inputClass} bg-slate-50 text-slate-600 flex items-center justify-between`}>
              <span>{profile.name}</span>
              <span className="text-[10px] text-slate-400">{profile.role}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayISO()}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Motivo del ajuste</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Conteo, merma, desperdicio o error"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Referencia (opcional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="ej. Lote caducado"
              className={inputClass}
            />
          </div>
        </div>

        <div className="bg-[#5960A1]/10 rounded-xl p-3 text-xs text-[#5960A1] font-medium">
          Existencia actual: {selected ? formatBoxes(selected.stock) : '—'} · Nueva existencia:{' '}
          {hasCounted ? formatBoxes(counted) : '—'}
          {difference !== null && difference !== 0 && ` (${formatSignedBoxes(difference)})`}. Un ajuste no
          se puede deshacer; para corregirlo, registra otro ajuste.
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="px-5 py-2">
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!canSave}
          className="px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Guardar ajuste
        </Button>
      </div>
    </form>
  );
};
