import { useState, type FormEvent } from 'react';
import Button from '../../../components/ui/Button';
import type { InventoryIngredient, RecipeLine } from '../../inventory';

interface Props {
  isOpen: boolean;
  ingredients: InventoryIngredient[];
  excludeIds: string[];
  onClose: () => void;
  onAdd: (line: RecipeLine) => void;
}

export const AddIngredientModal = ({ isOpen, ingredients, excludeIds, onClose, onAdd }: Props) => {
  const [ingredientId, setIngredientId] = useState('');
  const [amountMed, setAmountMed] = useState('');
  const [amountGde, setAmountGde] = useState('');

  if (!isOpen) return null;

  const available = ingredients.filter((i) => !excludeIds.includes(i.id));

  const reset = () => {
    setIngredientId('');
    setAmountMed('');
    setAmountGde('');
  };

  const resetAndClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const med = parseFloat(amountMed);
    const gde = parseFloat(amountGde);
    if (!ingredientId || (!(med > 0) && !(gde > 0))) return;

    onAdd({
      ingredientId,
      amountMed: med > 0 ? med : undefined,
      amountGde: gde > 0 ? gde : undefined,
    });
    resetAndClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-base font-bold text-slate-800">Agregar ingrediente</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Toma el insumo y su costo directo de Inventario, solo captura cuánto se usa por tamaño.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ingrediente de inventario</label>
            <select
              value={ingredientId}
              onChange={(e) => setIngredientId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            >
              <option value="" disabled>
                Selecciona un ingrediente
              </option>
              {available.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} ({ingredient.unit})
                </option>
              ))}
            </select>
            {available.length === 0 && (
              <p className="text-[11px] text-slate-400 mt-1">
                Ya se agregaron todos los ingredientes disponibles en Inventario.
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase">
              Cantidad por tamaño (deja en blanco si no aplica)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad MED</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amountMed}
                  onChange={(e) => setAmountMed(e.target.value)}
                  placeholder="ej. 220"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad GDE</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amountGde}
                  onChange={(e) => setAmountGde(e.target.value)}
                  placeholder="ej. 300"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={resetAndClose} className="flex-1 py-2">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 py-2">
              Agregar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
