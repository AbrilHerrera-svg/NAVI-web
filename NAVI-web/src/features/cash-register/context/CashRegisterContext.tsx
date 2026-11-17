import { useState, type ReactNode } from 'react';
import { mockPreviousCloseAmount } from '../data/cashRegisterMock';
import type { CashOpeningInfo } from '../types';
import { CashRegisterReactContext, type OpenDayResult } from './useCashRegister';

const EPSILON = 0.01;

export const CashRegisterProvider = ({ children }: { children: ReactNode }) => {
  const [opening, setOpening] = useState<CashOpeningInfo>({
    status: 'Cerrado',
    initialFund: 0,
    openedAtLabel: '',
    openedBy: '',
  });
  const [previousCloseAmount, setPreviousCloseAmount] = useState(mockPreviousCloseAmount);

  const openDay = (initialFund: number, openedBy: string): OpenDayResult => {
    if (Math.abs(initialFund - previousCloseAmount) > EPSILON) {
      return {
        ok: false,
        reason: `El fondo inicial debe coincidir con el cierre anterior ($${previousCloseAmount.toFixed(2)}).`,
      };
    }

    const time = new Date().toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });
    setOpening({
      status: 'Abierto',
      initialFund,
      openedAtLabel: `Fondo inicial de efectivo · ${time}`,
      openedBy,
    });
    return { ok: true };
  };

  const closeDay = (countedFunds: number) => {
    setPreviousCloseAmount(countedFunds);
    setOpening((prev) => ({ ...prev, status: 'Cerrado' }));
  };

  return (
    <CashRegisterReactContext.Provider value={{ opening, previousCloseAmount, openDay, closeDay }}>
      {children}
    </CashRegisterReactContext.Provider>
  );
};
