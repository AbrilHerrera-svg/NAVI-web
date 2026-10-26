export interface CashOpeningInfo {
  status: 'Abierto' | 'Cerrado';
  initialFund: number;
  openedAtLabel: string; // ej. "Fondo inicial de efectivo · 8:00 a. m."
  openedBy: string;
}

export interface ExpectedCashInfo {
  initialFund: number;
  netCashSales: number;
  expectedCash: number;
  note: string;
}

export interface SalesByMethodItem {
  label: string;
  amount: number;
}

export interface DailyExpenseItem {
  label: string;
  amount: number;
}

export interface RefundItem {
  label: string;
  amount: number;
}

export interface ClosingSummary {
  systemSalesTotal: number;
  initialFund: number;
  expectedFunds: number;
  countedFunds: number;
  difference: number;
}
