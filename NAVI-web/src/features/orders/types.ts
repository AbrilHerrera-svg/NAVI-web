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

export type OrderStatus = 'Nuevo' | 'En preparación' | 'Listo' | 'Recogido' | 'Cancelado';
export type OrderOrigin = 'App' | 'Mostrador';

export interface OrderItemRecord {
  id: string;
  orderNumber: string;
  origin: OrderOrigin;
  receivedTime: string;
  dueTime: string;
  dueStatusLabel?: string;
  dueStatusColor?: 'normal' | 'warning' | 'urgent' | 'ready';
  customerName?: string;
  productsSummary: string;
  total: number;
  status: OrderStatus;
  primaryActionLabel?: string;
  primaryActionColor?: 'default' | 'success';
  // Carrito estructurado del pedido, usado para descontar/restituir inventario al cobrar
  // o cancelar. Los pedidos sin receta registrada (ej. platillos de cocina) quedan sin
  // efecto en inventario aunque tengan línea aquí.
  cart?: CartItem[];
}

// Deriva la acción principal del pedido a partir de su estado actual,
// para que el botón siempre coincida con el estado real (no con un valor fijo del mock).
export const getPrimaryAction = (
  status: OrderStatus
): { label: string; color: 'default' | 'success' } | null => {
  switch (status) {
    case 'Nuevo':
      return { label: 'Cobrar', color: 'success' };
    case 'En preparación':
      return { label: 'Marcar listo', color: 'default' };
    case 'Listo':
      return { label: 'Entregar', color: 'default' };
    default:
      return null;
  }
};

export interface OrderExceptionItem {
  id: string;
  type: 'Producto agotado' | 'Pago rechazado' | 'No recogido' | 'Pedido duplicado';
  tag: string;
  tagColor: 'danger' | 'warning' | 'info' | 'ready';
  orderRef: string;
  description: string;
  metaLabel: string;
  metaValue: string;
  primaryAction: string;
  secondaryAction?: string;
}