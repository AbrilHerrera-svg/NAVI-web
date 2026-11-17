export type MenuTab = 'lista' | 'tarjetas' | 'promociones';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceMed?: number;
  priceGde?: number;
  priceSingle?: number;
  prepTime: string;
  available: boolean;
  status: 'Activo' | 'Inactivo' | 'Archivado';
  // Solo se puede ordenar viernes, sábado o domingo (ej. pastas y Boneless). Fuera de
  // esos días no se considera disponible aunque `available` sea true.
  weekendOnly?: boolean;
}

// Días en los que un producto "solo fin de semana" puede ordenarse: viernes(5), sábado(6), domingo(0).
const WEEKEND_DAYS = [0, 5, 6];

// available=false o archivado siempre gana; weekendOnly además exige que hoy sea Vie-Dom.
export const isMenuItemOrderableToday = (item: MenuItem, today: Date = new Date()): boolean => {
  if (!item.available || item.status === 'Archivado') return false;
  if (item.weekendOnly && !WEEKEND_DAYS.includes(today.getDay())) return false;
  return true;
};

export interface PromotionItem {
  id: string;
  name: string;
  appliesTo: string;
  discount: string;
  price?: number;
  schedule: string;
  period?: string;
  status: 'Activo' | 'Programado' | 'Terminado';
  active: boolean;
}
