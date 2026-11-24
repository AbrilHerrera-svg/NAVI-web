import { createContext, useContext } from 'react';
import type { ExtraItem, NewExtraInput, UpdateExtraInput } from '../types';

export interface ExtrasActionResult {
  ok: boolean;
  reason?: string;
}

export interface ExtrasContextValue {
  items: ExtraItem[];
  loading: boolean;
  error: string;
  reload: () => void;
  createExtra: (input: NewExtraInput) => Promise<ExtrasActionResult>;
  updateExtra: (id: string, input: UpdateExtraInput) => Promise<ExtrasActionResult>;
  deleteExtra: (id: string) => Promise<ExtrasActionResult>;
}

export const ExtrasReactContext = createContext<ExtrasContextValue | null>(null);

export const useExtras = () => {
  const ctx = useContext(ExtrasReactContext);
  if (!ctx) throw new Error('useExtras debe usarse dentro de <ExtrasProvider>');
  return ctx;
};
