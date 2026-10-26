import { useState, type ReactNode } from 'react';
import { mockIngredients, mockMovements, mockNextPurchaseFolio } from '../data/inventoryMock';
import {
  roundBoxes,
  type InventoryIngredient,
  type InventoryMovement,
  type PurchaseInput,
  type StockAdjustmentInput,
} from '../types';
import { InventoryReactContext, type SaleResult, type StockLine } from './useInventory';

// Etiqueta de fecha para movimientos nuevos: la fecha capturada (o "Hoy") + hora actual
const buildDateLabel = (date: string) => {
  const time = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${date.trim() || 'Hoy'} · ${time}`;
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [ingredients, setIngredients] = useState<InventoryIngredient[]>(mockIngredients);
  const [movements, setMovements] = useState<InventoryMovement[]>(mockMovements);
  const [purchaseFolio, setPurchaseFolio] = useState(mockNextPurchaseFolio);

  const adjustStock = (input: StockAdjustmentInput) => {
    const ingredient = ingredients.find((i) => i.id === input.ingredientId);
    if (!ingredient) return;

    const difference = roundBoxes(input.countedBoxes - ingredient.stock);

    setIngredients((prev) =>
      prev.map((i) => (i.id === ingredient.id ? { ...i, stock: input.countedBoxes } : i))
    );
    setMovements((prev) => [
      {
        id: `mov-${Date.now()}`,
        dateLabel: buildDateLabel(input.date),
        type: input.type,
        ingredientName: ingredient.name,
        quantity: difference,
        reference: [input.reason, input.reference, input.responsible].filter(Boolean).join(' · '),
        notes: input.notes || undefined,
      },
      ...prev,
    ]);
  };

  const registerPurchase = (input: PurchaseInput) => {
    const ingredient = ingredients.find((i) => i.id === input.ingredientId);
    if (!ingredient) return;

    setIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredient.id ? { ...i, stock: roundBoxes(i.stock + input.receivedBoxes) } : i
      )
    );
    setMovements((prev) => [
      {
        id: `mov-${Date.now()}`,
        dateLabel: buildDateLabel(input.date),
        type: 'Compra',
        ingredientName: ingredient.name,
        quantity: input.receivedBoxes,
        reference: `PUR-${purchaseFolio} · ${input.supplier} · $${input.totalCost.toLocaleString('es-MX')}`,
        notes: input.notes || undefined,
      },
      ...prev,
    ]);
    setPurchaseFolio((folio) => folio + 1);
  };

  const registerSale = (reference: string, lines: StockLine[]): SaleResult => {
    const missing = lines
      .map((line) => ({ line, ingredient: ingredients.find((i) => i.id === line.ingredientId) }))
      .filter(({ line, ingredient }) => !ingredient || ingredient.stock < line.boxes)
      .map(({ line, ingredient }) => ({
        ingredientId: line.ingredientId,
        ingredientName: ingredient?.name ?? line.ingredientId,
      }));

    if (missing.length > 0) return { ok: false, missing };
    if (lines.length === 0) return { ok: true, missing: [] };

    setIngredients((prev) =>
      prev.map((i) => {
        const line = lines.find((l) => l.ingredientId === i.id);
        return line ? { ...i, stock: roundBoxes(i.stock - line.boxes) } : i;
      })
    );
    setMovements((prev) => [
      ...lines.map((line) => {
        const ingredient = ingredients.find((i) => i.id === line.ingredientId);
        return {
          id: `mov-${Date.now()}-${line.ingredientId}`,
          dateLabel: buildDateLabel(''),
          type: 'Venta' as const,
          ingredientName: ingredient?.name ?? line.ingredientId,
          quantity: -line.boxes,
          reference,
        };
      }),
      ...prev,
    ]);

    return { ok: true, missing: [] };
  };

  const registerCancellation = (reference: string, lines: StockLine[]) => {
    if (lines.length === 0) return;

    setIngredients((prev) =>
      prev.map((i) => {
        const line = lines.find((l) => l.ingredientId === i.id);
        return line ? { ...i, stock: roundBoxes(i.stock + line.boxes) } : i;
      })
    );
    setMovements((prev) => [
      ...lines.map((line) => {
        const ingredient = ingredients.find((i) => i.id === line.ingredientId);
        return {
          id: `mov-${Date.now()}-${line.ingredientId}`,
          dateLabel: buildDateLabel(''),
          type: 'Cancelación' as const,
          ingredientName: ingredient?.name ?? line.ingredientId,
          quantity: line.boxes,
          reference,
        };
      }),
      ...prev,
    ]);
  };

  return (
    <InventoryReactContext.Provider
      value={{ ingredients, movements, adjustStock, registerPurchase, registerSale, registerCancellation }}
    >
      {children}
    </InventoryReactContext.Provider>
  );
};
