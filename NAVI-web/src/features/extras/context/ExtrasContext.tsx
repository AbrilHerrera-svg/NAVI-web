import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { createExtraApi, deleteExtraApi, listExtrasApi, updateExtraApi } from '../services/extrasService';
import type { ExtraItem, NewExtraInput, UpdateExtraInput } from '../types';
import { ExtrasReactContext, type ExtrasActionResult } from './useExtras';

export const ExtrasProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ExtraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    listExtrasApi()
      .then((datos) => {
        if (cancelled) return;
        setItems(datos);
        setError('');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los extras');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  const createExtra = async (input: NewExtraInput): Promise<ExtrasActionResult> => {
    try {
      const creado = await createExtraApi(input);
      setItems((prev) => [...prev, creado]);
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : 'No se pudo crear el extra' };
    }
  };

  const updateExtra = async (id: string, input: UpdateExtraInput): Promise<ExtrasActionResult> => {
    try {
      await updateExtraApi(id, input);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...input } : item)));
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : 'No se pudo actualizar el extra' };
    }
  };

  const deleteExtra = async (id: string): Promise<ExtrasActionResult> => {
    try {
      await deleteExtraApi(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : 'No se pudo eliminar el extra' };
    }
  };

  return (
    <ExtrasReactContext.Provider value={{ items, loading, error, reload, createExtra, updateExtra, deleteExtra }}>
      {children}
    </ExtrasReactContext.Provider>
  );
};
