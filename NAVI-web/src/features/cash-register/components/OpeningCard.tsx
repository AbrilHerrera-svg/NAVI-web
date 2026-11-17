import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import type { CashOpeningInfo } from '../types';
import type { OpenDayResult } from '../context/useCashRegister';

interface Props {
  opening: CashOpeningInfo;
  previousCloseAmount: number;
  openedBy: string;
  onOpenDay: (initialFund: number) => OpenDayResult;
}

export const OpeningCard = ({ opening, previousCloseAmount, openedBy, onOpenDay }: Props) => {
  const [initialFund, setInitialFund] = useState(previousCloseAmount.toFixed(2));
  const [error, setError] = useState<string | null>(null);

  if (opening.status === 'Abierto') {
    return (
      <Card className="shadow-xs">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-sm text-slate-800">Apertura</h3>
          <Badge color="success">{opening.status}</Badge>
        </div>

        <p className="text-3xl font-black text-slate-900">${opening.initialFund}</p>
        <p className="text-xs text-slate-400 mt-1">{opening.openedAtLabel}</p>

        <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Abierto por</span>
          <span className="font-semibold text-slate-800">{opening.openedBy}</span>
        </div>
      </Card>
    );
  }

  const handleOpen = () => {
    const result = onOpenDay(parseFloat(initialFund) || 0);
    setError(result.ok ? null : result.reason ?? 'No se pudo abrir la caja.');
  };

  return (
    <Card className="shadow-xs">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-sm text-slate-800">Apertura</h3>
        <Badge color="neutral">{opening.status}</Badge>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        El fondo inicial debe coincidir con el cierre anterior (${previousCloseAmount.toFixed(2)}).
      </p>

      <label className="block text-xs font-bold text-slate-700 mb-1">Fondo inicial de efectivo</label>
      <input
        type="text"
        value={initialFund}
        onChange={(e) => setInitialFund(e.target.value)}
        className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-1 ${
          error ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-[#5960A1]'
        }`}
      />
      {error && <p className="text-[11px] text-rose-500 mt-1.5">{error}</p>}

      <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">Abre {openedBy}</span>
        <Button onClick={handleOpen} className="px-4 py-1.5">
          Abrir caja
        </Button>
      </div>
    </Card>
  );
};
