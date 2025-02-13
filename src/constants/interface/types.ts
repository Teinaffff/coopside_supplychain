import { LucideIcon } from "lucide-react";


export interface StatCardProps {
  title: string;
  value: number;
  change: number;
  trend: string;
  icon: LucideIcon;
  color: string;
}
