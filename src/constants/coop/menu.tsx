import { LucideHome, Users } from "lucide-react";

export const menuItems = [
  {
    label: "Home",
    to: "/coop",
    pathname: "/coop",
    icon: <LucideHome width={18} height={18} />,
  },
  {
    label: "Requests",
    to: "/coop/requests",
    pathname: "/coop/requests",
    icon: <Users width={18} height={18} />,
  },
  {
    label: "Reports",
    to: "/coop/reports",
    pathname: "/coop/reports",
    icon: <Users width={18} height={18} />,
  },
];
