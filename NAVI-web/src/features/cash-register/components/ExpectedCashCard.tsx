import Card from '../../../components/ui/Card';
import type { ExpectedCashInfo } from '../types';

interface Props {
  expected: ExpectedCashInfo;
}

export const ExpectedCashCard = ({ expected }: Props) => {
  return (
    <Card className="shadow-xs">
      <h3 className="font-bold text-sm text-slate-800 mb-3">Esperado en caja</h3>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-500">
          <span>Fondo inicial</span>
          <span>${expected.initialFund}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Ventas en efectivo · neto de reembolsos</span>
          <span>${expected.netCashSales}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
          <span>Efectivo esperado</span>
          <span>${expected.expectedCash}</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-3">{expected.note}</p>
    </Card>
  );
};
