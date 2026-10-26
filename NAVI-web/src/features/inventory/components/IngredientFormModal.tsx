import { useState, type FormEvent } from 'react';
import Button from '../../../components/ui/Button';
import type { InventoryIngredient, NewIngredientInput, UpdateIngredientInput } from '../types';

interface Props {
  isOpen: boolean;
  // Si viene un ingrediente, el modal edita; si no, crea uno nuevo.
  ingredient: InventoryIngredient | null;
  onClose: () => void;
  onCreate: (input: NewIngredientInput) => void;
  onUpdate: (id: string, input: UpdateIngredientInput) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]';

// El padre debe remontar este componente (key={ingredient?.id ?? 'new'}) al cambiar de
// ingrediente o entre crear/editar, para que los valores iniciales de abajo se recalculen
// sin depender de un efecto que sincronice estado tras el primer render.
export const IngredientFormModal = ({ isOpen, ingredient, onClose, onCreate, onUpdate }: Props) => {
  const [name, setName] = useState(ingredient?.name ?? '');
  const [unit, setUnit] = useState(ingredient?.unit ?? '');
  const [unitsPerBox, setUnitsPerBox] = useState(ingredient ? String(ingredient.unitsPerBox) : '');
  const [costPerBox, setCostPerBox] = useState(ingredient ? String(ingredient.costPerBox) : '');
  const [minStock, setMinStock] = useState(ingredient ? String(ingredient.minStock) : '');
  const [initialStock, setInitialStock] = useState(ingredient ? '' : '0');

  if (!isOpen) return null;

  const unitsPerBoxNum = parseFloat(unitsPerBox);
  const costPerBoxNum = parseFloat(costPerBox);
  const minStockNum = parseFloat(minStock);
  const initialStockNum = parseFloat(initialStock);

  const canSave =
    name.trim().length > 0 &&
    unit.trim().length > 0 &&
    unitsPerBoxNum > 0 &&
    costPerBoxNum >= 0 &&
    minStockNum >= 0 &&
    (ingredient || initialStockNum >= 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    const base = {
      name: name.trim(),
      unit: unit.trim(),
      unitsPerBox: unitsPerBoxNum,
      costPerBox: costPerBoxNum,
      minStock: minStockNum,
    };

    if (ingredient) {
      onUpdate(ingredient.id, base);
    } else {
      onCreate({ ...base, initialStock: initialStockNum });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-base font-bold text-slate-800">
            {ingredient ? 'Editar ingrediente' : 'Nuevo ingrediente'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {ingredient
              ? 'La existencia no se edita aquí; usa Ajustar existencias para corregirla.'
              : 'Da de alta un ingrediente de inventario con su costo y mínimo.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Leche entera"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unidad</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="ej. ml, g, pieza"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unidades por caja</label>
              <input
                type="text"
                inputMode="decimal"
                value={unitsPerBox}
                onChange={(e) => setUnitsPerBox(e.target.value)}
                placeholder="ej. 12000"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Costo por caja</label>
              <input
                type="text"
                inputMode="decimal"
                value={costPerBox}
                onChange={(e) => setCostPerBox(e.target.value)}
                placeholder="$0.00"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mínimo (cajas)</label>
              <input
                type="text"
                inputMode="decimal"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="ej. 2"
                className={inputClass}
              />
            </div>
          </div>

          {!ingredient && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Existencia inicial (cajas)</label>
              <input
                type="text"
                inputMode="decimal"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1 py-2">
              Cancelar
            </Button>
            <Button type="submit" disabled={!canSave} className="flex-1 py-2 disabled:opacity-40 disabled:cursor-not-allowed">
              {ingredient ? 'Guardar cambios' : 'Crear ingrediente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
