import type { InventoryTab } from '../types';

interface Props {
  currentTab: InventoryTab;
  onChangeTab: (tab: InventoryTab) => void;
}

export const InventoryTabs = ({ currentTab, onChangeTab }: Props) => {
  return (
    <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
      <button
        onClick={() => onChangeTab('ingredientes')}
        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
          currentTab === 'ingredientes' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
        }`}
      >
        Ingredientes
      </button>
      <button
        onClick={() => onChangeTab('movimientos')}
        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
          currentTab === 'movimientos' ? 'bg-[#5960A1] text-white shadow-xs' : 'hover:text-slate-900'
        }`}
      >
        Movimientos
      </button>
    </div>
  );
};
