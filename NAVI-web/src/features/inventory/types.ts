export type InventoryTab = 'ingredientes' | 'movimientos';
export type InventoryView = 'inventario' | 'ajuste' | 'compra';

export type MovementType = 'Venta' | 'Cancelación' | 'Merma' | 'Ajuste' | 'Compra';
export type AdjustmentType = Extract<MovementType, 'Ajuste' | 'Merma'>;
export type StockStatus = 'Disponible' | 'Bajo' | 'Agotado';
export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Transferencia';

export interface InventoryIngredient {
  id: string;
  name: string;
  stock: number; // existencia actual, en cajas
  minStock: number; // mínimo, en cajas
  costPerBox: number; // MXN
  dependentProducts: number; // productos del menú que usan este ingrediente
}

export interface InventoryMovement {
  id: string;
  dateLabel: string; // ej. "17 Oct 2026 · 13:58"
  type: MovementType;
  ingredientName: string;
  quantity: number; // cajas: positivo entra, negativo sale
  reference: string;
  notes?: string;
}

export interface TodayMovement {
  id: string;
  time: string; // ej. "09:00"
  label: string;
  type: MovementType;
  quantity: number;
}

export interface StockAdjustmentInput {
  ingredientId: string;
  type: AdjustmentType;
  countedBoxes: number;
  notes: string;
  responsible: string;
  date: string;
  reason: string;
  reference: string;
}

export interface PurchaseInput {
  ingredientId: string;
  receivedBoxes: number;
  totalCost: number;
  notes: string;
  supplier: string;
  date: string;
  paymentMethod: PaymentMethod;
}

// Evita residuos de punto flotante al sumar/restar fracciones de caja (0.1 + 0.2)
export const roundBoxes = (value: number) => Math.round(value * 1000) / 1000;

const boxesLabel = (value: number) => (Math.abs(value) === 1 ? 'caja' : 'cajas');

export const formatBoxes = (value: number) => `${value} ${boxesLabel(value)}`;

export const formatSignedBoxes = (value: number) =>
  `${value > 0 ? '+' : '−'}${Math.abs(value)} ${boxesLabel(value)}`;

export const formatMoney = (value: number) =>
  `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Deriva el estado a partir de la existencia, para que siempre coincida con el stock real.
export const getStockStatus = (ingredient: InventoryIngredient): StockStatus => {
  if (ingredient.stock <= 0) return 'Agotado';
  if (ingredient.stock <= ingredient.minStock) return 'Bajo';
  return 'Disponible';
};
