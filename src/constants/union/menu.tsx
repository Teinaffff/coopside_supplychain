import { LucideHome, Users } from "lucide-react";

export const menuItems = [
  {
    label: "Home",
    to: "/union",
    pathname: "/union",
    icon: <LucideHome width={18} height={18} />,
  },
  {
    label: "Members",
    to: "/union/members",
    pathname: "/union/members",
    icon: <Users width={18} height={18} />,
  },
];
