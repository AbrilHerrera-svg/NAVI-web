import type { AlertTagColor } from "../../components/ui/AlertCard";
import type { ProgressBarTone } from "../../components/ui/ProgressBar";

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
  height: string;
  peak?: boolean;
}


export interface PaymentMethodItem {
  label: string;
  amount: string;
  percent: number;
  tone: ProgressBarTone;
}

export interface WeeklyFinanceItem {
  ingresos: number;
  gastos: number;
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