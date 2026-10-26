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