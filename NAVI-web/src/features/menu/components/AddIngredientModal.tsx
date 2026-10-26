import { useState } from 'react';
import Button from '../../../components/ui/Button';
import type { RecipeIngredient } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (ingredient: RecipeIngredient) => void;
}

export const AddIngredientModal = ({ isOpen, onClose, onAdd }: Props) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [amountMed, setAmountMed] = useState('');
  const [costMed, setCostMed] = useState('');
  const [amountGde, setAmountGde] = useState('');
  const [costGde, setCostGde] = useState('');

  if (!isOpen) return null;

  const reset = () => {
    setName('');
    setUnit('');
    setCostPerUnit('');
    setAmountMed('');
    setCostMed('');
    setAmountGde('');
    setCostGde('');
  };

  const resetAndClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !unit.trim() || !costPerUnit.trim()) return;

    onAdd({
      id: `ing-${Date.now()}`,
      name,
      unit,
      costPerUnit,
      amountMed: amountMed.trim() || undefined,
      costMed: costMed.trim() || undefined,
      amountGde: amountGde.trim() || undefined,
      costGde: costGde.trim() || undefined,
    });
    resetAndClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
      onClick={resetAndClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-base font-bold text-slate-800">Agregar ingrediente</h3>
          <p className="text-xs text-slate-400 mt-0.5">Cantidad y costo por tamaño de preparación</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Leche entera"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unidad</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="ej. ml, g, pieza"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Costo por unidad</label>
              <input
                type="text"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
                placeholder="ej. $0.028"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase">
              Cantidad por tamaño (deja en blanco si no aplica)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad MED</label>
                <input
                  type="text"
                  value={amountMed}
                  onChange={(e) => setAmountMed(e.target.value)}
                  placeholder="ej. 220"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Costo MED</label>
                <input
                  type="text"
                  value={costMed}
                  onChange={(e) => setCostMed(e.target.value)}
                  placeholder="ej. $6.16"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad GDE</label>
                <input
                  type="text"
                  value={amountGde}
                  onChange={(e) => setAmountGde(e.target.value)}
                  placeholder="ej. 300"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Costo GDE</label>
                <input
                  type="text"
                  value={costGde}
                  onChange={(e) => setCostGde(e.target.value)}
                  placeholder="ej. $8.40"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={resetAndClose} className="flex-1 py-2">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 py-2">
              Agregar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
