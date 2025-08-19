import {
  Building2,
  Factory,
  FileBarChart,
  LucideHome,
  User2,
  UserCircle2,
  Users2,
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
    icon: <UserCircle2 width={18} height={18} />,
  },
  {
    label: "Sellers",
    to: "/admin/seller",
    pathname: "/admin/seller",
    icon: <Users2 width={18} height={18} />,
  },
  {
    label: "Factories",
    to: "/admin/factories",
    pathname: "/admin/factories",
    icon: <Factory width={18} height={18} />,
  },
  {
    label: "Institutions",
    to: "/admin/institutions",
    pathname: "/admin/institutions",
    icon: <Building2 width={18} height={18} />,
  },
  {
    label: "Consumers",
    to: "/admin/consumers",
    pathname: "/admin/consumers",
    icon: <User2 width={18} height={18} />,
  },
  {
    label: "Reports",
    to: "/admin/reports",
    pathname: "/admin/reports",
    icon: <FileBarChart width={18} height={18} />,
  },
  {
    label: "Logs",
    to: "/admin/logs",
    pathname: "/admin/logs",
    icon: <FileBarChart width={18} height={18} />,
  },
];
