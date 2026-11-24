import { lastDaysISO, weekdayShortEs } from "../../../lib/date";
import type { CashSessionRecord } from "../../cash-register/types";
import { getStockStatus } from "../../inventory/types";
import type { OrderItemRecord, OrderStatus } from "../../orders/types";
import { formatTime12 } from "../../tasks/types";
import { getShiftStatus, roleLabel } from "../../users/types";
import type {
  AlertCardItem,
  DashboardData,
  DashboardPeriod,
  DashboardSource,
  HourlySalesItem,
  LateOrderItem,
  LowStockItem,
  MetricCardItem,
  OutOfStockItem,
  PaymentMethodItem,
  QueueStatusItem,
  ShiftItem,
  TaskItem,
  TopProductItem,
  UpcomingExpenseItem,
  WeeklyFinanceItem,
} from "../types";

// ---------- utilidades ----------

// 4280 → "$4,280" · 44.5 → "$44.50" · -115 → "-$115"
const money = (value: number) =>
  `${value < 0 ? "-" : ""}$${Math.abs(value).toLocaleString("es-MX", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

const sum = (items: { amount: number }[] = []) => items.reduce((total, item) => total + item.amount, 0);

const percent = (value: number, total: number) => (total > 0 ? Math.round((value / total) * 100) : 0);

// Un pedido cuenta como venta cuando ya se cobró: no está "Nuevo" (por cobrar) ni "Cancelado".
const isSold = (order: OrderItemRecord) => order.status !== "Nuevo" && order.status !== "Cancelado";

// "1:40 p. m." → 13 · "14:10" → 14 · sin hora válida → null
const parseHour = (text: string) => {
  const match = text?.match(/(\d{1,2}):(\d{2})\s*([ap])?/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const suffix = match[3]?.toLowerCase();
  if (suffix === "p" && hour < 12) hour += 12;
  if (suffix === "a" && hour === 12) hour = 0;
  return hour;
};

// ---------- pedidos ----------

// "Vence 14:10" → atrasado si ya pasó esa hora, "por vencer" si faltan 5 min o menos.
const getDueStatus = (order: OrderItemRecord, now: Date) => {
  const match = order.dueTime?.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null; // "Por definir" y similares no cuentan

  const diff = now.getHours() * 60 + now.getMinutes() - (Number(match[1]) * 60 + Number(match[2]));
  if (diff > 0) return { label: `Atrasado +${diff} min`, urgent: true };
  if (diff >= -5) return { label: `Por vencer · ${-diff} min`, urgent: false };
  return null;
};

const buildLateOrders = (orders: OrderItemRecord[], now: Date): LateOrderItem[] =>
  orders
    .filter((o) => o.status === "Nuevo" || o.status === "En preparación")
    .flatMap((o) => {
      const due = getDueStatus(o, now);
      if (!due) return [];
      return [
        {
          id: o.id,
          label: `${o.orderNumber} · ${o.productsSummary} · ${o.origin}`,
          statusLabel: due.label,
          urgent: due.urgent,
        },
      ];
    });

const QUEUE_STATUSES: OrderStatus[] = ["Nuevo", "En preparación", "Listo", "Recogido", "Cancelado"];

const buildQueue = (orders: OrderItemRecord[]): QueueStatusItem[] =>
  QUEUE_STATUSES.map((status) => ({
    label: status === "Nuevo" ? "Nuevo (por cobrar)" : status,
    count: orders.filter((o) => o.status === status).length,
    isAlert: status === "Cancelado",
  }));

const buildTopProducts = (orders: OrderItemRecord[]): TopProductItem[] => {
  const totals = new Map<string, number>();

  for (const order of orders) {
    if (order.status === "Cancelado") continue;
    for (const line of order.cart ?? []) {
      const name = line.product.size ? `${line.product.name} ${line.product.size}` : line.product.name;
      totals.set(name, (totals.get(name) ?? 0) + line.quantity);
    }
  }

  return [...totals.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

// ---------- inventario ----------

const buildOutOfStock = (source: DashboardSource): OutOfStockItem[] =>
  source.menu
    .filter((item) => item.status === "Activo" && !item.available)
    .map((item) => ({ name: item.name, status: "agotado" }));

const buildLowStock = (source: DashboardSource): LowStockItem[] =>
  source.ingredients
    .filter((ing) => getStockStatus(ing) !== "Disponible")
    .map((ing) => {
      const soldOut = getStockStatus(ing) === "Agotado";
      return {
        name: ing.name,
        detail: `${ing.stock} de ${ing.minStock} cajas`,
        time: soldOut ? "agotado" : "bajo",
        isUrgent: soldOut,
      };
    });

// ---------- tareas y equipo ----------

const buildTodayTasks = (source: DashboardSource): TaskItem[] => {
  const nameOf = (id: string) => source.users.find((u) => u.id === id)?.name ?? "Sin asignar";

  return [...source.tasks]
    .sort((a, b) => a.dueTime.localeCompare(b.dueTime))
    .map((task) => ({
      label: `${task.name} · ${nameOf(task.assigneeId)} · ${formatTime12(task.dueTime)}`,
      status: task.done ? "completed" : "pending",
    }));
};

// "Cocina ✓ · Barra pendiente"
const buildCleaningSummary = (source: DashboardSource) => {
  const cleaning = source.tasks.filter((t) => t.category === "Limpieza");
  if (cleaning.length === 0) return "Sin tareas de limpieza hoy";

  const areas = [...new Set(cleaning.map((t) => t.area ?? "General"))];
  return (
    "Limpieza por área: " +
    areas
      .map((area) => {
        const done = cleaning.filter((t) => (t.area ?? "General") === area).every((t) => t.done);
        return done ? `${area} ✓` : `${area} pendiente`;
      })
      .join(" · ")
  );
};

const buildTodayShift = (source: DashboardSource, now: Date): ShiftItem[] =>
  source.users
    .filter((u) => u.status === "Activo" && u.shift)
    .map((u) => {
      const shift = getShiftStatus(u.shift!, now.getHours());
      return { role: `${roleLabel(u.role)} · ${u.name}`, active: shift.active, detail: shift.label };
    });

// ---------- ventas y dinero ----------

const buildHourlySales = (orders: OrderItemRecord[]): HourlySalesItem[] => {
  const byHour = new Map<number, number>();

  for (const order of orders.filter(isSold)) {
    const hour = parseHour(order.receivedTime);
    if (hour !== null) byHour.set(hour, (byHour.get(hour) ?? 0) + order.total);
  }

  const items = [...byHour.entries()].sort((a, b) => a[0] - b[0]);
  const peak = Math.max(0, ...items.map(([, amount]) => amount));

  return items.map(([hour, amount]) => ({ hour: `${hour}h`, amount, peak: amount === peak }));
};

const TONES: PaymentMethodItem["tone"][] = ["solid", "medium", "light"];

const buildPaymentMethods = (orders: OrderItemRecord[]): PaymentMethodItem[] => {
  const byMethod = new Map<string, number>();

  for (const order of orders.filter(isSold)) {
    const method = order.paymentMethod ?? "Sin método";
    byMethod.set(method, (byMethod.get(method) ?? 0) + order.total);
  }

  const total = [...byMethod.values()].reduce((a, b) => a + b, 0);

  return [...byMethod.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, amount], i) => ({
      label,
      amount: `${money(amount)} · ${percent(amount, total)}%`,
      percent: percent(amount, total),
      tone: TONES[Math.min(i, TONES.length - 1)],
    }));
};

const buildWeeklyFinance = (cashWeek: CashSessionRecord[]): WeeklyFinanceItem[] => {
  const days = lastDaysISO(7).map((date) => {
    const session = cashWeek.find((s) => s.date === date);
    return { date, ingresos: sum(session?.salesByMethod), gastos: sum(session?.dailyExpenses) };
  });

  const max = Math.max(0, ...days.flatMap((d) => [d.ingresos, d.gastos]));

  return days.map((d) => ({
    day: weekdayShortEs(d.date),
    ingresos: percent(d.ingresos, max),
    gastos: percent(d.gastos, max),
  }));
};

const buildUpcomingExpenses = (cashToday: CashSessionRecord | null): UpcomingExpenseItem[] =>
  (cashToday?.dailyExpenses ?? []).map((e) => ({ label: e.label, amount: money(e.amount) }));

// ---------- métricas ----------

const buildTodayMetrics = (source: DashboardSource): MetricCardItem[] => {
  const { orders, cashToday } = source;
  const sold = orders.filter(isSold);
  const active = orders.filter((o) => o.status !== "Cancelado");

  const sales = sold.reduce((total, o) => total + o.total, 0);
  const expenses = sum(cashToday?.dailyExpenses);
  const profit = sales - expenses;
  const queue = orders.filter((o) => o.status === "Nuevo" || o.status === "En preparación").length;
  const soldOut = buildOutOfStock(source).length;

  return [
    { label: "Ventas de hoy", value: money(sales), sub: `${sold.length} pedidos cobrados` },
    {
      label: "Pedidos",
      value: String(active.length),
      sub: `${active.filter((o) => o.origin === "App").length} app · ${active.filter((o) => o.origin === "Mostrador").length} mostrador`,
    },
    {
      label: "Ticket promedio",
      value: sold.length > 0 ? money(sales / sold.length) : "$0",
      sub: "por pedido cobrado",
    },
    { label: "Pedidos en cola", value: String(queue), sub: "por cobrar o en preparación" },
    {
      label: "Utilidad estimada",
      value: money(profit),
      sub: sales > 0 ? `margen ${percent(profit, sales)}%` : "ventas menos gastos",
    },
    { label: "Productos agotados", value: String(soldOut), sub: "en el menú", isAlert: soldOut > 0 },
  ];
};

const buildWeekMetrics = (source: DashboardSource): MetricCardItem[] => {
  const week = source.cashWeek;
  const sales = week.reduce((total, s) => total + sum(s.salesByMethod), 0);
  const expenses = week.reduce((total, s) => total + sum(s.dailyExpenses), 0);
  const refunds = week.reduce((total, s) => total + sum(s.refunds), 0);
  const profit = sales - expenses;
  const closed = week.filter((s) => s.status === "Cerrado").length;
  const soldOut = buildOutOfStock(source).length;

  return [
    { label: "Ventas de la semana", value: money(sales), sub: `${week.length} días con caja` },
    { label: "Gastos de la semana", value: money(expenses), sub: "registrados en caja" },
    {
      label: "Utilidad estimada",
      value: money(profit),
      sub: sales > 0 ? `margen ${percent(profit, sales)}%` : "ventas menos gastos",
    },
    { label: "Reembolsos", value: money(refunds), sub: "de la semana", isAlert: refunds > 0 },
    { label: "Cajas cerradas", value: String(closed), sub: `de ${week.length} registradas` },
    { label: "Productos agotados", value: String(soldOut), sub: "en el menú", isAlert: soldOut > 0 },
  ];
};

// ---------- alertas ----------

const buildAlerts = (
  source: DashboardSource,
  lateOrders: LateOrderItem[],
  lowStock: LowStockItem[]
): AlertCardItem[] => {
  const alerts: AlertCardItem[] = [];
  const pending = (category: string) => source.tasks.filter((t) => t.category === category && !t.done);
  const openingClosing = [...pending("Apertura"), ...pending("Cierre")];
  const cleaning = pending("Limpieza");
  const cash = source.cashToday;

  if (lateOrders.length > 0) {
    alerts.push({
      tag: "Atrasado",
      tagColor: "danger",
      count: lateOrders.length,
      title: "Pedidos atrasados / por vencer",
      desc: lateOrders[0].label,
      link: "Ver Pedidos →",
      target: "orders",
    });
  }

  if (lowStock.length > 0) {
    alerts.push({
      tag: lowStock.some((i) => i.isUrgent) ? "Agotado" : "Por vencer",
      tagColor: lowStock.some((i) => i.isUrgent) ? "danger" : "warning",
      count: lowStock.length,
      title: "Ingredientes bajos / agotados",
      desc: lowStock.slice(0, 2).map((i) => i.name).join(" · "),
      link: "Ver Inventario →",
      target: "inventory",
    });
  }

  if (cleaning.length > 0) {
    alerts.push({
      tag: "Pendiente",
      tagColor: "warning",
      count: cleaning.length,
      title: "Limpieza pendiente",
      desc: cleaning.slice(0, 2).map((t) => t.name).join(" · "),
      link: "Ver Tareas →",
      target: "tasks",
    });
  }

  if (openingClosing.length > 0) {
    alerts.push({
      tag: "Pendiente",
      tagColor: "warning",
      count: openingClosing.length,
      title: "Tareas de apertura / cierre pendientes",
      desc: `${openingClosing.length} tareas sin completar`,
      link: "Ver Tareas →",
      target: "tasks",
    });
  }

  if (!cash) {
    alerts.push({
      tag: "Revisar",
      tagColor: "warning",
      count: 1,
      title: "Caja sin abrir",
      desc: "Aún no hay caja registrada hoy",
      link: "Ver Caja →",
      target: "cash-register",
    });
  } else if (cash.status === "Cerrado" && cash.closing && cash.closing.difference !== 0) {
    alerts.push({
      tag: "Revisar",
      tagColor: "danger",
      count: 1,
      title: "Caja cerrada con diferencia",
      desc: `Diferencia de ${money(cash.closing.difference)}`,
      link: "Ver Caja →",
      target: "cash-register",
    });
  }

  return alerts;
};

// ---------- principal ----------

// Convierte lo que devuelve el backend en lo que pintan los componentes del inicio.
// Función pura: mismos datos y misma hora → mismo resultado.
export const buildDashboard = (
  source: DashboardSource,
  period: DashboardPeriod,
  now: Date = new Date()
): DashboardData => {
  const lateOrders = buildLateOrders(source.orders, now);
  const lowStock = buildLowStock(source);

  return {
    alerts: buildAlerts(source, lateOrders, lowStock),
    metrics: period === "hoy" ? buildTodayMetrics(source) : buildWeekMetrics(source),
    queue: buildQueue(source.orders),
    lateOrders,
    topProducts: buildTopProducts(source.orders),
    outOfStock: buildOutOfStock(source),
    lowStock,
    todayTasks: buildTodayTasks(source),
    cleaningSummary: buildCleaningSummary(source),
    todayShift: buildTodayShift(source, now),
    hourlySales: buildHourlySales(source.orders),
    paymentMethods: buildPaymentMethods(source.orders),
    weeklyFinance: buildWeeklyFinance(source.cashWeek),
    upcomingExpenses: buildUpcomingExpenses(source.cashToday),
  };
};
