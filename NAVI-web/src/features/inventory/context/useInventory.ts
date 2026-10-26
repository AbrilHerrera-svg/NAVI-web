import { createContext, useContext } from 'react';
import type { InventoryIngredient, InventoryMovement, PurchaseInput, StockAdjustmentInput } from '../types';

// Una línea de consumo ya resuelta en cajas, lista para aplicarse contra una existencia
export interface StockLine {
  ingredientId: string;
  boxes: number; // positivo: cantidad a consumir/restituir
}

export interface SaleResult {
  ok: boolean;
  missing: { ingredientId: string; ingredientName: string }[];
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
}

export const InventoryReactContext = createContext<InventoryContextValue | null>(null);

export const useInventory = () => {
  const ctx = useContext(InventoryReactContext);
  if (!ctx) throw new Error('useInventory debe usarse dentro de <InventoryProvider>');
  return ctx;
};
