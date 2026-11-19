import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { actualizarProducto, obtenerMenu } from '../services/menuService';
import type { MenuItem, UpdateMenuItemPayload } from '../types';
import { MenuReactContext, type MenuActionResult } from './useMenu';

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  // Productos con un cambio en curso: evita doble clic mientras se guarda.
  const busy = useRef(new Set<string>());

  useEffect(() => {
    let cancelled = false; // evita actualizar el estado si el componente ya se cerró

    obtenerMenu()
      .then((datos) => {
        if (cancelled) return;
        setItems(datos);
        setError('');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar el menú');
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

  // Guarda el cambio en el backend y, solo si salió bien, lo refleja en pantalla.
  const updateItem = async (id: string, changes: UpdateMenuItemPayload): Promise<MenuActionResult> => {
    if (busy.current.has(id)) return { ok: false }; // ya hay un cambio en curso

    busy.current.add(id);
    try {
      await actualizarProducto(id, changes);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : 'No se pudo actualizar el producto' };
    } finally {
      busy.current.delete(id);
    }
  };

  const toggleAvailable = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return { ok: false, reason: 'El producto ya no existe.' };
    return updateItem(id, { available: !item.available, status: item.available ? 'Inactivo' : 'Activo' });
  };

  const archiveProduct = (id: string) => updateItem(id, { status: 'Archivado', available: false });

  const unarchiveProduct = (id: string) => updateItem(id, { status: 'Activo', available: true });

  return (
    <MenuReactContext.Provider
      value={{ items, loading, error, reload, toggleAvailable, archiveProduct, unarchiveProduct }}
    >
      {children}
    </MenuReactContext.Provider>
  );
};
