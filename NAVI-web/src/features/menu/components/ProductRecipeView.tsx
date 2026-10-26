import { useState } from 'react';
import type { MenuItem } from '../types';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

interface Props {
  product: MenuItem;
  onBack: () => void;
  onRequestSave: () => void;
}

interface RecipeIngredient {
  id: string;
  name: string;
  medAmount: string | null;
  gdeAmount: string | null;
  medCost: string | null;
  gdeCost: string | null;
  unitCost: string;
}

const initialIngredients: RecipeIngredient[] = [
  {
    id: 'ing-1',
    name: 'Leche entera',
    medAmount: '220 ml',
    gdeAmount: '300 ml',
    medCost: '$6.16',
    gdeCost: '$8.40',
    unitCost: '$0.028 / ml',
  },
  {
    id: 'ing-2',
    name: 'Base de té',
    medAmount: '10 g',
    gdeAmount: '12 g',
    medCost: '$4.50',
    gdeCost: '$5.40',
    unitCost: '$0.45 / g',
  },
  {
    id: 'ing-3',
    name: 'Oreo',
    medAmount: null,
    gdeAmount: '1 pieza',
    medCost: null,
    gdeCost: '$2.50',
    unitCost: '$2.50 / pieza',
  },
];

export const ProductRecipeView = ({ product, onBack, onRequestSave }: Props) => {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(initialIngredients);

  const handleRemove = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const handleAdd = () => {
    const name = window.prompt('Nombre del ingrediente');
    if (!name) return;
    setIngredients((prev) => [
      ...prev,
      {
        id: `ing-${Date.now()}`,
        name,
        medAmount: '0',
        gdeAmount: '0',
        medCost: '$0.00',
        gdeCost: '$0.00',
        unitCost: '$0.00',
      },
    ]);
  };

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
            <span className="text-lg font-black text-[#5960A1]">$10.66</span>
          </div>
          <div className="bg-[#5960A1]/10 rounded-2xl px-5 py-3 text-center">
            <span className="block text-[10px] font-bold text-[#5960A1]">Costo · GDE</span>
            <span className="text-lg font-black text-[#5960A1]">$16.30</span>
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
                  ing.medAmount ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                MED {ing.medAmount ?? '—'}
              </span>
              <span
                className={`border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  ing.gdeAmount ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                GDE {ing.gdeAmount ?? '—'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 pt-1">
              <span>
                MED {ing.medCost ?? '—'} · GDE {ing.gdeCost ?? '—'}
              </span>
              <span className="text-slate-400">{ing.unitCost}</span>
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
          onClick={handleAdd}
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
    </div>
  );
};