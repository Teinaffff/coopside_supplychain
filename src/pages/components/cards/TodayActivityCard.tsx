import {
    ActivityIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "../../../common/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../common/ui/card";

const AdminPriorityCard = () => {
  const recentActivity = [
    {
      action: "Loan approved for Agent #1247",
      time: "5 min ago",
    },
    { action: "Product listing rejected", time: "12 min ago" },
    { action: "New institution verified", time: "25 min ago" },
    {
      action: "Agent verification completed",
      time: "1 hour ago",
    },
    { action: "Product listing rejected", time: "12 min ago" },
    { action: "New institution verified", time: "25 min ago" },
    {
      action: "Agent verification completed",
      time: "1 hour ago",
    },
  ];

  const quickStats = [
    {
      label: "Total orders",
      value: "23",
      icon: CheckCircle,
      trend: "+18%",
    },
    { label: "Pending Requests", value: "31", icon: Clock, trend: "+5%" },
  ];

  return (
    <Card className="bg-gradient-to-br from-cyan-500 to-slate-800 text-gray-800 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <ActivityIcon className="w-5 h-5" />
          Today Activity
        </CardTitle>
        <p className="text-slate-100 text-sm">Todays recent activities</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Activity */}
        <div className="space-y-3">
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm p-2 bg-white/5 rounded"
              >
                <span className="text-slate-100">{activity.action}</span>
                <span className="text-slate-200 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="secondary"
          className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <FileText className="w-4 h-4 mr-2" />
          View All Logs
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminPriorityCard;
