import { LucideIcon } from "lucide-react";


export interface StatCardProps {
  title: string;
  value: number;
  change: number;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
}