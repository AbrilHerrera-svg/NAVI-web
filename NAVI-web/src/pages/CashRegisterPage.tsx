import {
  CashRegisterHeader,
  OpeningCard,
  ExpectedCashCard,
  SalesByMethodCard,
  DailyExpensesCard,
  RefundsCard,
  ClosingCard,
  useCashRegister,
  mockExpectedCash,
  mockSalesByMethod,
  mockDailyExpenses,
  mockRefunds,
  mockClosingSummary,
  mockClosingInputs,
  mockClosingReason,
} from '../features/cash-register';
import { useTasks } from '../features/tasks';
import { useSession } from '../features/profile';
import { formatLongDateEs } from '../lib/date';

export default function CashRegisterPage() {
  const todayLabel = formatLongDateEs(new Date());
  const { opening, previousCloseAmount, openDay, closeDay } = useCashRegister();
  const { tasks } = useTasks();
  const { profile } = useSession();

  // El cierre del día no se puede confirmar si quedan tareas de apertura/cierre pendientes.
  const pendingRequired = tasks.filter((t) => t.requiredForClose && !t.done).length;
  const blockedReason =
    pendingRequired > 0
      ? `Faltan ${pendingRequired} ${pendingRequired === 1 ? 'tarea requerida' : 'tareas requeridas'} de apertura/cierre en Tareas.`
      : undefined;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <CashRegisterHeader dateLabel={todayLabel} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OpeningCard
          opening={opening}
          previousCloseAmount={previousCloseAmount}
          openedBy={profile.name}
          onOpenDay={(initialFund) => openDay(initialFund, profile.name)}
        />
        <ExpectedCashCard expected={mockExpectedCash} />
        <SalesByMethodCard items={mockSalesByMethod} />
        <DailyExpensesCard items={mockDailyExpenses} />
      </div>

      <RefundsCard items={mockRefunds} />

      <ClosingCard
        summary={mockClosingSummary}
        inputs={mockClosingInputs}
        initialReason={mockClosingReason}
        dateLabel={todayLabel}
        blockedReason={blockedReason}
        onCloseDay={(countedFunds) => {
          closeDay(countedFunds);
          alert('¡Día cerrado!');
        }}
      />
    </div>
  );
}
