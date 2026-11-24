import { apiFetch } from '../../../lib/api';
import { formatIsoDateEs } from '../../../lib/date';
import type {
  IngredientRecord,
  InventoryMovement,
  MovementType,
  NewIngredientInput,
  PurchaseInput,
  RecipeLine,
  StockAdjustmentInput,
  UpdateIngredientInput,
} from '../types';
import type { StockLine } from '../context/useInventory';

interface MovementApi {
  id: string;
  date: string;
  type: MovementType;
  ingredientName: string;
  quantity: number;
  reference: string;
  notes?: string | null;
  createdAt?: string | null;
}

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });

// Más reciente primero: por día y, dentro del día, por hora de registro
const byNewest = (a: MovementApi, b: MovementApi) =>
  b.date.localeCompare(a.date) || (b.createdAt ?? '').localeCompare(a.createdAt ?? '');

const toMovement = (m: MovementApi): InventoryMovement => ({
  id: m.id,
  date: m.date,
  dateLabel: `${formatIsoDateEs(m.date)}${m.createdAt ? ` · ${timeLabel(m.createdAt)}` : ''}`,
  type: m.type,
  ingredientName: m.ingredientName,
  quantity: m.quantity,
  reference: m.reference,
  notes: m.notes ?? undefined,
});

export const listIngredientsApi = async (): Promise<IngredientRecord[]> => {
  const items = await apiFetch<IngredientRecord[]>('/inventory/ingredients');
  return items.map((i) => ({
    id: i.id,
    name: i.name,
    stock: i.stock,
    minStock: i.minStock,
    costPerBox: i.costPerBox,
    unit: i.unit,
    unitsPerBox: i.unitsPerBox,
  }));
};

export const listMovementsApi = async (): Promise<InventoryMovement[]> =>
  (await apiFetch<MovementApi[]>('/inventory/movements')).sort(byNewest).map(toMovement);

export const listRecipesApi = async (): Promise<Record<string, RecipeLine[]>> =>
  apiFetch<Record<string, RecipeLine[]>>('/inventory/recipes');

export const createIngredientApi = async (input: NewIngredientInput): Promise<void> => {
  await apiFetch('/inventory/ingredients', { method: 'POST', body: input });
};

export const updateIngredientApi = async (id: string, input: UpdateIngredientInput): Promise<void> => {
  await apiFetch(`/inventory/ingredients/${id}`, { method: 'PUT', body: input });
};

export const deleteIngredientApi = async (id: string): Promise<void> => {
  await apiFetch(`/inventory/ingredients/${id}`, { method: 'DELETE' });
};

export const adjustStockApi = async (input: StockAdjustmentInput): Promise<void> => {
  await apiFetch('/inventory/adjustments', { method: 'POST', body: input });
};

export const registerPurchaseApi = async (input: PurchaseInput): Promise<void> => {
  await apiFetch('/inventory/purchases', { method: 'POST', body: input });
};

// Venta (descuenta) o cancelación (restituye): el servidor lo aplica todo o nada
export const registerConsumptionApi = async (input: {
  type: 'Venta' | 'Cancelación';
  reference: string;
  date: string;
  lines: StockLine[];
}): Promise<void> => {
  await apiFetch('/inventory/consumption', { method: 'POST', body: input });
};

export const saveRecipeApi = async (productId: string, lines: RecipeLine[]): Promise<void> => {
  await apiFetch(`/inventory/recipes/${productId}`, { method: 'PUT', body: { lines } });
};