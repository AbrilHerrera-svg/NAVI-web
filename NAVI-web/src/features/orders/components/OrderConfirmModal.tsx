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
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            Regresar al pedido
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            Sí, confirmar pedido
          </button>
        </div>
      </div>
    </div>
  );
};