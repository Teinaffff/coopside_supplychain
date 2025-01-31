import {
  Calendar,
  CreditCard,
  DollarSign,
  LucideIcon,
  PieChart,
} from "lucide-react";
import { IMAGES } from "../../../../assets";
import { Card } from "../../../../common/ui/card";

// Define types for better type safety
interface CardItem {
  icon: LucideIcon;
  label: string;
  profit: string | number;
  bgColor: string;
  iconColor: string;
}

interface MemberCardProps {
  member: {
    name: string;
    email: string;
    memberId: string;
    investment: number;
    totalShares: number;
    totalProfit: number;
  };
}

const CardInfoItem = ({
  icon: Icon,
  label,
  profit,
  bgColor,
  iconColor,
}: CardItem) => (
  <div className="flex items-center">
    <div
      className={`flex items-center justify-center w-10 h-10 ${bgColor} dark:bg-opacity-10 rounded-full mr-2`}
    >
      <Icon className={`${iconColor} dark:opacity-90`} size={18} />
    </div>
    <div>
      <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
        {label}
      </span>
      <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
        {profit}
      </span>
    </div>
  </div>
);

const MemberCard = ({ member }: MemberCardProps) => {
  const cardItems: CardItem[] = [
    {
      icon: CreditCard,
      label: "Member ID",
      profit: member.memberId,
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-500",
    },
    {
      icon: Calendar,
      label: "Total Investment",
      profit: member.investment,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      icon: PieChart,
      label: "Total Shares",
      profit: member.totalShares,
      bgColor: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      icon: DollarSign,
      label: "Total Profit",
      profit: `Birr ${member.totalProfit}`,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        {/* Avatar and User Info */}
        <div className="w-14 h-14 rounded-full mr-4">
          <img src={IMAGES.user01} alt="member" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 m-0">
            {member.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {member.email}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cardItems.map((item, index) => (
          <CardInfoItem key={index} {...item} />
        ))}
      </div>
    </Card>
  );
};

export default MemberCard;
