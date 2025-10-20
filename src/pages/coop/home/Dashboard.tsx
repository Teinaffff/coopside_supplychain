import React, { useMemo, useState } from "react";
import Loader from "../../../common/Loader";
import {
  superAdminStatsData,
  superAdminRecentActivities,
  systemMetricsData,
} from "../../../common/data/data";
import { DashboardStats } from "../../components/DashboardStats";
import EntityDistributionChart from "../../components/charts/InstitutionDistributionChart";
import LoanMonitoringChart from "../../components/charts/LoanMonitoringChart";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../common/ui/table";
import { Badge } from "../../../common/ui/badge";
import { Button } from "../../../common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../common/ui/dialog";
import { Input } from "../../../common/ui/input";
import { Label } from "../../../common/ui/label";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Shield, 
  TrendingUp,
  Users,
  Building2,
  UserCheck
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [loading] = useState<boolean>(false);

  const recentActivities = useMemo(() => superAdminRecentActivities.slice(0, 5), []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-cyan-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "resolved":
        return <Shield className="h-4 w-4 text-indigo-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-cyan-50 text-cyan-600";
      case "pending":
        return "bg-amber-50 text-amber-600";
      case "resolved":
        return "bg-indigo-50 text-indigo-600";
      case "failed":
        return "bg-rose-50 text-rose-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-rose-50 text-rose-600";
      case "medium":
        return "bg-amber-50 text-amber-600";
      case "low":
        return "bg-emerald-50 text-emerald-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          System overview and monitoring for cooperative management platform
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats statsData={superAdminStatsData as any} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Entity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Entity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EntityDistributionChart data={systemMetricsData.entityDistribution} />
          </CardContent>
        </Card>

        {/* Loan Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Loan Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LoanMonitoringChart data={systemMetricsData.loanMonitoring} />
          </CardContent>
        </Card>
      </div>

      {/* Recent System Activities */}
        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent System Activities
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All
          </Button>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(activity.priority)} variant="outline">
                        {activity.priority}
                      </Badge>
                      <Badge className={getStatusColor(activity.status)} variant="outline">
                        {activity.status}
                      </Badge>
                </div>
              </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {activity.performedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {activity.category}
                    </span>
                </div>
                </div>
              </div>
            ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default Dashboard;
