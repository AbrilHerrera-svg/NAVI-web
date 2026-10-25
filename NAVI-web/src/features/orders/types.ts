export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'Bebidas' | 'Cocina' | 'Postres';
  categoryLabel: string;
  size?: string;
  price: number;
}

export interface SelectedItemExtra {
  extraId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  extras: SelectedItemExtra[];
}