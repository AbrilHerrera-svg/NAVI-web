import Button from '../../../components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const OrderConfirmModal = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div 
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-slate-800">¿Confirmar este pedido?</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          El pedido se enviará a preparación y el total se registrará en Caja.
        </p>

        <div className="flex gap-3 w-full pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1 py-2 px-3">
            Regresar al pedido
          </Button>
          <Button variant="success" onClick={onConfirm} className="flex-1 py-2 px-3">
            Sí, confirmar pedido
          </Button>
        </div>
      </div>
    </div>
  );
};