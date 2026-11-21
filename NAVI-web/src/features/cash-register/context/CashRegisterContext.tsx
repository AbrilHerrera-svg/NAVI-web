import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { errorMessage } from '../../../lib/api';
import { todayISO } from '../../../lib/date';
import { closeSessionApi, getLastCloseApi, getSessionApi, openSessionApi } from '../services/cashRegisterService';
import type { CashOpeningInfo, CashSession, CloseDayInput } from '../types';
import { CashRegisterReactContext, type OpenDayResult } from './useCashRegister';

const EPSILON = 0.01;

const timeLabel = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' }) : '';

export const CashRegisterProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<CashSession | null>(null);
  // Monto con el que cerró la última caja; null si nunca se ha cerrado una
  const [previousClose, setPreviousClose] = useState<number | null>(null);

  const reload = useCallback(async () => {
    try {
      const [today, last] = await Promise.all([getSessionApi(todayISO()), getLastCloseApi()]);
      setSession(today);
      setPreviousClose(last?.amount ?? null);
    } catch (error) {
      console.warn('No se pudo cargar la caja:', error);
    }
  }, []);

  // carga inicial al abrir la app
  useEffect(() => {
    Promise.all([getSessionApi(todayISO()), getLastCloseApi()])
      .then(([today, last]) => {
        setSession(today);
        setPreviousClose(last?.amount ?? null);
      })
      .catch((error) => console.warn('No se pudo cargar la caja:', error));
  }, []);

  const opening: CashOpeningInfo = useMemo(
    () =>
      session
        ? {
            status: session.status,
            initialFund: session.initialFund,
            openedAtLabel: `Fondo inicial de efectivo · ${timeLabel(session.openedAt)}`,
            openedBy: session.openedBy,
          }
        : { status: 'Cerrado', initialFund: 0, openedAtLabel: '', openedBy: '' },
    [session]
  );

  const openDay = (initialFund: number, openedBy: string): OpenDayResult => {
    if (session?.status === 'Cerrado') {
      return { ok: false, reason: 'La caja de hoy ya fue cerrada.' };
    }
    if (session) {
      return { ok: false, reason: 'La caja de hoy ya está abierta.' };
    }
    if (previousClose !== null && Math.abs(initialFund - previousClose) > EPSILON) {
      return {
        ok: false,
        reason: `El fondo inicial debe coincidir con el cierre anterior ($${previousClose.toFixed(2)}).`,
      };
    }

    const date = todayISO();
    // se muestra abierta al instante; el id real llega con la respuesta del servidor
    setSession({
      id: 'tmp',
      date,
      status: 'Abierto',
      openedBy,
      initialFund,
      openedAt: new Date().toISOString(),
      salesByMethod: [],
      dailyExpenses: [],
      refunds: [],
    });

    openSessionApi({ date, openedBy, initialFund })
      .then(setSession)
      .catch((error) => {
        alert(`No se pudo abrir la caja: ${errorMessage(error)}`);
        setSession(null);
      });

    return { ok: true };
  };

  const closeDay = (input: CloseDayInput) => {
    if (!session || session.id === 'tmp') {
      alert('Espera un momento: la caja se está abriendo en el servidor.');
      return;
    }

    const total = input.cashCounted + input.terminalCounted + input.transferCounted;
    setSession({ ...session, status: 'Cerrado' });
    setPreviousClose(Math.round(total * 100) / 100);

    closeSessionApi(session.id, input).catch((error) => {
      alert(`No se pudo cerrar la caja: ${errorMessage(error)}`);
      void reload();
    });
  };

  return (
    <CashRegisterReactContext.Provider
      value={{ opening, session, previousCloseAmount: previousClose ?? 0, openDay, closeDay }}
    >
      {children}
    </CashRegisterReactContext.Provider>
  );
};