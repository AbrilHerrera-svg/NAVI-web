import type {
  CashOpeningInfo,
  ExpectedCashInfo,
  SalesByMethodItem,
  DailyExpenseItem,
  RefundItem,
  ClosingSummary,
} from "../types";

export const mockCashOpening: CashOpeningInfo = {
  status: "Abierto",
  initialFund: 300,
  openedAtLabel: "Fondo inicial de efectivo · 8:00 a. m.",
  openedBy: "Ana García",
};

export const mockExpectedCash: ExpectedCashInfo = {
  initialFund: 300,
  netCashSales: 1860,
  expectedCash: 2160,
  note: "Las ventas netas en efectivo incluyen $35 de reembolsos. Gastos de $195 pagados por transferencia; sin salida de caja.",
};

export const mockSalesByMethod: SalesByMethodItem[] = [
  { label: "Efectivo", amount: 1860 },
  { label: "Terminal de tarjeta", amount: 1620 },
  { label: "Transferencia", amount: 800 },
];

export const mockDailyExpenses: DailyExpenseItem[] = [
  { label: "Insumos", amount: 120 },
  { label: "Limpieza", amount: 45 },
  { label: "Caja chica", amount: 30 },
];

export const mockRefunds: RefundItem[] = [
  { label: "Reembolsos en efectivo", amount: 35 },
  { label: "Reembolsos con tarjeta", amount: 12 },
];

export const mockClosingSummary: ClosingSummary = {
  systemSalesTotal: 4280,
  initialFund: 300,
  expectedFunds: 4580,
  countedFunds: 4570,
  difference: -10,
};

export const mockClosingReason =
  "Al cajón le faltan $10; error de cambio en revisión.";
