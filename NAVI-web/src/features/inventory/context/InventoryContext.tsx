import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { errorMessage } from '../../../lib/api';
import { todayISO, formatIsoDateEs } from '../../../lib/date';
import { mockRecipesByExtraId } from '../data/recipesMock';
import {
  adjustStockApi,
  createIngredientApi,
  deleteIngredientApi,
  listIngredientsApi,
  listMovementsApi,
  listRecipesApi,
  registerConsumptionApi,
  registerPurchaseApi,
  saveRecipeApi,
  updateIngredientApi,
  type IngredientRecord,
} from '../services/inventoryService';
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
  const [records, setRecords] = useState<IngredientRecord[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [recipesByProductId, setRecipesByProductId] = useState<Record<string, RecipeLine[]>>({});

  // Productos del menú que usan cada ingrediente, calculado con las recetas guardadas
  const ingredients: InventoryIngredient[] = useMemo(
    () =>
      records.map((record) => ({
        ...record,
        dependentProducts: Object.values(recipesByProductId).filter((lines) =>
          lines.some((line) => line.ingredientId === record.id)
        ).length,
      })),
    [records, recipesByProductId]
  );

  // El servidor es la fuente de verdad: existencias y movimientos se vuelven a cargar
  // después de cada cambio, así los folios, horas e ids reales reemplazan a los locales.
  const reload = useCallback(async () => {
    try {
      const [loadedIngredients, loadedMovements] = await Promise.all([listIngredientsApi(), listMovementsApi()]);
      setRecords(loadedIngredients);
      setMovements(loadedMovements);
    } catch (error) {
      console.warn('No se pudo cargar el inventario:', error);
    }
  }, []);

  // carga inicial al abrir la app
  useEffect(() => {
    Promise.all([listIngredientsApi(), listMovementsApi()])
      .then(([loadedIngredients, loadedMovements]) => {
        setRecords(loadedIngredients);
        setMovements(loadedMovements);
      })
      .catch((error) => console.warn('No se pudo cargar el inventario:', error));
    listRecipesApi()
      .then(setRecipesByProductId)
      .catch((error) => console.warn('No se pudieron cargar las recetas:', error));
  }, []);

  // Los cambios se ven al instante; esto los guarda y, pase lo que pase, recarga lo real.
  const persist = (action: Promise<unknown>) => {
    action
      .catch((error) => alert(`No se pudo guardar en el servidor: ${errorMessage(error)}`))
      .finally(() => void reload());
  };

  const adjustStock = (input: StockAdjustmentInput) => {
    const ingredient = ingredients.find((i) => i.id === input.ingredientId);
    if (!ingredient) return;

    const difference = roundBoxes(input.countedBoxes - ingredient.stock);

    setRecords((prev) => prev.map((i) => (i.id === ingredient.id ? { ...i, stock: input.countedBoxes } : i)));
    setMovements((prev) => [
      {
        id: `tmp-${Date.now()}`,
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

    persist(adjustStockApi(input));
  };

  const registerPurchase = (input: PurchaseInput) => {
    const ingredient = ingredients.find((i) => i.id === input.ingredientId);
    if (!ingredient) return;

    setRecords((prev) =>
      prev.map((i) => (i.id === ingredient.id ? { ...i, stock: roundBoxes(i.stock + input.receivedBoxes) } : i))
    );
    setMovements((prev) => [
      {
        id: `tmp-${Date.now()}`,
        date: input.date || todayISO(),
        dateLabel: buildDateLabel(input.date),
        type: 'Compra',
        ingredientName: ingredient.name,
        quantity: input.receivedBoxes,
        reference: `${input.supplier} · $${input.totalCost.toLocaleString('es-MX')}`,
        notes: input.notes || undefined,
      },
      ...prev,
    ]);

    // el folio PUR-### lo asigna el servidor; aparece al recargar
    persist(registerPurchaseApi(input));
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

    setRecords((prev) =>
      prev.map((i) => {
        const line = lines.find((l) => l.ingredientId === i.id);
        return line ? { ...i, stock: roundBoxes(i.stock - line.boxes) } : i;
      })
    );
    setMovements((prev) => [
      ...lines.map((line) => {
        const ingredient = ingredients.find((i) => i.id === line.ingredientId);
        return {
          id: `tmp-${Date.now()}-${line.ingredientId}`,
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

    persist(registerConsumptionApi({ type: 'Venta', reference, date: todayISO(), lines }));

    return { ok: true, missing: [] };
  };

  const registerCancellation = (reference: string, lines: StockLine[]) => {
    if (lines.length === 0) return;

    setRecords((prev) =>
      prev.map((i) => {
        const line = lines.find((l) => l.ingredientId === i.id);
        return line ? { ...i, stock: roundBoxes(i.stock + line.boxes) } : i;
      })
    );
    setMovements((prev) => [
      ...lines.map((line) => {
        const ingredient = ingredients.find((i) => i.id === line.ingredientId);
        return {
          id: `tmp-${Date.now()}-${line.ingredientId}`,
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

    persist(registerConsumptionApi({ type: 'Cancelación', reference, date: todayISO(), lines }));
  };

  const createIngredient = (input: NewIngredientInput) => {
    setRecords((prev) => [
      ...prev,
      {
        id: `tmp-${Date.now()}`,
        name: input.name,
        unit: input.unit,
        unitsPerBox: input.unitsPerBox,
        costPerBox: input.costPerBox,
        minStock: input.minStock,
        stock: input.initialStock,
      },
    ]);

    // el servidor registra el movimiento "Alta de ingrediente" si hay existencia inicial
    persist(createIngredientApi(input));
  };

  const updateIngredient = (id: string, input: UpdateIngredientInput) => {
    setRecords((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, name: input.name, unit: input.unit, unitsPerBox: input.unitsPerBox, costPerBox: input.costPerBox, minStock: input.minStock }
          : i
      )
    );
    persist(updateIngredientApi(id, input));
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

    setRecords((prev) => prev.filter((i) => i.id !== id));
    persist(deleteIngredientApi(id));
    return { ok: true };
  };

  const updateRecipe = (productId: string, lines: RecipeLine[]) => {
    setRecipesByProductId((prev) => ({ ...prev, [productId]: lines }));
    saveRecipeApi(productId, lines).catch((error) => {
      alert(`No se pudo guardar la receta: ${errorMessage(error)}`);
      listRecipesApi().then(setRecipesByProductId).catch(() => undefined);
    });
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