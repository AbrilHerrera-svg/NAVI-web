import type { MenuItem, PromotionItem } from '../types';

export const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Chai Milk Tea', category: 'Té con leche', priceMed: 70, priceGde: 85, prepTime: '5 min', available: true, status: 'Activo' },
  { id: '2', name: 'Taro Smoothie', category: 'Smoothies', priceMed: 65, priceGde: 80, prepTime: '5 min', available: true, status: 'Activo' },
  { id: '3', name: 'Mango Fruit Tea', category: 'Té de frutas', priceMed: 60, priceGde: 75, prepTime: '4 min', available: true, status: 'Activo' },
  { id: '4', name: 'Coconut Milk Tea', category: 'Té con leche', priceMed: 70, priceGde: 85, prepTime: '5 min', available: false, status: 'Inactivo' },
  { id: '5', name: 'Biscoff Smoothie', category: 'Smoothies', priceMed: 75, priceGde: 90, prepTime: '6 min', available: true, status: 'Activo' },
  { id: '6', name: 'Chilaquiles rojos', category: 'Cocina', priceSingle: 95, prepTime: '12 min', available: true, status: 'Activo' },
  { id: '7', name: 'Waffle Dulce', category: 'Postres', priceSingle: 80, prepTime: '10 min', available: true, status: 'Activo' },
  { id: '8', name: 'Crepas de Nutella', category: 'Postres', priceSingle: 75, prepTime: '8 min', available: true, status: 'Activo' },
  { id: '9', name: 'Alfredo Pasta', category: 'Cocina · Vie–Dom', priceSingle: 120, prepTime: '15 min', available: true, status: 'Activo' },
  { id: '10', name: 'Boneless', category: 'Cocina · Vie–Dom', priceSingle: 110, prepTime: '15 min', available: true, status: 'Activo' },
  { id: '11', name: 'Horchata Latte', category: 'Té con leche', priceMed: 65, priceGde: 80, prepTime: '5 min', available: false, status: 'Archivado' },
];

export const mockPromotions: PromotionItem[] = [
  { id: 'p1', name: 'Happy hour · 2×1', appliesTo: 'Té con leche MED', discount: '2×1', schedule: 'Lun–Vie 3–5 p. m.', status: 'Activo', active: true },
  { id: 'p2', name: 'Student 10% off', appliesTo: 'Todas las bebidas', discount: '10%', schedule: 'Siempre', status: 'Activo', active: true },
  { id: 'p3', name: 'Combo chilaquiles rojos', appliesTo: 'Chilaquiles rojos + Chai Milk', discount: '—', price: 150, schedule: 'Fines de semana', status: 'Programado', active: true },
  { id: 'p4', name: 'Summer mango', appliesTo: 'Mango Fruit Tea', discount: '$10 de desc.', schedule: '1–30 sep', status: 'Terminado', active: true },
];