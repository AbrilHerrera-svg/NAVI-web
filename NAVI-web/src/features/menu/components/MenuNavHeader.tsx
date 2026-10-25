import type { MenuTab } from '../types';

interface Props {
  currentTab: MenuTab;
  onChangeTab: (tab: MenuTab) => void;
  onOpenNewProduct: () => void;
  title?: string;
  subtitle?: string;
}

export const MenuNavHeader = ({
  currentTab,
  onChangeTab,
  onOpenNewProduct,
  title = 'Menú',
  subtitle = 'Precios, tamaños y disponibilidad',
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => onChangeTab('lista')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              currentTab === 'lista' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => onChangeTab('tarjetas')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              currentTab === 'tarjetas' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Tarjetas
          </button>
          <button
            onClick={() => onChangeTab('promociones')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              currentTab === 'promociones' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Promociones
          </button>
        </div>

        {currentTab === 'promociones' ? (
          <button
            onClick={() => alert('Nueva promoción')}
            className="px-4 py-2 bg-[#5960A1] hover:bg-[#484e85] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            Nueva promoción
          </button>
        ) : (
          <button
            onClick={onOpenNewProduct}
            className="px-4 py-2 bg-[#5960A1] hover:bg-[#484e85] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            Agregar producto
          </button>
        )}
      </div>
    </div>
  );
};