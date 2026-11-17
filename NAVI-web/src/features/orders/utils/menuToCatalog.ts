import type { MenuItem } from '../../menu';
import type { ProductItem } from '../types';

const inferCategory = (menuCategory: string): ProductItem['category'] => {
  if (menuCategory.startsWith('Cocina')) return 'Cocina';
  if (menuCategory === 'Postres') return 'Postres';
  return 'Bebidas';
};

// Convierte un producto del Menú en las variantes que se pueden vender en Nuevo pedido.
// Toda bebida con MED y/o GDE genera una tarjeta por tamaño (no se puede vender sin
// tamaño); un platillo con precio único genera una sola variante sin tamaño. El id se
// conserva igual al del Menú para que coincida con recipesByProductId.
export const menuItemToProductVariants = (item: MenuItem): ProductItem[] => {
  const category = inferCategory(item.category);
  const base = { id: item.id, name: item.name, category, categoryLabel: item.category };
  const variants: ProductItem[] = [];

  if (item.priceMed != null) variants.push({ ...base, size: 'MED', price: item.priceMed });
  if (item.priceGde != null) variants.push({ ...base, size: 'GDE', price: item.priceGde });
  if (item.priceSingle != null) variants.push({ ...base, price: item.priceSingle });

  return variants;
};
