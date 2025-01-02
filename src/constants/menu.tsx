import { LucideHome, School, Users } from "lucide-react";

export const menuItems = [
  {
    label: "Home",
    to: "/dashboard",
    pathname: "/dashboard",
    icon: <LucideHome width={18} height={18} />,
  },
  {
    label: "Members",
    to: "/members",
    pathname: "members",
    icon: <Users width={18} height={18} />,
  },
];
