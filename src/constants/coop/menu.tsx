import { LucideHome, ClipboardPlus, MonitorSmartphoneIcon, Banknote, FileText, Users2, Settings} from "lucide-react";

export const menuItems = [

  {
    label: "Home",
    to: "/coop",
    pathname: "/coop",
    icon: <LucideHome width={18} height={18} />,
  },
  
   {
    label: "Approval Management",
    to: "/coop/approval",
    pathname: "/coop/approval",
    icon: <ClipboardPlus width={18} height={18} />,
  },
  // {
  //   label: "Credit Application",
  //   to: "/coop/credit",
  //   pathname: "/coop/credit",
  //   icon: <HandCoins width={18} height={18} />,
  // },
  
  {
    label: "Loan Monitoring",
    to: "/coop/loan-monitoring",
    pathname: "/coop/loan-monitoring",
    icon: <MonitorSmartphoneIcon width={18} height={18} />,
    subMenu: [
      {
        label: "Loan Requests",
        to: "/coop/loan-monitoring/requests",
        pathname: "/coop/loan-monitoring/requests",
        icon: <FileText width={18} height={18} />,
      },
      {
        label: "Loan Status Tracking",
        to: "/coop/loan-monitoring/tracking",
        pathname: "/coop/loan-monitoring/tracking",
        icon: <Banknote width={18} height={18} />,
      },
      {
        label: "Loan Settings",
        to: "/coop/loan-monitoring/settings",
        pathname: "/coop/loan-monitoring/settings",
        icon: <Settings width={18} height={18} />,
      },
    ],
  },
  // {
  //   label: "Transation Flow",
  //   to: "/coop/transaction",
  //   pathname: "/coop/transaction",
  //   icon: <ArrowRightLeft width={18} height={18} />,
  // },
  // {
  //   label: "Card Management",
  //   to: "/coop/card",
  //   pathname: "/coop/card",
  //   icon: <CreditCard width={18} height={18} />,
  // },
  {
    label: "User Management",
    to: "/coop/users",
    pathname: "/coop/users",
    icon: <Users2 width={18} height={18} />,
  },
 
  // {
  //   label: "Reports and Analytics",
  //   to: "/coop/reports",
  //   pathname: "/coop/reports",
  //   icon: <ClipboardPlus width={18} height={18} />,
  // },
];
