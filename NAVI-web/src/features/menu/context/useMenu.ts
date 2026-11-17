import { createContext, useContext } from 'react';
import type { MenuItem } from '../types';

export interface MenuContextValue {
  items: MenuItem[];
  // Prende/apaga disponibilidad manual (también sincroniza el estado Activo/Inactivo).
  // Nuevo pedido solo muestra productos con available === true.
  toggleAvailable: (id: string) => void;
  archiveProduct: (id: string) => void;
  unarchiveProduct: (id: string) => void;
}

export const MenuReactContext = createContext<MenuContextValue | null>(null);

export const useMenu = () => {
  const ctx = useContext(MenuReactContext);
  if (!ctx) throw new Error('useMenu debe usarse dentro de <MenuProvider>');
  return ctx;
};
