import { ApiError, apiFetch } from '../../../lib/api';
import type { CashSession, CloseDayInput } from '../types';

// Sesión del día; null si todavía no se abre la caja (el backend responde 404)
export const getSessionApi = async (date: string): Promise<CashSession | null> => {
  try {
    return await apiFetch<CashSession>(`/cash-register?date=${date}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
};

// Monto con el que cerró la última caja; null si nunca se ha cerrado una
export const getLastCloseApi = async (): Promise<{ date: string; amount: number } | null> =>
  apiFetch<{ date: string; amount: number } | null>('/cash-register/last-close');

export const openSessionApi = async (input: {
  date: string;
  openedBy: string;
  initialFund: number;
}): Promise<CashSession> => apiFetch<CashSession>('/cash-register/open', { method: 'POST', body: input });

export const closeSessionApi = async (id: string, input: CloseDayInput): Promise<void> => {
  await apiFetch(`/cash-register/${id}/close`, {
    method: 'POST',
    body: {
      cashCounted: input.cashCounted,
      terminalCounted: input.terminalCounted,
      transferCounted: input.transferCounted,
      difference: input.difference,
      ...(input.reason ? { reason: input.reason } : {}),
    },
  });
};