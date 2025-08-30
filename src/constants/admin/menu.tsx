import {
  Building2,
  Factory,
  FileBarChart,
  HandCoins,
  LucideHome,
  ShoppingCart,
  User2,
  UserCircle2,
  Users2
} from "lucide-react";
import { ROLES } from "../../config/permissions";

export const menuItems = [
  {
    label: "Home",
    to: "/admin",
    pathname: "/admin",
    icon: <LucideHome width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },

  // User Management
  {
    label: "Agents",
    to: "/admin/agents",
    pathname: "/admin/agents",
    icon: <UserCircle2 width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Sellers",
    to: "/admin/seller",
    pathname: "/admin/seller",
    icon: <Users2 width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Factories",
    to: "/admin/factories",
    pathname: "/admin/factories",
    icon: <Factory width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Institutions",
    to: "/admin/institutions",
    pathname: "/admin/institutions",
    icon: <Building2 width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Consumers",
    to: "/admin/consumers",
    pathname: "/admin/consumers",
    icon: <User2 width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },

  // Financial Management
  {
    label: "Loans",
    to: "/admin/loans",
    pathname: "/admin/loans",
    icon: <HandCoins width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },
  // {
  //   label: "Payments",
  //   to: "/admin/payments",
  //   pathname: "/admin/payments",
  //   icon: <CreditCard width={18} height={18} />,
  //  roles: [ROLES.ADMIN],
  // },
  // {
  //   label: "Transactions",
  //   to: "/admin/transactions",
  //   pathname: "/admin/transactions",
  //   icon: <ArrowLeftRight width={18} height={18} />,
  //  roles: [ROLES.ADMIN],
  // },

  // Supply Chain Management
  {
    label: "Orders",
    to: "/admin/orders",
    pathname: "/admin/orders",
    icon: <ShoppingCart width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },
  // {
  //   label: "Products",
  //   to: "/admin/products",
  //   pathname: "/admin/products",
  //   icon: <Package width={18} height={18} />,
  //  roles: [ROLES.ADMIN],
  // },
  // {
  //   label: "Requests",
  //   to: "/admin/requests",
  //   pathname: "/admin/requests",
  //   icon: <MessageSquare width={18} height={18} />,
  //  roles: [ROLES.ADMIN],
  // },

  // System Management
  {
    label: "Users",
    to: "/admin/users",
    pathname: "/admin/users",
    icon: <FileBarChart width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },
  // {
  //   label: "Reports",
  //   to: "/admin/reports",
  //   pathname: "/admin/reports",
  //   icon: <FileBarChart width={18} height={18} />,
  //  roles: [ROLES.ADMIN],
  // },
  {
    label: "Logs",
    to: "/admin/logs",
    pathname: "/admin/logs",
    icon: <FileBarChart width={18} height={18} />,
    roles: [ROLES.ADMIN],
  },
];
