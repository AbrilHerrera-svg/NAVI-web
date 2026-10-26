import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import type { OrderExceptionItem } from '../types';

interface Props {
  exceptions: OrderExceptionItem[];
  onResolve: (id: string) => void;
}

export const OrdersExceptionsView = ({ exceptions, onResolve }: Props) => {
  const handleResolve = (id: string, actionLabel: string) => {
    alert(`"${actionLabel}" aplicado — excepción resuelta`);
    onResolve(id);
  };

  if (exceptions.length === 0) {
    return (
      <div className="text-center text-sm text-slate-400 py-12">
        No hay excepciones pendientes.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {exceptions.map((item) => (
        <Card key={item.id} className="shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-sm text-slate-900">{item.type}</h2>
              <Badge
                color={
                  item.tagColor === 'danger' ? 'danger' : item.tagColor === 'ready' ? 'success' : 'info'
                }
              >
                {item.tag}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-slate-700">{item.orderRef}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">{item.metaLabel}</span>
              <span className="font-bold text-slate-900">{item.metaValue}</span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleResolve(item.id, item.primaryAction)}
                className="px-3 py-1.5 shadow-2xs"
              >
                {item.primaryAction}
              </Button>
              {item.secondaryAction && (
                <Button
                  variant="secondary"
                  onClick={() => handleResolve(item.id, item.secondaryAction!)}
                  className="px-3 py-1.5"
                >
                  {item.secondaryAction}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
