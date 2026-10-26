import { useState } from 'react';
import type { MenuItem } from '../types';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { AddIngredientModal } from './AddIngredientModal';
import { amountToBoxes, mockRecipesByProductId, useInventory, type RecipeLine } from '../../inventory';

interface Props {
  product: MenuItem;
  onBack: () => void;
  onRequestSave: () => void;
}

export const ProductRecipeView = ({ product, onBack, onRequestSave }: Props) => {
  const { ingredients: inventoryIngredients } = useInventory();
  // La receta se precarga del catálogo compartido con Inventario (por id de producto);
  // los cambios aquí son locales a la sesión hasta que se guarde (ver onRequestSave).
  const [lines, setLines] = useState<RecipeLine[]>(mockRecipesByProductId[product.id] ?? []);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleRemove = (ingredientId: string) => {
    setLines((prev) => prev.filter((line) => line.ingredientId !== ingredientId));
  };

  // Cada línea de receta apunta a un ingrediente real de Inventario; de ahí se derivan
  // nombre, unidad y costo en vez de volver a capturarlos.
  const rows = lines
    .map((line) => {
      const ingredient = inventoryIngredients.find((i) => i.id === line.ingredientId);
      if (!ingredient) return null;
      const costPerUnit = ingredient.costPerBox / ingredient.unitsPerBox;
      return {
        line,
        ingredient,
        costMed: line.amountMed ? line.amountMed * costPerUnit : undefined,
        costGde: line.amountGde ? line.amountGde * costPerUnit : undefined,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const costMedTotal = rows.reduce((acc, row) => acc + (row.costMed ?? 0), 0);
  const costGdeTotal = rows.reduce((acc, row) => acc + (row.costGde ?? 0), 0);

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
            {product.category} · Preparación {product.prepTime} · {rows.length} ingredientes
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
        {rows.map(({ line, ingredient, costMed, costGde }) => (
          <Card key={ingredient.id} className="rounded-2xl shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">{ingredient.name}</h3>
            <div className="flex gap-2">
              <span
                className={`border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  line.amountMed ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                MED {line.amountMed ? `${line.amountMed} ${ingredient.unit}` : '—'}
              </span>
              <span
                className={`border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  line.amountGde ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                GDE {line.amountGde ? `${line.amountGde} ${ingredient.unit}` : '—'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 pt-1">
              <span>
                MED {costMed !== undefined ? `$${costMed.toFixed(2)}` : '—'} · GDE{' '}
                {costGde !== undefined ? `$${costGde.toFixed(2)}` : '—'}
              </span>
              <span className="text-slate-400">
                ${(ingredient.costPerBox / ingredient.unitsPerBox).toFixed(3)} / {ingredient.unit}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {line.amountGde ? `${amountToBoxes(ingredient, line.amountGde)} cajas por GDE vendida` : ''}
              {line.amountGde && line.amountMed ? ' · ' : ''}
              {line.amountMed ? `${amountToBoxes(ingredient, line.amountMed)} cajas por MED vendida` : ''}
            </p>
            <button
              onClick={() => handleRemove(ingredient.id)}
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
        ingredients={inventoryIngredients}
        excludeIds={lines.map((line) => line.ingredientId)}
        onClose={() => setIsAddOpen(false)}
        onAdd={(line) => setLines((prev) => [...prev, line])}
      />
    </div>
  );
};
