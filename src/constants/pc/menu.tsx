import {
  Banknote,
  Building2,
  Coins,
  Crown,
  FileCheck,
  FileText,
  Image,
  LucideHome,
  PieChart,
  Settings,
  User,
  Users,
} from "lucide-react";

export const menuItems = [
  {
    label: "Home",
    to: "/pc",
    pathname: "/pc",
    icon: <LucideHome width={18} height={18} />,
  },
  {
    label: "Application",
    to: "/pc/application",
    pathname: "/pc/application",
    icon: <FileText width={18} height={18} />,
  },
  {
    label: "Members",
    to: "/pc/members",
    pathname: "/pc/members",
    icon: <Users width={18} height={18} />,
  },
  {
    label: "Share",
    to: "/pc/share",
    pathname: "/pc/share",
    icon: <Coins width={18} height={18} />,
  },
  {
    label: "Leadership",
    to: "/pc/leadership",
    pathname: "/pc/leadership",
    icon: <Crown width={18} height={18} />,
  },
  {
    label: "Profit",
    to: "/pc/profit",
    pathname: "/pc/profit",
    icon: <PieChart width={18} height={18} />,
  },
  {
    label: "Profile",
    to: "/pc/profile",
    pathname: "/pc/profile",
    icon: <User width={18} height={18} />,
  },
  {
    label: "Bank",
    to: "/pc/bank",
    pathname: "/pc/bank",
    icon: <Building2 width={18} height={18} />,
  },
  {
    label: "Logo",
    to: "/pc/logo",
    pathname: "/pc/logo",
    icon: <Image width={18} height={18} />,
  },
  {
    label: "License",
    to: "/pc/license",
    pathname: "/pc/license",
    icon: <FileCheck width={18} height={18} />,
  },
];
