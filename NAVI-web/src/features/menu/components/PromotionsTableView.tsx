import type { PromotionItem } from '../types';

interface Props {
  promotions: PromotionItem[];
  onRequestRemove: (promo: PromotionItem) => void;
}

export const PromotionsTableView = ({ promotions, onRequestRemove }: Props) => {
  return (
    <div className="space-y-4">
      {/* Buscador superior */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative w-72">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder="pedidos / clientes / productos / reservaciones"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-transparent focus:outline-none placeholder-slate-400 text-slate-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button className="px-3 py-1 rounded-md bg-[#5960A1] text-white shadow-2xs">Activo</button>
            <button className="px-3 py-1 rounded-md hover:text-slate-900">Terminado</button>
          </div>
          <span className="text-xs text-slate-400 ml-2">{promotions.length} promociones</span>
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
              {promotions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.appliesTo}</td>
                  <td className="py-3.5 px-4">{p.discount}</td>
                  <td className="py-3.5 px-4">{p.price ? `$${p.price}` : '—'}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.schedule}</td>
                  
                  {/* Switch */}
                  <td className="py-3.5 px-4">
                    <span className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#5960A1]">
                      <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg translate-x-4" />
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.status === 'Activo'
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.status === 'Programado'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-4 text-right text-xs">
                    <button className="text-slate-600 hover:text-slate-900 font-medium mr-2">Editar</button>
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