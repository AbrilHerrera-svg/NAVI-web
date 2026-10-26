import { createContext, useContext } from 'react';
import type {
  InventoryIngredient,
  InventoryMovement,
  NewIngredientInput,
  PurchaseInput,
  RecipeLine,
  StockAdjustmentInput,
  UpdateIngredientInput,
} from '../types';

// Una línea de consumo ya resuelta en cajas, lista para aplicarse contra una existencia
export interface StockLine {
  ingredientId: string;
  boxes: number; // positivo: cantidad a consumir/restituir
}

export interface SaleResult {
  ok: boolean;
  missing: { ingredientId: string; ingredientName: string }[];
}

export interface DeleteResult {
  ok: boolean;
  reason?: string;
}

export interface InventoryContextValue {
  ingredients: InventoryIngredient[];
  movements: InventoryMovement[];
  adjustStock: (input: StockAdjustmentInput) => void;
  registerPurchase: (input: PurchaseInput) => void;
  // Descuenta existencias por una venta. Si algún ingrediente no alcanza, no aplica
  // ningún cambio y regresa qué insumos faltaron (todo o nada, nunca una venta parcial).
  registerSale: (reference: string, lines: StockLine[]) => SaleResult;
  // Restituye existencias de una venta cancelada (inverso de registerSale).
  registerCancellation: (reference: string, lines: StockLine[]) => void;
  createIngredient: (input: NewIngredientInput) => void;
  updateIngredient: (id: string, input: UpdateIngredientInput) => void;
  // No borra si el ingrediente está en una receta o tiene existencia distinta de cero;
  // regresa por qué no se pudo en vez de fallar en silencio.
  deleteIngredient: (id: string) => DeleteResult;
  // Receta de cada producto del catálogo (id de OrderCatalog → líneas de ingrediente).
  // Única fuente de verdad: tanto Menú (para editarla) como Orders (para descontar
  // stock al vender) leen de aquí, así una edición se refleja de inmediato en ventas.
  recipesByProductId: Record<string, RecipeLine[]>;
  updateRecipe: (productId: string, lines: RecipeLine[]) => void;
}

export const InventoryReactContext = createContext<InventoryContextValue | null>(null);

export const useInventory = () => {
  const ctx = useContext(InventoryReactContext);
  if (!ctx) throw new Error('useInventory debe usarse dentro de <InventoryProvider>');
  return ctx;
};
