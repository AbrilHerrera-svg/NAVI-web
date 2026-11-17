import { useState } from 'react';
import Button from '../../../components/ui/Button';
import type { OrderPaymentMethod } from '../types';

interface Props {
  isOpen: boolean;
  orderNumber?: string;
  total: number;
  onClose: () => void;
  onConfirm: (method: OrderPaymentMethod) => void;
}

const methods: OrderPaymentMethod[] = ['Efectivo', 'Terminal de tarjeta', 'Transferencia'];

// Pide el método de pago (obligatorio para cobrar) y, en efectivo, exige un monto
// recibido igual o mayor al total antes de dejar confirmar; muestra el cambio.
export const OrderChargeModal = ({ isOpen, orderNumber, total, onClose, onConfirm }: Props) => {
  const [method, setMethod] = useState<OrderPaymentMethod>('Efectivo');
  const [receivedAmount, setReceivedAmount] = useState(total.toFixed(2));

  if (!isOpen) return null;

  const receivedNum = parseFloat(receivedAmount) || 0;
  const change = Math.max(0, receivedNum - total);
  const insufficientCash = method === 'Efectivo' && receivedNum < total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-base font-bold text-slate-800">Cobrar {orderNumber}</h3>
          <p className="text-xs text-slate-500 mt-1">Total a cobrar: ${total.toFixed(2)}</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Método de pago</label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {methods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`py-1.5 text-[11px] font-semibold rounded-md transition text-center cursor-pointer ${
                  method === m ? 'bg-[#5960A1] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m === 'Terminal de tarjeta' ? 'Terminal' : m}
              </button>
            ))}
          </div>
        </div>

        {method === 'Efectivo' && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Monto recibido</label>
            <input
              type="text"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 ${
                insufficientCash ? 'border-rose-300 focus:ring-rose-400' : 'border-slate-200 focus:ring-[#5960A1]'
              }`}
            />
            {insufficientCash ? (
              <p className="text-[11px] text-rose-500">El monto recibido no puede ser menor al total.</p>
            ) : (
              <div className="flex justify-between text-xs pt-1">
                <span className="text-slate-500 font-medium">Cambio</span>
                <span className="font-bold text-slate-900">${change.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 w-full pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1 py-2 px-3">
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={() => onConfirm(method)}
            disabled={insufficientCash}
            className="flex-1 py-2 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirmar cobro
          </Button>
        </div>
      </div>
    </div>
  );
};
