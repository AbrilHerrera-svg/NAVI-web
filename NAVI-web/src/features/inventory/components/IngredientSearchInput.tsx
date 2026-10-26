import { useState } from 'react';
import { formatBoxes, type InventoryIngredient } from '../types';

interface Props {
  ingredients: InventoryIngredient[];
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (ingredient: InventoryIngredient) => void;
}

export const IngredientSearchInput = ({ ingredients, query, onQueryChange, onSelect }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const matches = ingredients.filter((i) =>
    i.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        placeholder="Busca un ingrediente, ej. Leche entera"
        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
      />

      {isOpen && matches.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-white rounded-lg shadow-xl border border-slate-100 py-1.5 z-20 text-left text-xs font-medium">
          {matches.map((ingredient) => (
            <button
              key={ingredient.id}
              type="button"
              // onMouseDown evita que el input pierda el foco antes de registrar la selección
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(ingredient);
                setIsOpen(false);
              }}
              className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-left flex justify-between cursor-pointer"
            >
              <span>{ingredient.name}</span>
              <span className="text-slate-400">{formatBoxes(ingredient.stock)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
