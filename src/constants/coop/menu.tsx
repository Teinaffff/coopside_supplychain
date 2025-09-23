import { LucideHome, ClipboardPlus,HandCoins, MonitorSmartphoneIcon, ArrowRightLeft, CreditCard} from "lucide-react";

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
  {
    label: "Credit Application",
    to: "/coop/credit",
    pathname: "/coop/credit",
    icon: <HandCoins width={18} height={18} />,
  },
  
  {
    label: "Loan Monitoring",
    to: "/coop/loan",
    pathname: "/coop/loan",
    icon: <MonitorSmartphoneIcon width={18} height={18} />,
  },
  // {
  //   label: "Transation Flow",
  //   to: "/coop/transaction",
  //   pathname: "/coop/transaction",
  //   icon: <ArrowRightLeft width={18} height={18} />,
  // },
  {
    label: "Card Management",
    to: "/coop/card",
    pathname: "/coop/card",
    icon: <CreditCard width={18} height={18} />,
  },
 
  // {
  //   label: "Reports and Analytics",
  //   to: "/coop/reports",
  //   pathname: "/coop/reports",
  //   icon: <ClipboardPlus width={18} height={18} />,
  // },
];
