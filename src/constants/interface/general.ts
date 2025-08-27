
export interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: string;
  index?: number;
  primaryLabel?: string;
  secondaryValue?: string | number;
  secondaryLabel?: string;
}
