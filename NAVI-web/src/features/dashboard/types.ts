import type { AlertTagColor } from "../../components/ui/AlertCard";

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