import {
  Banknote,
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
    label: "Managemnet",
    to: "/pc/management",
    pathname: "/pc/management",
    icon: <Settings width={18} height={18} />,
    subMenu: [
      {
        label: "Bank",
        to: "/pc/management/bank",
        pathname: "/pc/management/bank",
        icon: <Banknote width={18} height={18} />,
      },
      {
        label: "Logo",
        to: "/pc/management/logo",
        pathname: "/pc/management/logo",
        icon: <Image width={18} height={18} />,
      },
      {
        label: "Certificate",
        to: "/pc/management/certificate",
        pathname: "/pc/management/certificate",
        icon: <FileCheck width={18} height={18} />,
      },
    ],
  },
];
