import ProgressBar from "../../../components/ui/ProgressBar";
import { mockHourlySales, mockUpcomingExpenses } from "../data/dashboardMock";
import { mockPaymentMethods } from "../data/dashboardMock";
import { mockWeeklyFinance } from "../data/dashboardMock";
export const SalesAndFinance = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-bold text-slate-800">
        Ventas y dinero · Solo dueño
      </h2>

      {/* Fila 1: Ventas por hora y Métodos de pago */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfica ventas por hora */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="font-semibold text-sm text-slate-800 mb-6">
            Ventas por hora
          </h3>
          <div className="flex items-end justify-between h-36 px-4 pb-2 border-b border-slate-100 gap-2">
            {mockHourlySales.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div
                  className={`w-full max-w-[32px] rounded-t-md transition-all ${
                    item.peak ? "bg-[#5960A1]" : "bg-[#5960A1]/30"
                  } ${item.height}`}
                />
                <span className="text-[11px] text-slate-400">{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h3 className="font-semibold text-sm text-slate-800 mb-4">
            Métodos de pago
          </h3>
          <div className="space-y-4 text-xs">
            {mockPaymentMethods.map((pm, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-medium text-slate-700 mb-1.5">
                  <span>{pm.label}</span>
                  <span className="font-bold text-slate-800">{pm.amount}</span>
                </div>
                <ProgressBar value={pm.percent} tone={pm.tone} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fila 2: Ingresos vs gastos y Próximos gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ingresos vs gastos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-800">
            Ingresos vs. gastos · últimos 7 días
          </h3>
          <p className="text-[11px] text-slate-400 mb-6">
            Morado: ingresos · Lila: gastos
          </p>
          <div className="flex items-end justify-between h-32 px-4 pb-2 border-b border-slate-100 gap-3">
            {mockWeeklyFinance.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-1 items-end flex-1 justify-center h-full"
              >
                <div
                  className="w-3 rounded-t-sm bg-[#5960A1]"
                  style={{ height: `${item.ingresos}%` }}
                />
                <div
                  className="w-3 rounded-t-sm bg-[#5960A1]/30"
                  style={{ height: `${item.gastos}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Próximos gastos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm text-slate-800">
              Próximos gastos y gastos de hoy
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Gastos registrados manualmente
            </p>
            <div className="divide-y divide-slate-100 text-xs">
              {mockUpcomingExpenses.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 first:pt-0 last:pb-0"
                >
                  <span className="text-slate-700">{exp.label}</span>
                  <span
                    className={
                      exp.pending
                        ? "font-semibold text-amber-600"
                        : "font-bold text-slate-800"
                    }
                  >
                    {exp.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
