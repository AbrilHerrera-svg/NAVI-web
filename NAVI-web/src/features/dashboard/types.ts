export interface MetricCardItem {
  label: string;
  value: string;
  subtext?: string;
}

export interface AlertCardItem {
  tag: string;
  tagColor: 'red' | 'yellow' | 'purple' | 'orange';
  title: string;
  subtitle: string;
  actionText: string;
  count: number;
}