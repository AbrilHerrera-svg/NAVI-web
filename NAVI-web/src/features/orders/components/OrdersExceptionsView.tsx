import type { OrderExceptionItem } from '../types';

const exceptionCards: OrderExceptionItem[] = [
  {
    id: 'e-1',
    type: 'Producto agotado',
    tag: 'Existencias 0',
    tagColor: 'danger',
    orderRef: '#98 · Taro Smoothie MED · Mostrador',
    description:
      'Se agotó un insumo mientras se armaba el pedido. Aún no se cobra; el artículo no puede enviarse a preparación.',
    metaLabel: 'Total actual',
    metaValue: '$65',
    primaryAction: 'Cambiar producto',
    secondaryAction: 'Quitar del pedido',
  },
  {
    id: 'e-2',
    type: 'Pago rechazado',
    tag: 'No cobrado',
    tagColor: 'danger',
    orderRef: '#91 · Biscoff Smoothie MED · App',
    description:
      'El banco rechazó el cargo. No se registró pago ni reembolso. Mantén el pedido mientras eliges otro método.',
    metaLabel: 'Pago pendiente',
    metaValue: '$75',
    primaryAction: 'Reintentar',
    secondaryAction: 'Cambiar método',
  },
  {
    id: 'e-3',
    type: 'No recogido',
    tag: 'Listo',
    tagColor: 'ready',
    orderRef: '#92 · Mango Fruit Tea MED · App',
    description:
      'Listo desde las 14:03. Recogida acordada hace rato; cliente contactado, sin respuesta. Pagado con tarjeta.',
    metaLabel: 'Cobrado · posible reembolso',
    metaValue: '$60',
    primaryAction: 'Reprogramar',
    secondaryAction: 'Cancelar',
  },
  {
    id: 'e-4',
    type: 'Pedido duplicado',
    tag: 'Revisar',
    tagColor: 'info',
    orderRef: '#97 · María López · App',
    description:
      'Posible pedido repetido del mismo cliente en un corto periodo. Verifica con el cliente antes de preparar ambos.',
    metaLabel: 'Pedido relacionado',
    metaValue: '#94 · $165',
    primaryAction: 'Marcar y unir al pedido original',
  },
];

export const OrdersExceptionsView = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {exceptionCards.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-sm text-slate-900">{item.type}</h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.tagColor === 'danger'
                    ? 'bg-rose-100 text-rose-600'
                    : item.tagColor === 'ready'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {item.tag}
              </span>
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
              <button className="px-3 py-1.5 bg-[#5960A1] hover:bg-[#484e85] text-white text-xs font-semibold rounded-lg transition shadow-2xs">
                {item.primaryAction}
              </button>
              {item.secondaryAction && (
                <button className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition">
                  {item.secondaryAction}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};