import { createContext, useContext } from 'react';
import type { ProfileInfo } from '../types';

export interface SessionContextValue {
  profile: ProfileInfo;
  updateProfile: (profile: ProfileInfo) => void;
}

export const SessionReactContext = createContext<SessionContextValue | null>(null);

// Usuario de la sesión actual. Mientras no haya autenticación real con múltiples
// usuarios, representa a quien inició sesión en esta app (un solo perfil por ahora).
export const useSession = () => {
  const ctx = useContext(SessionReactContext);
  if (!ctx) throw new Error('useSession debe usarse dentro de <SessionProvider>');
  return ctx;
};
