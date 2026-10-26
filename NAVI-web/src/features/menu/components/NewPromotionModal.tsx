import { useState } from 'react';
import Button from '../../../components/ui/Button';
import type { PromotionItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (promo: PromotionItem) => void;
}

export const NewPromotionModal = ({ isOpen, onClose, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [appliesTo, setAppliesTo] = useState('');
  const [discount, setDiscount] = useState('');
  const [schedule, setSchedule] = useState('');
  const [status, setStatus] = useState<'Activo' | 'Programado'>('Activo');

  if (!isOpen) return null;

  const resetAndClose = () => {
    setName('');
    setAppliesTo('');
    setDiscount('');
    setSchedule('');
    setStatus('Activo');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !appliesTo.trim() || !discount.trim() || !schedule.trim()) return;

    onCreate({
      id: `p-${Date.now()}`,
      name,
      appliesTo,
      discount,
      schedule,
      status,
      active: true,
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
          <h3 className="text-base font-bold text-slate-800">Nueva promoción</h3>
          <p className="text-xs text-slate-400 mt-0.5">Crea un descuento u oferta para el menú</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Happy hour · 2×1"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Aplica a</label>
            <input
              type="text"
              value={appliesTo}
              onChange={(e) => setAppliesTo(e.target.value)}
              placeholder="ej. Té con leche MED"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Descuento</label>
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="ej. 10%"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Activo' | 'Programado')}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
              >
                <option value="Activo">Activo</option>
                <option value="Programado">Programado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Horario</label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="ej. Lun–Vie 3–5 p. m."
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={resetAndClose} className="flex-1 py-2">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 py-2">
              Crear promoción
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
