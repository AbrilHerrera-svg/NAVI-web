import { useState } from 'react';
import type { ProductItem } from '../types';
import Card from '../../../components/ui/Card';

interface Props {
  products: ProductItem[];
  onAddProduct: (product: ProductItem) => void;
  onOpenExtras: (product: ProductItem) => void;
  isAvailable: (product: ProductItem) => boolean;
}

export const OrderCatalog = ({ products, onAddProduct, onOpenExtras, isAvailable }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Bebidas', 'Cocina', 'Postres'];

  const filtered = selectedCategory === 'Todos'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  // Agrupa variantes de tamaño (MED/GDE) del mismo producto en una sola tarjeta.
  const grouped: ProductItem[][] = [];
  for (const prod of filtered) {
    const group = grouped.find((g) => g[0].id === prod.id);
    if (group) group.push(prod);
    else grouped.push([prod]);
  }

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nuevo pedido</h1>
        <p className="text-sm text-slate-400 mt-1">Pedido en mostrador para clientes sin la app · Extras $15 c/u</p>
      </div>

      {/* Filtros de categoría */}
      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#5960A1] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grouped.map((variants) => {
          const first = variants[0];
          const allUnavailable = variants.every((v) => !isAvailable(v));
          return (
            <Card key={first.id} className={`shadow-xs flex flex-col justify-between ${allUnavailable ? 'opacity-60' : ''}`}>
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[11px] text-slate-400 font-medium">{first.categoryLabel}</span>
                  {allUnavailable && (
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full">
                      Agotado
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm mt-1">{first.name}</h3>
              </div>

              {/* Una fila por variante: cada bebida debe elegir MED o GDE explícitamente */}
              <div className="mt-2 space-y-2">
                {variants.map((variant) => {
                  const available = isAvailable(variant);
                  return (
                    <div
                      key={variant.size ?? 'single'}
                      className="flex items-center justify-between gap-2 border-t border-slate-50 pt-2 first:border-none first:pt-0"
                    >
                      <span className="text-xs font-semibold text-slate-600">
                        {variant.size ? `${variant.size} · ` : ''}${variant.price}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenExtras(variant)}
                          disabled={!available}
                          className="text-xs font-medium text-slate-600 hover:text-[#5960A1] bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-50 disabled:hover:text-slate-600"
                        >
                          + Extras
                        </button>
                        {available ? (
                          <button
                            onClick={() => onAddProduct(variant)}
                            className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition cursor-pointer text-sm font-bold"
                            title="Agregar 1 directo"
                          >
                            +
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-500">Agotado</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Banner inferior de extras informativos */}
      <div className="bg-[#5960A1]/5 border border-[#5960A1]/15 rounded-xl p-4 text-xs text-slate-600">
        <span className="font-bold text-[#5960A1] block mb-1">Extras</span>
        Topping Oreo, perlas de tapioca o gelatina de coco · $15 c/u.
      </div>
    </div>
  );
};