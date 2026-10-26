import {
  CashRegisterHeader,
  OpeningCard,
  ExpectedCashCard,
  SalesByMethodCard,
  DailyExpensesCard,
  RefundsCard,
  ClosingCard,
  mockCashOpening,
  mockExpectedCash,
  mockSalesByMethod,
  mockDailyExpenses,
  mockRefunds,
  mockClosingSummary,
  mockClosingInputs,
  mockClosingReason,
} from '../features/cash-register';
import { formatLongDateEs } from '../lib/date';

export default function CashRegisterPage() {
  const todayLabel = formatLongDateEs(new Date());

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <CashRegisterHeader dateLabel={todayLabel} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OpeningCard opening={mockCashOpening} />
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
        onCloseDay={() => alert('¡Día cerrado!')}
      />
    </div>
  );
}
