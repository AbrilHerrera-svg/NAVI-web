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

export interface ClosingInputs {
  cashCounted: number;
  terminalCounted: number;
  transferCounted: number;
}


// Sesión de caja de un día, tal como la devuelve el backend (GET /api/cash-register?date=).
export interface CashSessionRecord {
  id: string;
  date: string; // ISO yyyy-mm-dd
  status: 'Abierto' | 'Cerrado';
  openedBy: string;
  initialFund: number;
  salesByMethod: SalesByMethodItem[];
  dailyExpenses: DailyExpenseItem[];
  refunds: RefundItem[];
  closing?: {
    cashCounted: number;
    terminalCounted: number;
    transferCounted: number;
    difference: number;
    reason?: string;
  };
}
