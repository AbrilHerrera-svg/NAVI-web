import { createContext, useContext } from 'react';
import type { MenuItem } from '../types';

// Resultado de cualquier acción sobre un producto. Regresa { ok: false, reason } cuando
// no se pudo hacer (error del servidor), sin tronar en silencio.
export interface MenuActionResult {
  ok: boolean;
  reason?: string;
}

export interface MenuContextValue {
  items: MenuItem[];
  loading: boolean;
  error: string;
  // Vuelve a pedir el menú al backend.
  reload: () => void;
  // Prende/apaga disponibilidad manual (también sincroniza el estado Activo/Inactivo).
  // Nuevo pedido solo muestra productos con available === true.
  toggleAvailable: (id: string) => Promise<MenuActionResult>;
  archiveProduct: (id: string) => Promise<MenuActionResult>;
  unarchiveProduct: (id: string) => Promise<MenuActionResult>;
}

export const MenuReactContext = createContext<MenuContextValue | null>(null);

export const useMenu = () => {
  const ctx = useContext(MenuReactContext);
  if (!ctx) throw new Error('useMenu debe usarse dentro de <MenuProvider>');
  return ctx;
};
