import { useState, type ReactNode } from 'react';
import { todayISO, formatIsoDateEs } from '../../../lib/date';
import { mockIngredients, mockMovements, mockNextPurchaseFolio } from '../data/inventoryMock';
import { mockRecipesByExtraId, mockRecipesByProductId } from '../data/recipesMock';
import {
  roundBoxes,
  type InventoryIngredient,
  type InventoryMovement,
  type NewIngredientInput,
  type PurchaseInput,
  type RecipeLine,
  type StockAdjustmentInput,
  type UpdateIngredientInput,
} from '../types';
import { InventoryReactContext, type DeleteResult, type SaleResult, type StockLine } from './useInventory';

// Verdadero si algún producto o extra del catálogo usa este ingrediente en su receta.
const isUsedInRecipe = (ingredientId: string, recipesByProductId: Record<string, RecipeLine[]>) => {
  const inProducts = Object.values(recipesByProductId).some((lines) =>
    lines.some((line) => line.ingredientId === ingredientId)
  );
  const inExtras = Object.values(mockRecipesByExtraId).some((line) => line.ingredientId === ingredientId);
  return inProducts || inExtras;
};

// Etiqueta de fecha para movimientos nuevos: la fecha (capturada o de hoy) + hora actual.
const buildDateLabel = (isoDate: string) => {
  const time = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${formatIsoDateEs(isoDate || todayISO())} · ${time}`;
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [ingredients, setIngredients] = useState<InventoryIngredient[]>(mockIngredients);
  const [movements, setMovements] = useState<InventoryMovement[]>(mockMovements);
  const [purchaseFolio, setPurchaseFolio] = useState(mockNextPurchaseFolio);
  const [recipesByProductId, setRecipesByProductId] =
    useState<Record<string, RecipeLine[]>>(mockRecipesByProductId);

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
        date: input.date || todayISO(),
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
        date: input.date || todayISO(),
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
          date: todayISO(),
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
          date: todayISO(),
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

  const createIngredient = (input: NewIngredientInput) => {
    const id = `ing-${Date.now()}`;
    setIngredients((prev) => [
      ...prev,
      {
        id,
        name: input.name,
        unit: input.unit,
        unitsPerBox: input.unitsPerBox,
        costPerBox: input.costPerBox,
        minStock: input.minStock,
        stock: input.initialStock,
        dependentProducts: 0,
      },
    ]);

    if (input.initialStock > 0) {
      setMovements((prev) => [
        {
          id: `mov-${Date.now()}`,
          date: todayISO(),
          dateLabel: buildDateLabel(''),
          type: 'Ajuste',
          ingredientName: input.name,
          quantity: input.initialStock,
          reference: 'Alta de ingrediente · existencia inicial',
        },
        ...prev,
      ]);
    }
  };

  const updateIngredient = (id: string, input: UpdateIngredientInput) => {
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, name: input.name, unit: input.unit, unitsPerBox: input.unitsPerBox, costPerBox: input.costPerBox, minStock: input.minStock }
          : i
      )
    );
  };

  const deleteIngredient = (id: string): DeleteResult => {
    const ingredient = ingredients.find((i) => i.id === id);
    if (!ingredient) return { ok: false, reason: 'El ingrediente ya no existe.' };
    if (isUsedInRecipe(id, recipesByProductId)) {
      return { ok: false, reason: 'Está en la receta de uno o más productos; quítalo de ahí primero.' };
    }
    if (ingredient.stock !== 0) {
      return { ok: false, reason: 'Tiene existencia distinta de cero; ajústala a 0 antes de eliminarlo.' };
    }

    setIngredients((prev) => prev.filter((i) => i.id !== id));
    return { ok: true };
  };

  const updateRecipe = (productId: string, lines: RecipeLine[]) => {
    setRecipesByProductId((prev) => ({ ...prev, [productId]: lines }));
  };

  return (
    <InventoryReactContext.Provider
      value={{
        ingredients,
        movements,
        adjustStock,
        registerPurchase,
        registerSale,
        registerCancellation,
        createIngredient,
        updateIngredient,
        deleteIngredient,
        recipesByProductId,
        updateRecipe,
      }}
    >
      {children}
    </InventoryReactContext.Provider>
  );
};
