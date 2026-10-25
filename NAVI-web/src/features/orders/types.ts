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
}

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