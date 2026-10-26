import { useState } from 'react';
import { Search } from 'lucide-react';
import type { PromotionItem } from '../types';
import Badge from '../../../components/ui/Badge';

interface Props {
  promotions: PromotionItem[];
  onRequestRemove: (promo: PromotionItem) => void;
  onToggleActive: (promo: PromotionItem) => void;
  onEdit: (promo: PromotionItem) => void;
}

export const PromotionsTableView = ({
  promotions,
  onRequestRemove,
  onToggleActive,
  onEdit,
}: Props) => {
  const [tab, setTab] = useState<'Activo' | 'Terminado'>('Activo');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = promotions.filter((p) => {
    const matchesTab = tab === 'Activo' ? p.status !== 'Terminado' : p.status === 'Terminado';
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Buscador superior */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre de promoción"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-transparent focus:outline-none placeholder-slate-400 text-slate-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setTab('Activo')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                tab === 'Activo' ? 'bg-[#5960A1] text-white shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Activo
            </button>
            <button
              onClick={() => setTab('Terminado')}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                tab === 'Terminado' ? 'bg-[#5960A1] text-white shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Terminado
            </button>
          </div>
          <span className="text-xs text-slate-400 ml-2">{filtered.length} promociones</span>
        </div>
      </div>

      {/* Tabla de Promociones */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Promoción</th>
                <th className="py-3 px-4">Aplica a</th>
                <th className="py-3 px-4">Descuento</th>
                <th className="py-3 px-4">Precio</th>
                <th className="py-3 px-4">Horario</th>
                <th className="py-3 px-4">Termina</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.appliesTo}</td>
                  <td className="py-3.5 px-4">{p.discount}</td>
                  <td className="py-3.5 px-4">{p.price ? `$${p.price}` : '—'}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.schedule}</td>

                  {/* Switch */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleActive(p)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        p.active ? 'bg-[#5960A1]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                          p.active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4">
                    <Badge
                      color={
                        p.status === 'Activo'
                          ? 'success'
                          : p.status === 'Programado'
                          ? 'info'
                          : 'neutral'
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-right text-xs">
                    <button
                      onClick={() => onEdit(p)}
                      className="text-slate-600 hover:text-slate-900 font-medium mr-2 cursor-pointer"
                    >
                      Editar
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      onClick={() => onRequestRemove(p)}
                      className="text-slate-600 hover:text-rose-600 font-medium ml-2 cursor-pointer"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};