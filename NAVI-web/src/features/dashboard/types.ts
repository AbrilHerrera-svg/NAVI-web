import type { AlertTagColor } from "../../components/ui/AlertCard";
import type { ProgressBarTone } from "../../components/ui/ProgressBar";
import type { PageId } from "../../components/layout/Sidebar";
import type { OrderItemRecord } from "../orders/types";
import type { IngredientRecord } from "../inventory/types";
import type { MenuItem } from "../menu/types";
import type { Task } from "../tasks/types";
import type { UserRecord } from "../users/types";
import type { CashSessionRecord } from "../cash-register/types";

export type DashboardPeriod = "hoy" | "semana";


export interface MetricCardItem {
  label: string;
  value: string;
  sub: string;
  isAlert?: boolean;
}

export interface AlertCardItem {
  tag: string;
  tagColor: AlertTagColor;
  count: number;
  title: string;
  desc: string;
  link: string;
  target: PageId; // página a la que lleva el enlace
}

export interface TopProductItem {
  name: string;
  count: number;
}

export interface OutOfStockItem {
  name: string;
  status: string;
}

export interface LowStockItem {
  name: string;
  detail: string;
  time: string;
  isUrgent: boolean;
}

export interface HourlySalesItem {
  hour: string;
  amount: number;
  peak?: boolean;
}


export interface PaymentMethodItem {
  label: string;
  amount: string;
  percent: number;
  tone: ProgressBarTone;
}

export interface WeeklyFinanceItem {
  day: string;
  ingresos: number; // % de la barra más alta (0 a 100)
  gastos: number; // % de la barra más alta (0 a 100)
}

export interface UpcomingExpenseItem {
  label: string;
  amount: string;
  pending?: boolean;
}

export interface QueueStatusItem {
  label: string;
  count: number;
  isAlert?: boolean;
}

export type TaskStatus = "completed" | "pending" | "blocked";

export interface TaskItem {
  label: string;
  status: TaskStatus;
}

export interface ShiftItem {
  role: string;
  active: boolean;
  detail?: string; // ej. "Inicia 3:00 p. m." cuando no está activo
}

export interface LateOrderItem {
  id: string;
  label: string;
  statusLabel: string;
  urgent: boolean;
}

// Datos crudos que devuelve el backend para armar el inicio.
export interface DashboardSource {
  orders: OrderItemRecord[];
  ingredients: IngredientRecord[];
  menu: MenuItem[];
  tasks: Task[]; // tareas de hoy
  users: UserRecord[];
  cashToday: CashSessionRecord | null;
  cashWeek: CashSessionRecord[]; // sesiones de los últimos 7 días (solo las que existen)
}

// Todo lo que pintan los componentes del inicio, ya calculado.
export interface DashboardData {
  alerts: AlertCardItem[];
  metrics: MetricCardItem[];
  queue: QueueStatusItem[];
  lateOrders: LateOrderItem[];
  topProducts: TopProductItem[];
  outOfStock: OutOfStockItem[];
  lowStock: LowStockItem[];
  todayTasks: TaskItem[];
  cleaningSummary: string;
  todayShift: ShiftItem[];
  hourlySales: HourlySalesItem[];
  paymentMethods: PaymentMethodItem[];
  weeklyFinance: WeeklyFinanceItem[];
  upcomingExpenses: UpcomingExpenseItem[];
}
