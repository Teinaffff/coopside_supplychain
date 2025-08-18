import {
  ArrowDown,
  ArrowUp,
  Building2,
  User2,
  UserCircle2,
  Users2,
} from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../common/ui/card";
import { StatCardProps } from "../../constants/interface/general";

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  index,
}) => {
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;

  const cardConfig = {
    0: { color: "emerald", icon: UserCircle2 },
    1: { color: "orange", icon: Building2 },
    2: { color: "purple", icon: Users2 },
    3: { color: "cyan", icon: User2 },
  };

  const config = cardConfig[index as keyof typeof cardConfig] || cardConfig[0];
  const { color, icon: Icon } = config;

  return (
    <Card className="dark:bg-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
        <CardTitle
          className={`text-lg font-medium text-${color}-500 dark:text-slate-200`}
        >
          {title}
        </CardTitle>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`text-${color}-500`} />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold text-${color}-500 dark:text-slate-200`}
        >
          {value}
        </div>
        <p className="text-xs text-muted-foreground flex items-center space-x-2">
          <span
            className={`text-${color}-500 text-lg flex items-center dark:text-slate-200`}
          >
            <TrendIcon className="w-5 h-5" />
            {change}%
          </span>{" "}
          <span>from last month</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
