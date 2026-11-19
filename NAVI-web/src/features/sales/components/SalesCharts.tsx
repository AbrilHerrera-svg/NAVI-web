import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import type { SalesBar, SalesPaymentMethod } from "../types";

interface Props {
  title: string;
  chart: SalesBar[];
  paymentMethods: SalesPaymentMethod[];
  totalLabel: string;
}

const dinero = (n: number) => `$${n.toLocaleString("es-MX")}`;

export const SalesCharts = ({ title, chart, paymentMethods, totalLabel }: Props) => {
  const sinVentas = chart.every((barra) => barra.amount === 0);
  const muchasBarras = chart.length > 12; // el mes tiene hasta 31 barras

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ventas por hora / por día */}
      <Card className="shadow-xs lg:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          <Button
            variant="secondary"
            onClick={() => alert('Exportar reporte — próximamente')}
            className="px-3 py-1.5 shadow-2xs"
          >
            Exportar
          </Button>
        </div>

        {sinVentas ? (
          <p className="h-48 flex items-center justify-center text-sm text-slate-400">
            Aún no hay ventas en este periodo.
          </p>
        ) : (
          <>
            {/* Gráfica de barras: el alto de cada barra viene del backend (percent) */}
            <div
              className={`flex items-end justify-between h-48 px-2 border-b border-slate-100 ${
                muchasBarras ? 'gap-0.5' : 'gap-2 sm:gap-4'
              }`}
            >
              {chart.map((item, idx) => (
                <div key={idx} className="flex flex-col justify-end items-center flex-1 h-full">
                  <div
                    title={`${item.label}: ${dinero(item.amount)}`}
                    style={{ height: `${item.percent}%` }}
                    className={`w-full max-w-[48px] rounded-t-lg transition-all ${
                      item.peak ? 'bg-[#5960A1]' : 'bg-[#5960A1]/35'
                    }`}
                  />
                </div>
              ))}
            </div>
            <div
              className={`flex justify-between px-2 mt-2 ${muchasBarras ? 'gap-0.5' : 'gap-2 sm:gap-4'}`}
            >
              {chart.map((item, idx) => (
                <span
                  key={idx}
                  className={`flex-1 text-center text-slate-400 font-medium ${
                    muchasBarras ? 'text-[9px]' : 'text-xs'
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Por método de pago */}
      <Card className="shadow-xs flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-6">Por método de pago</h2>
          <div className="space-y-5 text-sm">
            {paymentMethods.map((metodo) => (
              <div key={metodo.label} className="flex justify-between items-center text-slate-700">
                <span>{metodo.label}</span>
                <span className="font-bold text-slate-900">{metodo.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 mt-6">
          <p className="text-xs text-slate-400">{totalLabel}</p>
        </div>
      </Card>
    </div>
  );
};
