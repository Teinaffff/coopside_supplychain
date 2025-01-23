import {
  Briefcase,
  Coins,
  FileText,
  HelpCircle,
  LucideHome,
  PieChart,
  Settings,
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
    icon: <Briefcase width={18} height={18} />,
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
    icon: <Settings width={18} height={18} />,
  },
  {
    label: "Help & Support",
    to: "/pc/help-support",
    pathname: "/pc/help-support",
    icon: <HelpCircle width={18} height={18} />,
  },
];
