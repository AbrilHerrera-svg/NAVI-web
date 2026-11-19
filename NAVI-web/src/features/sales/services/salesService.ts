import { peticionAuth } from "../../auth";
import type { SalesData, SalesPeriod } from "../types";

// El front usa nombres en inglés para el periodo y el backend en español
const periodoApi: Record<SalesPeriod, string> = {
  today: "hoy",
  yesterday: "ayer",
  this_week: "semana",
  this_month: "mes",
};

// GET /api/ventas?periodo=hoy
// (API_URL ya trae "/api" y peticionAuth agrega el token solo)
export const obtenerVentas = (periodo: SalesPeriod) =>
  peticionAuth<SalesData>(`/ventas?periodo=${periodoApi[periodo]}`);
