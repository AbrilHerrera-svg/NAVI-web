import { createContext, useContext } from 'react';
import type { CashOpeningInfo, CashSession, CloseDayInput } from '../types';

export interface OpenDayResult {
  ok: boolean;
  reason?: string;
}

export interface CashRegisterContextValue {
  opening: CashOpeningInfo;
  // Sesión de hoy (ventas por método, gastos, reembolsos); null si la caja no se ha abierto
  session: CashSession | null;
  // Monto final del cierre anterior; la apertura de hoy debe coincidir con este monto.
  previousCloseAmount: number;
  openDay: (initialFund: number, openedBy: string) => OpenDayResult;
  closeDay: (input: CloseDayInput) => void;
}

export const CashRegisterReactContext = createContext<CashRegisterContextValue | null>(null);

export const useCashRegister = () => {
  const ctx = useContext(CashRegisterReactContext);
  if (!ctx) throw new Error('useCashRegister debe usarse dentro de <CashRegisterProvider>');
  return ctx;
};