import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { AddIngredientModal } from './AddIngredientModal';
import type { RecipeIngredient } from '../types';

interface Props {
  onCancel: () => void;
  onSubmit: () => void;
}

export const NewProductForm = ({ onCancel, onSubmit }: Props) => {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
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
            <input
              type="text"
              placeholder="ej. Té con leche"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Precio · MED</label>
            <input
              type="text"
              defaultValue="$0.00"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Precio · GDE</label>
            <input
              type="text"
              defaultValue="$0.00"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tiempo de prep.</label>
            <input
              type="text"
              placeholder="ej. 5 min"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Días disponibles</label>
            <input
              type="text"
              placeholder="ej. Todos los días"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Estado</label>
            <div className="px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 font-medium">
              Activo
            </div>
          </div>
        </div>

        {/* Sección Receta */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h2 className="font-bold text-sm text-slate-900">Receta</h2>

          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing) => (
                <Badge key={ing.id} className="inline-flex items-center gap-1.5 text-[11px] py-1">
                  {ing.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.id)}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    ×
                  </button>
                </Badge>
              ))}
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
        onClose={() => setIsAddOpen(false)}
        onAdd={(ing) => setIngredients((prev) => [...prev, ing])}
      />
    </div>
  );
};