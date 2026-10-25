import { useState } from 'react';
import type { ProductItem } from '../types';

interface Props {
  onAddProduct: (product: ProductItem) => void;
  onOpenExtras: (product: ProductItem) => void;
}

const mockProducts: ProductItem[] = [
  { id: '1', name: 'Chai Milk Tea', category: 'Bebidas', categoryLabel: 'Té con leche', size: 'GDE', price: 85 },
  { id: '2', name: 'Taro Smoothie', category: 'Bebidas', categoryLabel: 'Smoothies', size: 'MED', price: 65 },
  { id: '3', name: 'Mango Fruit Tea', category: 'Bebidas', categoryLabel: 'Té de frutas', size: 'MED', price: 60 },
  { id: '4', name: 'Chilaquiles rojos', category: 'Cocina', categoryLabel: 'Cocina', price: 95 },
  { id: '5', name: 'Crepa de Nutella', category: 'Postres', categoryLabel: 'Postres', price: 75 },
  { id: '6', name: 'Waffle Dulce', category: 'Postres', categoryLabel: 'Postres', price: 80 },
];

export const OrderCatalog = ({ onAddProduct, onOpenExtras }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Bebidas', 'Cocina', 'Postres'];

  const filtered = selectedCategory === 'Todos'
    ? mockProducts
    : mockProducts.filter((p) => p.category === selectedCategory);

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
        {filtered.map((prod) => (
          <div key={prod.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-slate-400 font-medium">{prod.categoryLabel}</span>
                <button
                  onClick={() => onAddProduct(prod)}
                  className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition cursor-pointer text-sm font-bold"
                  title="Agregar 1 directo"
                >
                  +
                </button>
              </div>
              <h3 className="font-bold text-slate-800 text-sm mt-1">{prod.name}</h3>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {prod.size ? `${prod.size} · ` : ''}${prod.price}
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onOpenExtras(prod)}
                className="text-xs font-medium text-slate-600 hover:text-[#5960A1] bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
              >
                + Agregar extras
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Banner inferior de extras informativos */}
      <div className="bg-[#5960A1]/5 border border-[#5960A1]/15 rounded-xl p-4 text-xs text-slate-600">
        <span className="font-bold text-[#5960A1] block mb-1">Extras</span>
        Topping Oreo, perlas de tapioca o gelatina de coco · $15 c/u.
      </div>
    </div>
  );
};