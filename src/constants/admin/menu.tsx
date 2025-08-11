import {
  LucideHome,
  UserCircle2,
  Users2,
  Factory,
  Building2,
  User2,
  FileBarChart
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
    label: "Primary Cooperatives",
    to: "/admin/pc",
    pathname: "/admin/pc",
    icon: <Users2 width={18} height={18} />,
  },
  {
    label: "Manufacturies",
    to: "/admin/manufacturies",
    pathname: "/admin/manufacturies",
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
];
