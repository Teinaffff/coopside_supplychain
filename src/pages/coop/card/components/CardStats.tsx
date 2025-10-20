import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../common/ui/card";
import { Badge } from "../../../../common/ui/badge";
import { CardStats as CardStatsType } from "../../../../constants/interface/coop/card";
import { 
  CreditCard, 
  DollarSign
} from "lucide-react";

interface CardStatsProps {
  stats: CardStatsType;
}

const CardStats: React.FC<CardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: "Total Cards",
      value: stats.total,
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const financialCards = [
    {
      title: "Total Credit Limit",
      value: `ETB ${stats.totalCreditLimit.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Essential Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {financialCards.map((stat, index) => (
          <Card key={`financial-${index}`} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardStats;
