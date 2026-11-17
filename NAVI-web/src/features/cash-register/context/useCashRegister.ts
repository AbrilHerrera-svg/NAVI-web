import { createContext, useContext } from 'react';
import type { CashOpeningInfo } from '../types';

export interface OpenDayResult {
  ok: boolean;
  reason?: string;
}

export interface CashRegisterContextValue {
  opening: CashOpeningInfo;
  // Monto final del cierre anterior; la apertura de hoy debe coincidir con este monto.
  previousCloseAmount: number;
  openDay: (initialFund: number, openedBy: string) => OpenDayResult;
  closeDay: (countedFunds: number) => void;
}

export const CashRegisterReactContext = createContext<CashRegisterContextValue | null>(null);

export const useCashRegister = () => {
  const ctx = useContext(CashRegisterReactContext);
  if (!ctx) throw new Error('useCashRegister debe usarse dentro de <CashRegisterProvider>');
  return ctx;
};
