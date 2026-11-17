import { useState, type ReactNode } from 'react';
import { mockMenuItems } from '../data/menuMock';
import type { MenuItem } from '../types';
import { MenuReactContext } from './useMenu';

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);

  const toggleAvailable = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, available: !item.available, status: item.available ? 'Inactivo' : 'Activo' }
          : item
      )
    );
  };

  const archiveProduct = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Archivado', available: false } : item))
    );
  };

  const unarchiveProduct = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Activo', available: true } : item))
    );
  };

  return (
    <MenuReactContext.Provider value={{ items, toggleAvailable, archiveProduct, unarchiveProduct }}>
      {children}
    </MenuReactContext.Provider>
  );
};
