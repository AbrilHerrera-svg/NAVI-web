import { useState } from 'react';
import type { MenuItem } from '../types';
import Badge from '../../../components/ui/Badge';

interface Props {
  items: MenuItem[];
  onToggleAvailable: (id: string) => void;
  onRequestArchive: (item: MenuItem) => void;
  onUnarchive: (item: MenuItem) => void;
  onOpenRecipe: (item: MenuItem) => void;
}

export const MenuTableView = ({
  items,
  onToggleAvailable,
  onRequestArchive,
  onUnarchive,
  onOpenRecipe,
}: Props) => {
  const [filterState, setFilterState] = useState<'Activo' | 'Archivado'>('Activo');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    const matchesTab = filterState === 'Activo' ? item.status !== 'Archivado' : item.status === 'Archivado';
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filtros superiores */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o categoría"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-transparent focus:outline-none placeholder-slate-400 text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterState('Activo')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                filterState === 'Activo' ? 'bg-[#5960A1] text-white shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Activo
            </button>
            <button
              onClick={() => setFilterState('Archivado')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                filterState === 'Archivado' ? 'bg-[#5960A1] text-white shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Archivado
            </button>
          </div>
          <span className="text-xs text-slate-400 ml-2">{filtered.length} productos</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-visible shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">MED</th>
                <th className="py-3 px-4">GDE</th>
                <th className="py-3 px-4">Tiempo de prep.</th>
                <th className="py-3 px-4">Disponible</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                  <td className="py-3.5 px-4">{item.priceMed ? `$${item.priceMed}` : '—'}</td>
                  <td className="py-3.5 px-4">{item.priceGde ? `$${item.priceGde}` : item.priceSingle ? `$${item.priceSingle}` : '—'}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.prepTime}</td>
                  
                  {/* Switch Disponibilidad */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      disabled={item.status === 'Archivado'}
                      onClick={() => onToggleAvailable(item.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        item.status === 'Archivado' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                      } ${item.available ? 'bg-[#5960A1]' : 'bg-slate-300'}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          item.available ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Estado Badge */}
                  <td className="py-3.5 px-4">
                    <Badge
                      color={
                        item.status === 'Activo'
                          ? 'success'
                          : item.status === 'Inactivo'
                          ? 'danger'
                          : 'brand'
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>

                  {/* Dropdown Acciones */}
                  <td className="py-3.5 px-4 text-right relative">
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                      className="text-slate-500 hover:text-slate-800 font-medium text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      Acciones ▾
                    </button>

                    {openDropdownId === item.id && (
                      <div className="absolute right-4 mt-2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1.5 z-20 text-left text-xs font-medium">
                        <button
                          onClick={() => {
                            setOpenDropdownId(null);
                            onOpenRecipe(item);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 text-slate-700 text-left"
                        >
                          Ver receta
                        </button>
                        {item.status === 'Archivado' ? (
                          <button
                            onClick={() => {
                              setOpenDropdownId(null);
                              onUnarchive(item);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-slate-50 text-emerald-600 text-left"
                          >
                            Desarchivar
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setOpenDropdownId(null);
                              onRequestArchive(item);
                            }}
                            className="w-full px-3 py-1.5 hover:bg-slate-50 text-rose-600 text-left"
                          >
                            Archivar
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mensajes informativos inferiores */}
      <div className="bg-[#5960A1]/10 rounded-xl p-3 text-xs text-[#5960A1] font-medium">
        Las pastas y el Boneless solo están disponibles de viernes a domingo. Extras: $15 c/u.
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-400">
        Los artículos archivados se conservan en el historial y no aparecen en Nuevo pedido. Usa el filtro Archivado para revisarlos.
      </div>
    </div>
  );
};