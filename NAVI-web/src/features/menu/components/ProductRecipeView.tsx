import type { MenuItem } from '../types';

interface Props {
  product: MenuItem;
  onBack: () => void;
  onRequestSave: () => void;
}

export const ProductRecipeView = ({ product, onBack, onRequestSave }: Props) => {
  return (
    <div className="space-y-6">
      {/* Header específico de la receta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{product.name} · Receta</h1>
          <p className="text-xs text-slate-400 mt-0.5">Edita ingredientes y cantidades. Los cambios aplican solo a ventas futuras.</p>
        </div>
      </div>

      {/* Tarjeta de Resumen con Costos */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {product.category} · Preparación {product.prepTime} · 3 ingredientes
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-[#5960A1]/10 rounded-2xl px-5 py-3 text-center">
            <span className="block text-[10px] font-bold text-[#5960A1]">Costo · MED</span>
            <span className="text-lg font-black text-[#5960A1]">$10.66</span>
          </div>
          <div className="bg-[#5960A1]/10 rounded-2xl px-5 py-3 text-center">
            <span className="block text-[10px] font-bold text-[#5960A1]">Costo · GDE</span>
            <span className="text-lg font-black text-[#5960A1]">$16.30</span>
          </div>
        </div>
      </div>

      {/* Cuadrícula de Ingredientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Leche entera */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Leche entera</h3>
          <div className="flex gap-2">
            <span className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700">MED 220 ml</span>
            <span className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700">GDE 300 ml</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span>MED $6.16 · GDE $8.40</span>
            <span className="text-slate-400">$0.028 / ml</span>
          </div>
          <button className="text-xs text-rose-500 hover:underline font-medium cursor-pointer">
            Quitar ingrediente
          </button>
        </div>

        {/* Base de té */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Base de té</h3>
          <div className="flex gap-2">
            <span className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700">MED 10 g</span>
            <span className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700">GDE 12 g</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span>MED $4.50 · GDE $5.40</span>
            <span className="text-slate-400">$0.45 / g</span>
          </div>
          <button className="text-xs text-rose-500 hover:underline font-medium cursor-pointer">
            Quitar ingrediente
          </button>
        </div>

        {/* Oreo */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Oreo</h3>
          <div className="flex gap-2">
            <span className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-400">MED —</span>
            <span className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700">GDE 1 pieza</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 pt-1">
            <span>MED — · GDE $2.50</span>
            <span className="text-slate-400">$2.50 / pieza</span>
          </div>
          <button className="text-xs text-rose-500 hover:underline font-medium cursor-pointer">
            Quitar ingrediente
          </button>
        </div>

        {/* Botón Agregar Ingrediente */}
        <button className="border-2 border-dashed border-[#5960A1]/30 hover:border-[#5960A1] rounded-2xl p-6 flex items-center justify-center text-xs font-bold text-[#5960A1] hover:bg-[#5960A1]/5 transition cursor-pointer min-h-[140px]">
          + Agregar ingrediente
        </button>
      </div>

      {/* Botones inferiores */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={onRequestSave}
          className="px-5 py-2 bg-[#5960A1] hover:bg-[#484e85] text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};