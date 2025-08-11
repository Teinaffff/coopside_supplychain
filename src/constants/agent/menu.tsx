import { LucideHome, Users } from "lucide-react";

export const menuItems = [
  {
    label: "Home",
    to: "/agent",
    pathname: "/agent",
    icon: <LucideHome width={18} height={18} />,
  },
  {
    label: "Shares",
    to: "/agent/shares",
    pathname: "/agent/shares",
    icon: <Users width={18} height={18} />,
  },
];
