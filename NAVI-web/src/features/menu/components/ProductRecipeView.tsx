import { useState } from 'react';
import type { MenuItem, RecipeIngredient } from '../types';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { AddIngredientModal } from './AddIngredientModal';

interface Props {
  product: MenuItem;
  onBack: () => void;
  onRequestSave: () => void;
}

const initialIngredients: RecipeIngredient[] = [
  {
    id: 'ing-1',
    name: 'Leche entera',
    unit: 'ml',
    costPerUnit: '$0.028',
    amountMed: '220',
    costMed: '$6.16',
    amountGde: '300',
    costGde: '$8.40',
  },
  {
    id: 'ing-2',
    name: 'Base de té',
    unit: 'g',
    costPerUnit: '$0.45',
    amountMed: '10',
    costMed: '$4.50',
    amountGde: '12',
    costGde: '$5.40',
  },
  {
    id: 'ing-3',
    name: 'Oreo',
    unit: 'pieza',
    costPerUnit: '$2.50',
    amountGde: '1',
    costGde: '$2.50',
  },
];

const parseCost = (cost?: string) => (cost ? parseFloat(cost.replace(/[^0-9.]/g, '')) || 0 : 0);

export const ProductRecipeView = ({ product, onBack, onRequestSave }: Props) => {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(initialIngredients);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleRemove = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const costMedTotal = ingredients.reduce((acc, ing) => acc + parseCost(ing.costMed), 0);
  const costGdeTotal = ingredients.reduce((acc, ing) => acc + parseCost(ing.costGde), 0);

  return (
    <div className="space-y-6">
      {/* Header específico de la receta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{product.name} · Receta</h1>
          <p className="text-xs text-slate-400 mt-0.5">Edita ingredientes y cantidades. Los cambios aplican solo a ventas futuras.</p>
        </div>
      </div>

      {/* Tarjeta de Resumen con Costos */}
      <Card className="rounded-2xl shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {product.category} · Preparación {product.prepTime} · {ingredients.length} ingredientes
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-[#5960A1]/10 rounded-2xl px-5 py-3 text-center">
            <span className="block text-[10px] font-bold text-[#5960A1]">Costo · MED</span>
            <span className="text-lg font-black text-[#5960A1]">${costMedTotal.toFixed(2)}</span>
          </div>
          <div className="bg-[#5960A1]/10 rounded-2xl px-5 py-3 text-center">
            <span className="block text-[10px] font-bold text-[#5960A1]">Costo · GDE</span>
            <span className="text-lg font-black text-[#5960A1]">${costGdeTotal.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Cuadrícula de Ingredientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ingredients.map((ing) => (
          <Card key={ing.id} className="rounded-2xl shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">{ing.name}</h3>
            <div className="flex gap-2">
              <span
                className={`border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  ing.amountMed ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                MED {ing.amountMed ? `${ing.amountMed} ${ing.unit}` : '—'}
              </span>
              <span
                className={`border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  ing.amountGde ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                GDE {ing.amountGde ? `${ing.amountGde} ${ing.unit}` : '—'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 pt-1">
              <span>
                MED {ing.costMed ?? '—'} · GDE {ing.costGde ?? '—'}
              </span>
              <span className="text-slate-400">
                {ing.costPerUnit} / {ing.unit}
              </span>
            </div>
            <button
              onClick={() => handleRemove(ing.id)}
              className="text-xs text-rose-500 hover:underline font-medium cursor-pointer"
            >
              Quitar ingrediente
            </button>
          </Card>
        ))}

        {/* Botón Agregar Ingrediente */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="border-2 border-dashed border-[#5960A1]/30 hover:border-[#5960A1] rounded-2xl p-6 flex items-center justify-center text-xs font-bold text-[#5960A1] hover:bg-[#5960A1]/5 transition cursor-pointer min-h-[140px]"
        >
          + Agregar ingrediente
        </button>
      </div>

      {/* Botones inferiores */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onBack} className="px-5 py-2">
          Cancelar
        </Button>
        <Button onClick={onRequestSave} className="px-5 py-2">
          Guardar cambios
        </Button>
      </div>

      <AddIngredientModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={(ing) => setIngredients((prev) => [...prev, ing])}
      />
    </div>
  );
};
