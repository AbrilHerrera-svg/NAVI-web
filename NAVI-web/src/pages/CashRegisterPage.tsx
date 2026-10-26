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

export default function CashRegisterPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <CashRegisterHeader dateLabel="Sábado, 17 de octubre" />

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
        dateLabel="Sábado, 17 de octubre"
        onCloseDay={() => alert('¡Día cerrado!')}
      />
    </div>
  );
}
