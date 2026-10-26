import type { AlertCardItem, MetricCardItem, TopProductItem, OutOfStockItem, LowStockItem, HourlySalesItem, PaymentMethodItem, WeeklyFinanceItem,
  UpcomingExpenseItem, QueueStatusItem, TaskItem, ShiftItem
 } from "../types";

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

export const mockQuickMetricsWeek: MetricCardItem[] = [
  { label: 'Ventas de la semana', value: '$26,940', sub: '+8% vs. la semana pasada' },
  { label: 'Pedidos', value: '612', sub: '401 app · 211 mostrador' },
  { label: 'Ticket promedio', value: '$44.02', sub: '+2% vs. la semana pasada' },
  { label: 'Tiempo de prep.', value: '9 min', sub: 'dentro de lo estimado' },
  { label: 'Utilidad estimada', value: '$7,850', sub: 'margen 29%' },
  { label: 'Productos agotados', value: '5', sub: 'distintos esta semana', isAlert: true },
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

export const mockHourlySales: HourlySalesItem[] = [
  { hour: '8h', height: 'h-8' },
  { hour: '9h', height: 'h-12' },
  { hour: '10h', height: 'h-32', peak: true },
  { hour: '11h', height: 'h-20' },
  { hour: '12h', height: 'h-10' },
  { hour: '1h', height: 'h-24' },
  { hour: '2h', height: 'h-14' },
];

export const mockPaymentMethods: PaymentMethodItem[] = [
  { label: 'Efectivo', amount: '$1,860 · 43%', percent: 43, tone: 'solid' },
  { label: 'Terminal de tarjeta', amount: '$1,620 · 38%', percent: 38, tone: 'medium' },
  { label: 'Transferencia', amount: '$800 · 19%', percent: 19, tone: 'light' },
];

export const mockWeeklyFinance: WeeklyFinanceItem[] = [
  { ingresos: 40, gastos: 18 },
  { ingresos: 65, gastos: 29 },
  { ingresos: 55, gastos: 25 },
  { ingresos: 80, gastos: 36 },
  { ingresos: 95, gastos: 43 },
  { ingresos: 70, gastos: 32 },
  { ingresos: 85, gastos: 38 },
];

export const mockUpcomingExpenses: UpcomingExpenseItem[] = [
  { label: 'Rent · Nov 1', amount: '$1,800' },
  { label: 'Proveedor de lácteos · vence 3 nov', amount: '$620 · pendiente', pending: true },
];

export const mockQueueStatus: QueueStatusItem[] = [
  { label: 'Nuevo', count: 2 },
  { label: 'En preparación', count: 2 },
  { label: 'Listo', count: 1 },
  { label: 'Por cobrar', count: 1 },
  { label: 'Cancelados hoy', count: 1, isAlert: true },
];

export const mockTodayTasks: TaskItem[] = [
  { label: 'Apertura · Barista · 9:00 a. m.', status: 'completed' },
  { label: 'Inventario de leche · Cocina · 6:00 p. m.', status: 'pending' },
  { label: 'Limpieza de cierre · Cocina · 9:00 p. m.', status: 'pending' },
  { label: 'Cierre de caja · Venceño · 9:30 p. m.', status: 'blocked' },
];

export const mockTodayShift: ShiftItem[] = [
  { role: 'Venceño · Abril Herrera', active: true },
  { role: 'Cajero', active: true },
  { role: 'Barista', active: true },
  { role: 'Cocina', active: false, detail: 'Inicia 3:00 p. m.' },
];