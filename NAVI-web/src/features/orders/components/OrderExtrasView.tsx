import { useState } from 'react';
import { ProductItem, SelectedItemExtra } from '../types';

interface Props {
  product: ProductItem;
  onBack: () => void;
  onConfirm: (extras: SelectedItemExtra[]) => void;
}

const availableToppings = [
  { id: 'top-1', name: 'Topping Oreo', price: 15 },
  { id: 'top-2', name: 'Perlas de tapioca', price: 15 },
  { id: 'top-3', name: 'Gelatina de coco', price: 15 },
];

export const OrderExtrasView = ({ product, onBack, onConfirm }: Props) => {
  const [counts, setCounts] = useState<Record<string, number>>({});

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
        <h1 className="text-2xl font-bold text-slate-900">Agregar extras</h1>
        <p className="text-sm text-slate-400 mt-1">
          {product.name} {product.size ? `${product.size} · ` : ''}${product.price} · choose toppings
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="font-bold text-sm text-slate-800">Toppings extra · $15 c/u</span>
          <span className="text-xs text-slate-400">Opcional</span>
        </div>

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
            <button
              onClick={onBack}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Regresar al pedido
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#5960A1] hover:bg-[#484e85] text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Agregar al pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};