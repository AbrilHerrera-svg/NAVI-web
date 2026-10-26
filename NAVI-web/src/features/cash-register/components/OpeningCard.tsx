import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import type { CashOpeningInfo } from '../types';

interface Props {
  opening: CashOpeningInfo;
}

export const OpeningCard = ({ opening }: Props) => {
  return (
    <Card className="shadow-xs">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-sm text-slate-800">Apertura</h3>
        <Badge color={opening.status === 'Abierto' ? 'success' : 'neutral'}>
          {opening.status}
        </Badge>
      </div>

      <p className="text-3xl font-black text-slate-900">${opening.initialFund}</p>
      <p className="text-xs text-slate-400 mt-1">{opening.openedAtLabel}</p>

      <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">Abierto por</span>
        <span className="font-semibold text-slate-800">{opening.openedBy}</span>
      </div>
    </Card>
  );
};
