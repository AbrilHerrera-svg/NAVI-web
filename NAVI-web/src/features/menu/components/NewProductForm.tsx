import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { AddIngredientModal } from './AddIngredientModal';
import { useInventory, type RecipeLine } from '../../inventory';
import { MENU_CATEGORIES, WEEK_DAYS } from '../types';

interface Props {
  onCancel: () => void;
  onSubmit: () => void;
}

const inputClass =
  'w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]';

export const NewProductForm = ({ onCancel, onSubmit }: Props) => {
  const { ingredients: inventoryIngredients } = useInventory();
  const [lines, setLines] = useState<RecipeLine[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [category, setCategory] = useState('');
  const [priceMed, setPriceMed] = useState('0.00');
  const [priceGde, setPriceGde] = useState('0.00');
  const [daysMode, setDaysMode] = useState<'todos' | 'elegir'>('todos');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [status, setStatus] = useState<'Activo' | 'Inactivo'>('Activo');

  const handleRemoveIngredient = (ingredientId: string) => {
    setLines((prev) => prev.filter((line) => line.ingredientId !== ingredientId));
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nuevo producto</h1>
        <p className="text-xs text-slate-400 mt-0.5">Agrega los datos del producto y su receta. Puedes cambiarlos después.</p>
      </div>

      <Card className="rounded-2xl shadow-2xs space-y-6">
        <h2 className="font-bold text-sm text-slate-900">Detalles del producto</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del producto</label>
            <input
              type="text"
              placeholder="ej. Chai Milk Tea"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputClass} bg-white ${category ? 'text-slate-800' : 'text-slate-400'}`}
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {MENU_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Precio · MED</label>
            <input
              type="text"
              value={`$${priceMed}`}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setPriceMed(e.target.value.replace(/^\$/, ''))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Precio · GDE</label>
            <input
              type="text"
              value={`$${priceGde}`}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setPriceGde(e.target.value.replace(/^\$/, ''))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tiempo de prep.</label>
            <input
              type="text"
              placeholder="ej. 5 min"
              onFocus={(e) => e.target.select()}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Días disponibles</label>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 w-fit">
              <button
                type="button"
                onClick={() => setDaysMode('todos')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  daysMode === 'todos' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Todos los días
              </button>
              <button
                type="button"
                onClick={() => setDaysMode('elegir')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  daysMode === 'elegir' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Seleccionar días
              </button>
            </div>

            {daysMode === 'elegir' && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {WEEK_DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      selectedDays.includes(day.value)
                        ? 'bg-[#5960A1] text-white border-[#5960A1]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#5960A1]/40'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Estado</label>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 w-fit">
              <button
                type="button"
                onClick={() => setStatus('Activo')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  status === 'Activo' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Activo
              </button>
              <button
                type="button"
                onClick={() => setStatus('Inactivo')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  status === 'Inactivo' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Inactivo
              </button>
            </div>
          </div>
        </div>

        {/* Sección Receta */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h2 className="font-bold text-sm text-slate-900">Receta</h2>

          {lines.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lines.map((line) => {
                const ingredient = inventoryIngredients.find((i) => i.id === line.ingredientId);
                return (
                  <Badge key={line.ingredientId} className="inline-flex items-center gap-1.5 text-[11px] py-1">
                    {ingredient?.name ?? line.ingredientId}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(line.ingredientId)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="w-full max-w-xs border-2 border-dashed border-[#5960A1]/30 hover:border-[#5960A1] rounded-2xl p-6 flex items-center justify-center text-xs font-bold text-[#5960A1] hover:bg-[#5960A1]/5 transition cursor-pointer"
          >
            + Agregar ingrediente
          </button>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onCancel} className="px-5 py-2">
            Cancelar
          </Button>
          <Button type="button" onClick={onSubmit} className="px-5 py-2">
            Crear producto
          </Button>
        </div>
      </Card>

      <AddIngredientModal
        isOpen={isAddOpen}
        ingredients={inventoryIngredients}
        excludeIds={lines.map((line) => line.ingredientId)}
        onClose={() => setIsAddOpen(false)}
        onAdd={(line) => setLines((prev) => [...prev, line])}
      />
    </div>
  );
};