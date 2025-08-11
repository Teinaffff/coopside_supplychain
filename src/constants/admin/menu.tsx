import {
  LucideHome,
  User,
  Users
} from "lucide-react";

export const menuItems = [
  {
    label: "Home",
    to: "/admin",
    pathname: "/admin",
    icon: <LucideHome width={18} height={18} />,
  },
  {
    label: "Agents",
    to: "/admin/agents",
    pathname: "/admin/agents",
    icon: <User width={18} height={18} />,
  },
  {
    label: "Primary Cooperatives",
    to: "/admin/pc",
    pathname: "/admin/pc",
    icon: <Users width={18} height={18} />,
  },
  {
    label: "Consumers",
    to: "/admin/consumers",
    pathname: "/admin/consumers",
    icon: <User width={18} height={18} />,
  },
  {
    label: "Reports",
    to: "/admin/reports",
    pathname: "/admin/reports",
    icon: <Users width={18} height={18} />,
  },
];
