// Forma de la respuesta de GET /api/ventas?periodo=hoy|ayer|semana|mes
// Es la misma que usa el front en src/features/sales/types.ts

export type PeriodoVentas = "hoy" | "ayer" | "semana" | "mes";

export interface MetricaVentaDTO {
  label: string;
  value: string;
}

export interface BarraVentaDTO {
  label: string;
  amount: number;
  percent: number; // 0-100, alto de la barra
  peak: boolean;
}

export interface MetodoPagoVentaDTO {
  label: string;
  amount: string;
}

export interface ProductoVendidoVentaDTO {
  name: string;
  count: number;
}

export interface VentasDTO {
  generatedAt: string;
  metrics: MetricaVentaDTO[];
  chartTitle: string; // "Ventas por hora" o "Ventas por día"
  chart: BarraVentaDTO[];
  paymentMethods: MetodoPagoVentaDTO[];
  totalLabel: string;
  topProducts: ProductoVendidoVentaDTO[];
  outOfStock: string[]; // platillos agotados en este momento
}
