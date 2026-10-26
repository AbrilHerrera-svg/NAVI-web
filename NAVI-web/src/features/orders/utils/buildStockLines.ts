import type { CartItem } from '../types';
import {
  amountToBoxes,
  mockRecipesByExtraId,
  type InventoryIngredient,
  type RecipeLine,
  type StockLine,
} from '../../inventory';

// Cuántas unidades (en la unidad nativa del ingrediente) consume una línea de receta
// según el tamaño del producto vendido.
const amountForSize = (line: RecipeLine, size?: string) => {
  if (size === 'GDE') return line.amountGde;
  if (size === 'MED') return line.amountMed;
  return line.amountSingle;
};

// Convierte un carrito/pedido en líneas de consumo por ingrediente (en cajas), sumando
// el consumo cuando dos productos/extras comparten el mismo ingrediente. Los productos
// sin receta registrada en recipesByProductId no descuentan inventario. recipesByProductId
// debe venir del InventoryContext (useInventory) para reflejar ediciones recientes a la receta.
export const buildStockLines = (
  cart: CartItem[],
  ingredients: InventoryIngredient[],
  recipesByProductId: Record<string, RecipeLine[]>
): StockLine[] => {
  const boxesByIngredient = new Map<string, number>();

  const addBoxes = (ingredientId: string, boxes: number) => {
    if (boxes <= 0) return;
    boxesByIngredient.set(ingredientId, (boxesByIngredient.get(ingredientId) ?? 0) + boxes);
  };

  for (const item of cart) {
    const recipe = recipesByProductId[item.product.id] ?? [];
    for (const line of recipe) {
      const ingredient = ingredients.find((i) => i.id === line.ingredientId);
      const amount = amountForSize(line, item.product.size);
      if (!ingredient || !amount) continue;
      addBoxes(ingredient.id, amountToBoxes(ingredient, amount) * item.quantity);
    }

    for (const extra of item.extras) {
      // Los extras (toppings) son independientes del tamaño del producto: siempre usan amountSingle.
      const extraLine = mockRecipesByExtraId[extra.extraId];
      const ingredient = extraLine && ingredients.find((i) => i.id === extraLine.ingredientId);
      const amount = extraLine?.amountSingle;
      if (!ingredient || !amount) continue;
      addBoxes(ingredient.id, amountToBoxes(ingredient, amount) * extra.quantity * item.quantity);
    }
  }

  return Array.from(boxesByIngredient, ([ingredientId, boxes]) => ({ ingredientId, boxes }));
};
