import type { MenuItem } from '../types';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

interface Props {
  items: MenuItem[];
  onOpenRecipe: (item: MenuItem) => void;
}

export const MenuCardsView = ({ items, onOpenRecipe }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((prod) => (
        <Card key={prod.id} className="rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-bold text-sm text-slate-900">{prod.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{prod.category}</p>
            </div>
            <Badge
              color={
                prod.status === 'Activo'
                  ? 'success'
                  : prod.status === 'Inactivo'
                  ? 'danger'
                  : 'brand'
              }
            >
              {prod.status}
            </Badge>
          </div>

          {/* Badges de Precios por tamaño */}
          <div className="flex gap-2">
            {prod.priceMed && (
              <span className="bg-[#5960A1]/10 text-[#5960A1] font-bold text-xs px-2.5 py-1 rounded-lg">
                MED ${prod.priceMed}
              </span>
            )}
            {prod.priceGde && (
              <span className="bg-[#5960A1]/10 text-[#5960A1] font-bold text-xs px-2.5 py-1 rounded-lg">
                GDE ${prod.priceGde}
              </span>
            )}
            {prod.priceSingle && (
              <span className="bg-[#5960A1]/10 text-[#5960A1] font-bold text-xs px-2.5 py-1 rounded-lg">
                Precio ${prod.priceSingle}
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Prep. {prod.prepTime}</span>
            <button
              onClick={() => onOpenRecipe(prod)}
              className="text-slate-600 hover:text-[#5960A1] font-semibold cursor-pointer"
            >
              Acciones ▾
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};