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
  unit: string; // unidad en la que se consume dentro de una receta, ej. "ml", "g", "pieza"
  unitsPerBox: number; // cuántas unidades (ml, g, piezas) trae una caja, para convertir consumo de receta a cajas
}

// Línea de receta: cuántas unidades de un ingrediente de inventario consume un producto por tamaño
export interface RecipeLine {
  ingredientId: string;
  amountMed?: number;
  amountGde?: number;
  amountSingle?: number;
}

// Convierte el consumo de una receta (en la unidad del ingrediente) a cajas de inventario
export const amountToBoxes = (ingredient: InventoryIngredient, amount: number) =>
  roundBoxes(amount / ingredient.unitsPerBox);

export interface InventoryMovement {
  id: string;
  date: string; // ISO yyyy-mm-dd, para filtrar por rango de fechas
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

export interface NewIngredientInput {
  name: string;
  unit: string;
  unitsPerBox: number;
  costPerBox: number;
  minStock: number;
  initialStock: number;
}

// No incluye stock: la existencia solo cambia por ajuste, compra o venta, para que el
// historial de movimientos siga siendo la única fuente de verdad del inventario.
export type UpdateIngredientInput = Omit<NewIngredientInput, 'initialStock'>;

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
