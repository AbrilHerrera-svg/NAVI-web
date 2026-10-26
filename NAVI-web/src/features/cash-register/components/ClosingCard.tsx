import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import type { ClosingSummary, ClosingInputs } from '../types';

interface Props {
  summary: ClosingSummary;
  inputs: ClosingInputs;
  initialReason: string;
  dateLabel: string;
  onCloseDay?: () => void;
}

export const ClosingCard = ({ summary, inputs, initialReason, dateLabel, onCloseDay }: Props) => {
  const [cashCounted, setCashCounted] = useState(inputs.cashCounted.toFixed(2));
  const [terminalCounted, setTerminalCounted] = useState(inputs.terminalCounted.toFixed(2));
  const [transferCounted, setTransferCounted] = useState(inputs.transferCounted.toFixed(2));
  const [reason, setReason] = useState(initialReason);

  const countedFunds =
    (parseFloat(cashCounted) || 0) +
    (parseFloat(terminalCounted) || 0) +
    (parseFloat(transferCounted) || 0);
  const expectedFunds = summary.systemSalesTotal + summary.initialFund;
  const difference = countedFunds - expectedFunds;
  const hasDifference = Math.abs(difference) > 0.001;
  const canClose = !hasDifference || reason.trim().length > 0;

  return (
    <Card className="shadow-xs space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-sm text-slate-800">Cierre</h3>
        {hasDifference && <Badge color="danger">Revisar diferencia</Badge>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Efectivo contado</label>
          <input
            type="text"
            value={cashCounted}
            onChange={(e) => setCashCounted(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Total de terminal</label>
          <input
            type="text"
            value={terminalCounted}
            onChange={(e) => setTerminalCounted(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Total de transferencias</label>
          <input
            type="text"
            value={transferCounted}
            onChange={(e) => setTransferCounted(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#5960A1]"
          />
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Total de ventas del sistema</span>
          <span>${summary.systemSalesTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Fondo inicial (excluido de las ventas)</span>
          <span>${summary.initialFund.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Fondos esperados incl. fondo inicial</span>
          <span>${expectedFunds.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Fondos contados incl. fondo inicial</span>
          <span>${countedFunds.toFixed(2)}</span>
        </div>
        <div
          className={`flex justify-between font-bold pt-1.5 border-t border-slate-100 ${
            hasDifference ? 'text-rose-600' : 'text-emerald-600'
          }`}
        >
          <span>Diferencia</span>
          <span>
            {difference >= 0 ? '+' : '-'}${Math.abs(difference).toFixed(2)}
          </span>
        </div>
      </div>

      {hasDifference && (
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-rose-600">
            Motivo de la diferencia · Obligatorio
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-rose-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
          <p className="text-[11px] text-rose-500">
            Se requiere un motivo siempre que el efectivo contado no coincida.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">{dateLabel}</span>
        <Button onClick={onCloseDay} disabled={!canClose} className="disabled:opacity-40 disabled:cursor-not-allowed">
          Cerrar día
        </Button>
      </div>
    </Card>
  );
};
