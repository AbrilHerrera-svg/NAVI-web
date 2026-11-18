import { ApiError } from "../../../lib/api";
import { peticionAuth } from "../../auth";
import type { CashSessionRecord } from "../types";

// GET /api/cash-register?date=yyyy-mm-dd
// El backend responde 404 cuando ese día no hubo caja: aquí eso es "sin sesión" (null), no un error.
export const obtenerCaja = async (fecha: string): Promise<CashSessionRecord | null> => {
  try {
    return await peticionAuth<CashSessionRecord>(`/cash-register?date=${fecha}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};
