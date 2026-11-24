import { useState } from 'react';
import type { ProductItem, SelectedItemExtra } from '../types';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useExtras } from '../../extras';

interface Props {
  product: ProductItem;
  initialExtras?: SelectedItemExtra[];
  isEditing?: boolean;
  onBack: () => void;
  onConfirm: (extras: SelectedItemExtra[]) => void;
}

export const OrderExtrasView = ({ product, initialExtras = [], isEditing = false, onBack, onConfirm }: Props) => {
  const { items: catalogo, loading } = useExtras();
  // Solo los que el staff dejó disponibles aparecen al armar un pedido.
  const availableToppings = catalogo.filter((extra) => extra.available);

  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const ex of initialExtras) initial[ex.extraId] = ex.quantity;
    return initial;
  });

  const updateCount = (id: string, delta: number) => {
    setCounts((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const totalExtras = availableToppings.reduce(
    (acc, top) => acc + (counts[top.id] || 0) * top.price,
    0
  );

  const handleSave = () => {
    const selectedExtras: SelectedItemExtra[] = availableToppings
      .filter((top) => (counts[top.id] || 0) > 0)
      .map((top) => ({
        extraId: top.id,
        name: top.name,
        price: top.price,
        quantity: counts[top.id],
      }));
    onConfirm(selectedExtras);
  };

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{isEditing ? 'Editar extras' : 'Agregar extras'}</h1>
        <p className="text-sm text-slate-400 mt-1">
          {product.name} {product.size ? `${product.size} · ` : ''}${product.price} · elige los toppings
        </p>
      </div>

      <Card className="shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="font-bold text-sm text-slate-800">Toppings extra</span>
          <span className="text-xs text-slate-400">Opcional</span>
        </div>

        {loading && <p className="text-sm text-slate-400">Cargando extras...</p>}
        {!loading && availableToppings.length === 0 && (
          <p className="text-sm text-slate-400">Todavía no hay extras disponibles.</p>
        )}

        <div className="space-y-4">
          {availableToppings.map((top) => {
            const count = counts[top.id] || 0;
            return (
              <div key={top.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-none">
                <span className="text-sm text-slate-700 font-medium">{top.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 font-semibold">${top.price}</span>
                  <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateCount(top.id, -1)}
                      className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-800 w-4 text-center">{count}</span>
                    <button
                      onClick={() => updateCount(top.id, 1)}
                      className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="font-bold text-sm text-slate-800">
            Total de extras ${totalExtras.toFixed(2)}
          </span>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onBack} className="px-4 py-2">
              Regresar al pedido
            </Button>
            <Button onClick={handleSave} className="px-5 py-2">
              {isEditing ? 'Guardar cambios' : 'Agregar al pedido'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};