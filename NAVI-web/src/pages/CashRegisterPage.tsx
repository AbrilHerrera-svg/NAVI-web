import {
  CashRegisterHeader,
  OpeningCard,
  mockCashOpening,
} from '../features/cash-register';

export default function CashRegisterPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <CashRegisterHeader dateLabel="Sábado, 17 de octubre" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OpeningCard opening={mockCashOpening} />
      </div>
    </div>
  );
}
