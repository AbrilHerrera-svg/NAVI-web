export type MenuTab = 'lista' | 'tarjetas' | 'promociones';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceMed?: number;
  priceGde?: number;
  priceSingle?: number;
  prepTime: string;
  available: boolean;
  status: 'Activo' | 'Inactivo' | 'Archivado';
}

export interface PromotionItem {
  id: string;
  name: string;
  appliesTo: string;
  discount: string;
  price?: number;
  schedule: string;
  period?: string;
  status: 'Activo' | 'Programado' | 'Terminado';
  active: boolean;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  unit: string;
  costPerUnit: string;
  amountMed?: string;
  costMed?: string;
  amountGde?: string;
  costGde?: string;
}