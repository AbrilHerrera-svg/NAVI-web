import { mockOrderExceptions } from '../data/ordersMock'; 


export const OrdersExceptionsView = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockOrderExceptions.map((item) => (
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