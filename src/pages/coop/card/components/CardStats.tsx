import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../common/ui/card";
import { Badge } from "../../../../common/ui/badge";
import { CardStats as CardStatsType } from "../../../../constants/interface/coop/card";
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Pause, 
  Users, 
  Shield,
  DollarSign,
  TrendingUp
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
    {
      title: "Pending",
      value: stats.pending,
      icon: <Clock className="w-5 h-5" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
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
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {financialCards.map((stat, index) => (
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
      </div>
    </div>
  );
};

export default CardStats;
