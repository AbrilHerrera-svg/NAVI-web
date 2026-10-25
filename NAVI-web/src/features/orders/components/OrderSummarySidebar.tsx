import { useState } from 'react';
import { CartItem } from '../types';

interface Props {
  cart: CartItem[];
  onRequestConfirm: () => void;
}

export const OrderSummarySidebar = ({ cart, onRequestConfirm }: Props) => {
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Terminal de tarjeta' | 'Transferencia'>('Efectivo');
  const [receivedAmount, setReceivedAmount] = useState<string>('200.00');

  const productsTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  const extrasTotal = cart.reduce((acc, item) => {
    const itemExtras = item.extras.reduce((eAcc, e) => eAcc + e.price * e.quantity, 0);
    return acc + itemExtras * item.quantity;
  }, 0);

  const grandTotal = productsTotal + extrasTotal;
  const receivedNum = parseFloat(receivedAmount) || 0;
  const change = Math.max(0, receivedNum - grandTotal);

  return (
    <aside className="w-full lg:w-96 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between shrink-0 h-fit space-y-6">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
          <h2 className="font-bold text-sm text-slate-800">Resumen del pedido</h2>
          <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
            Mostrador
          </span>
        </div>

        {/* Lista de productos en el carrito */}
        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No hay productos agregados</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>
                    {item.quantity} × {item.product.name} {item.product.size || ''}
                  </span>
                  <span className="font-bold text-slate-900">${item.product.price * item.quantity}</span>
                </div>
                {item.extras.map((ex, eIdx) => (
                  <div key={eIdx} className="flex justify-between text-[11px] text-[#5960A1] pl-3">
                    <span>+ {ex.name} ×{ex.quantity}</span>
                    <span>${ex.price * ex.quantity}</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Totales */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Productos</span>
            <span>${productsTotal}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Extras</span>
            <span>${extrasTotal}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-50">
            <span>Total</span>
            <span className="text-[#5960A1]">${grandTotal}</span>
          </div>
        </div>

        {/* Método de pago */}
        <div className="mt-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">Método de pago</label>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
            {(['Efectivo', 'Terminal de tarjeta', 'Transferencia'] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-1.5 text-[11px] font-semibold rounded-md transition text-center cursor-pointer ${
                  paymentMethod === method
                    ? 'bg-[#5960A1] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {method === 'Terminal de tarjeta' ? 'Terminal' : method}
              </button>
            ))}
          </div>
        </div>

        {/* Monto recibido & cambio (sólo en Efectivo) */}
        {paymentMethod === 'Efectivo' && (
          <div className="mt-4 space-y-2">
            <label className="block text-xs font-bold text-slate-700">Monto recibido</label>
            <input
              type="text"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#5960A1]"
            />
            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Cambiar</span>
              <span className="font-bold text-slate-900">${change.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onRequestConfirm}
        disabled={cart.length === 0}
        className="w-full py-3 bg-[#5960A1] hover:bg-[#484e85] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition shadow-xs cursor-pointer mt-4"
      >
        Confirmar pedido
      </button>
    </aside>
  );
};