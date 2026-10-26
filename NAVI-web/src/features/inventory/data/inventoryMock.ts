import type { InventoryIngredient, InventoryMovement } from '../types';

export const mockIngredients: InventoryIngredient[] = [
  { id: 'ing-1', name: 'Leche entera', stock: 2, minStock: 3, costPerBox: 336, dependentProducts: 5, unit: 'ml', unitsPerBox: 12000 },
  { id: 'ing-2', name: 'Jarabe de chocolate', stock: 0, minStock: 1, costPerBox: 420, dependentProducts: 3, unit: 'ml', unitsPerBox: 6000 },
  { id: 'ing-3', name: 'Base de té', stock: 1, minStock: 2, costPerBox: 480, dependentProducts: 8, unit: 'g', unitsPerBox: 4000 },
  { id: 'ing-4', name: 'Oreo', stock: 3, minStock: 2, costPerBox: 96, dependentProducts: 2, unit: 'pieza', unitsPerBox: 48 },
  { id: 'ing-5', name: 'Leche de coco', stock: 2, minStock: 1, costPerBox: 162, dependentProducts: 1, unit: 'ml', unitsPerBox: 6000 },
  { id: 'ing-6', name: 'Perlas de tapioca', stock: 4, minStock: 2, costPerBox: 30, dependentProducts: 6, unit: 'g', unitsPerBox: 2000 },
];

export const mockMovements: InventoryMovement[] = [
  {
    id: 'mov-5',
    date: '2026-10-17',
    dateLabel: '17 Oct 2026 · 13:58',
    type: 'Venta',
    ingredientName: 'Leche entera',
    quantity: -0.025,
    reference: 'Pedido #98 · Chai Milk Tea GDE',
  },
  {
    id: 'mov-4',
    date: '2026-10-17',
    dateLabel: '17 Oct 2026 · 13:45',
    type: 'Cancelación',
    ingredientName: 'Leche entera',
    quantity: 0.025,
    reference: 'Pedido #87 · existencias restauradas',
  },
  {
    id: 'mov-3',
    date: '2026-10-17',
    dateLabel: '17 Oct 2026 · 10:30',
    type: 'Merma',
    ingredientName: 'Jarabe de chocolate',
    quantity: -0.5,
    reference: 'Lote caducado · Ana García',
  },
  {
    id: 'mov-2',
    date: '2026-10-17',
    dateLabel: '17 Oct 2026 · 09:10',
    type: 'Ajuste',
    ingredientName: 'Base de té',
    quantity: -0.02,
    reference: 'Diferencia de conteo · Sofía Torres',
  },
  {
    id: 'mov-1',
    date: '2026-10-16',
    dateLabel: '16 Oct 2026 · 18:20',
    type: 'Compra',
    ingredientName: 'Leche entera',
    quantity: 0.5,
    reference: 'PUR-104 · Lácteos del Mayab · $168',
  },
];

// Siguiente folio de compra (la última registrada en el mock es PUR-104)
export const mockNextPurchaseFolio = 105;
