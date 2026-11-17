import type { CartItem } from '../types';

// Tiempo de preparación de referencia en tienda: bebidas 5-10 min, alimentos (cocina y
// postres) 10-15 min.
const BEVERAGE_RANGE: [number, number] = [5, 10];
const FOOD_RANGE: [number, number] = [10, 15];
// Minutos que añade cada pedido pendiente por delante en la fila (Nuevo/En preparación).
const QUEUE_MINUTES_PER_ORDER: [number, number] = [2, 4];

export interface TimeEstimate {
  minMinutes: number;
  maxMinutes: number;
}

// El pedido queda listo cuando termina su producto más lento (bebidas y alimentos se
// preparan en paralelo en barra/cocina), más lo que suma la fila de pedidos por delante.
export const estimateOrderTime = (cart: CartItem[], pendingOrdersAhead: number): TimeEstimate => {
  if (cart.length === 0) return { minMinutes: 0, maxMinutes: 0 };

  let minMinutes = 0;
  let maxMinutes = 0;
  for (const item of cart) {
    const [itemMin, itemMax] = item.product.category === 'Bebidas' ? BEVERAGE_RANGE : FOOD_RANGE;
    minMinutes = Math.max(minMinutes, itemMin);
    maxMinutes = Math.max(maxMinutes, itemMax);
  }

  minMinutes += pendingOrdersAhead * QUEUE_MINUTES_PER_ORDER[0];
  maxMinutes += pendingOrdersAhead * QUEUE_MINUTES_PER_ORDER[1];
  return { minMinutes, maxMinutes };
};
