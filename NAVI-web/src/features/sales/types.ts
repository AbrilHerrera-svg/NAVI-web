// Forma de la respuesta de GET /api/ventas?periodo=hoy|ayer|semana|mes
// Es la misma que backend/src/types/ventas.ts (VentasDTO).

export type SalesPeriod = "today" | "yesterday" | "this_week" | "this_month";

export interface SalesMetric {
  label: string;
  value: string;
}

export interface SalesBar {
  label: string;
  amount: number;
  percent: number; // 0-100, alto de la barra
  peak: boolean;
}

export interface SalesPaymentMethod {
  label: string;
  amount: string;
}

export interface SalesTopProduct {
  name: string;
  count: number;
}

export interface SalesData {
  generatedAt: string;
  metrics: SalesMetric[];
  chartTitle: string; // "Ventas por hora" o "Ventas por día"
  chart: SalesBar[];
  paymentMethods: SalesPaymentMethod[];
  totalLabel: string;
  topProducts: SalesTopProduct[];
  outOfStock: string[]; // platillos agotados en este momento
}
