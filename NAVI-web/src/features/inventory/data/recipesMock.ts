import type { RecipeLine } from '../types';

// Receta por producto, usando los ids del catálogo de pedidos (OrderCatalog)
// y los ingredientId reales de inventario (mockIngredients). Los productos
// sin receta registrada (ej. platillos de cocina aún no capturados) no
// descuentan inventario todavía.
export const mockRecipesByProductId: Record<string, RecipeLine[]> = {
  '1': [
    // Chai Milk Tea
    { ingredientId: 'ing-1', amountMed: 220, amountGde: 300 },
    { ingredientId: 'ing-3', amountMed: 10, amountGde: 12 },
  ],
  '2': [
    // Taro Smoothie
    { ingredientId: 'ing-1', amountMed: 180, amountGde: 260 },
  ],
  '3': [
    // Mango Fruit Tea
    { ingredientId: 'ing-3', amountMed: 8, amountGde: 10 },
  ],
};

// Extras del pedido (toppings) también consumen inventario
export const mockRecipesByExtraId: Record<string, RecipeLine> = {
  'top-1': { ingredientId: 'ing-4', amountSingle: 1 },
};
