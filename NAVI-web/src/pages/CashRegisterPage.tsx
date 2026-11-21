import {
  CashRegisterHeader,
  OpeningCard,
  ExpectedCashCard,
  SalesByMethodCard,
  DailyExpensesCard,
  RefundsCard,
  ClosingCard,
  useCashRegister,
  type ClosingSummary,
  type ExpectedCashInfo,
  type SalesByMethodItem,
} from '../features/cash-register';
import { useTasks } from '../features/tasks';
import { useSession } from '../features/profile';
import { formatLongDateEs } from '../lib/date';

// Si todavía no hay ventas registradas, se muestran los tres métodos en $0
const EMPTY_SALES: SalesByMethodItem[] = [
  { label: 'Efectivo', amount: 0 },
  { label: 'Terminal de tarjeta', amount: 0 },
  { label: 'Transferencia', amount: 0 },
];

export default function CashRegisterPage() {
  const todayLabel = formatLongDateEs(new Date());
  const { opening, session, previousCloseAmount, openDay, closeDay } = useCashRegister();
  const { tasks } = useTasks();
  const { profile } = useSession();

  const salesByMethod = session && session.salesByMethod.length > 0 ? session.salesByMethod : EMPTY_SALES;
  const dailyExpenses = session?.dailyExpenses ?? [];
  const refunds = session?.refunds ?? [];

  const salesTotal = salesByMethod.reduce((acc, s) => acc + s.amount, 0);
  const cashSales = salesByMethod.find((s) => s.label === 'Efectivo')?.amount ?? 0;
  const refundsTotal = refunds.reduce((acc, r) => acc + r.amount, 0);

  const expected: ExpectedCashInfo = {
    initialFund: opening.initialFund,
    netCashSales: cashSales,
    expectedCash: opening.initialFund + cashSales,
    note: refundsTotal > 0 ? `Reembolsos del día: $${refundsTotal}.` : 'Sin reembolsos hoy.',
  };

  const closingSummary: ClosingSummary = {
    systemSalesTotal: salesTotal,
    initialFund: opening.initialFund,
    expectedFunds: salesTotal + opening.initialFund,
    countedFunds: 0,
    difference: 0,
  };

  // El cierre del día no se puede confirmar sin caja abierta ni si quedan tareas de apertura/cierre pendientes.
  const pendingRequired = tasks.filter((t) => t.requiredForClose && !t.done).length;
  const blockedReason =
    opening.status !== 'Abierto'
      ? 'Abre la caja para poder cerrar el día.'
      : pendingRequired > 0
        ? `Faltan ${pendingRequired} ${pendingRequired === 1 ? 'tarea requerida' : 'tareas requeridas'} de apertura/cierre en Tareas.`
        : undefined;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <CashRegisterHeader dateLabel={todayLabel} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* key: al llegar el cierre anterior del servidor, el campo se reinicia con ese monto */}
        <OpeningCard
          key={previousCloseAmount}
          opening={opening}
          previousCloseAmount={previousCloseAmount}
          openedBy={profile.name}
          onOpenDay={(initialFund) => openDay(initialFund, profile.name)}
        />
        <ExpectedCashCard expected={expected} />
        <SalesByMethodCard items={salesByMethod} />
        <DailyExpensesCard items={dailyExpenses} />
      </div>

      <RefundsCard items={refunds} />

      {/* key: al abrir o cerrar la caja el formulario de cierre empieza limpio */}
      <ClosingCard
        key={`${session?.id ?? 'sin-caja'}-${opening.status}`}
        summary={closingSummary}
        inputs={{ cashCounted: 0, terminalCounted: 0, transferCounted: 0 }}
        initialReason=""
        dateLabel={todayLabel}
        blockedReason={blockedReason}
        onCloseDay={(input) => {
          closeDay(input);
          alert('¡Día cerrado!');
        }}
      />
    </div>
  );
}