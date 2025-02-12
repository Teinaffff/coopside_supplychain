import { LucideHome, Users } from "lucide-react";

export const menuItems = [
  {
    label: "Home",
    to: "/member",
    pathname: "/member",
    icon: <LucideHome width={18} height={18} />,
  },
  {
    label: "Shares",
    to: "/member/shares",
    pathname: "/member/shares",
    icon: <Users width={18} height={18} />,
  },
];
