import {
  LucideHome,
  User,
  Users
} from "lucide-react";

export const menuItems = [
  {
    label: "Home",
    to: "/pc",
    pathname: "/pc",
    icon: <LucideHome width={18} height={18} />,
  },
  {
    label: "Profile",
    to: "/pc/profile",
    pathname: "/pc/profile",
    icon: <User width={18} height={18} />,
  },
  {
    label: "Members",
    to: "/pc/members",
    pathname: "/pc/members",
    icon: <Users width={18} height={18} />,
  },
];
