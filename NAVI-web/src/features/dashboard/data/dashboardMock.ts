import type { AlertCardItem, MetricCardItem, TopProductItem, OutOfStockItem, LowStockItem } from "../types";

export const mockUrgentAlerts: AlertCardItem[] = [
  { tag: 'Atrasado', tagColor: 'danger', count: 2, title: 'Pedidos atrasados / por vencer', desc: '#88 Chilaquiles rojos · atrasado +8 min', link: 'Ver Pedidos →' },
  { tag: 'Por vencer', tagColor: 'warning', count: 2, title: 'Ingredientes bajos / agotados', desc: 'Leche entera 4,200 ml · Jarabe de chocolate agotado', link: 'Ver Inventario →' },
  { tag: 'Pendiente', tagColor: 'warning', count: 1, title: 'Limpieza de cierre pendiente', desc: 'Lista de cierre incompleta', link: 'Ver Tareas →' },
  { tag: 'Pendiente', tagColor: 'warning', count: 2, title: 'Tareas de apertura / cierre pendientes', desc: '2 tareas sin completar', link: 'Ver Tareas →' },
  { tag: 'Revisar', tagColor: 'warning', count: 1, title: 'Caja abierta con diferencia', desc: 'Cierre pendiente · diferencia detectada', link: 'Ver Caja →' },
];



export const mockQuickMetrics: MetricCardItem[] = [
  { label: 'Ventas de hoy', value: '$4,280', sub: '+12% vs. el sábado pasado' },
  { label: 'Pedidos', value: '96', sub: '62 app · 34 mostrador' },
  { label: 'Ticket promedio', value: '$44.58', sub: '+4% vs. el mismo día' },
  { label: 'Tiempo de prep.', value: '9 min', sub: 'dentro de lo estimado' },
  { label: 'Utilidad estimada', value: '$1,240', sub: 'margen 29%' },
  { label: 'Productos agotados', value: '3', sub: '+1 vs. el mismo día', isAlert: true },
];

export const mockTopProducts: TopProductItem[] = [
  { name: 'Chai Milk Tea GDE', count: 24 },
  { name: 'Taro Smoothie MED', count: 18 },
  { name: 'Chilaquiles rojos', count: 15 },
  { name: 'Mango Fruit Tea MED', count: 12 },
  { name: 'Crepas de Nutella', count: 9 },
];

export const mockOutOfStock: OutOfStockItem[] = [
  { name: 'Coconut Milk Tea', status: 'agotado' },
  { name: 'Biscoff Smoothie', status: 'agotado 6:40 p. m.' },
  { name: 'Waffle Dulce', status: 'agotado 7:10 p. m.' },
];

export const mockLowStock: LowStockItem[] = [
  { name: 'Leche entera', detail: '4,200 de 6,000 ml', time: '~2 días', isUrgent: false },
  { name: 'Jarabe de chocolate', detail: '0 ml', time: 'agotado', isUrgent: true },
  { name: 'Base de té', detail: '900 de 500 g', time: '~4 días', isUrgent: false },
];
