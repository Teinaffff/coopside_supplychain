import React, { useMemo, useState, useEffect } from "react";
import Loader from "../../../common/Loader";
import {
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
  UserCheck,
  DollarSign,
  Coins
} from "lucide-react";
import { useInstitutions } from "../hooks/useInstitutions";
import { useAgents } from "../hooks/use-Agents";
import API from "../../../config/axios-config";
import { toast } from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [entityDistribution, setEntityDistribution] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [consumersCount, setConsumersCount] = useState<number>(0);
  const [loanMonitoringData, setLoanMonitoringData] = useState<any[]>([]);

  const { institutions, isLoading: institutionsLoading } = useInstitutions();
  const { agents, isLoading: agentsLoading } = useAgents();

  // Fetch users count
  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const response = await API.get("/v1/users");
        const users = response.data?.data || response.data || [];
        setUsersCount(Array.isArray(users) ? users.length : 0);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        setUsersCount(0);
      }
    };
    fetchUsersCount();
  }, []);

  // Fetch consumers count
  useEffect(() => {
    const fetchConsumersCount = async () => {
      try {
        const response = await API.get("/v1/consumers");
        const consumers = response.data?.data || response.data || [];
        setConsumersCount(Array.isArray(consumers) ? consumers.length : 0);
      } catch (error: any) {
        console.error("Error fetching consumers:", error);
        setConsumersCount(0);
      }
    };
    fetchConsumersCount();
  }, []);

  // Fetch loan monitoring stats
  useEffect(() => {
    const fetchLoanMonitoringStats = async () => {
      try {
        const response = await API.get("/v1/loan-applications/stats/monitoring");
        const stats = response.data?.data || response.data || {};
        
        // Transform API response to chart format
        // Always show all statuses, even if count is 0, so they're visible when data increases
        const chartData = [
          { status: "Approved", count: stats.approved || 0, amount: 0 },
          { status: "Repaid", count: stats.repaid || 0, amount: 0 },
          { status: "Pending Partner", count: stats.pendingPartnerApproval || 0, amount: 0 },
          { status: "Overdue", count: stats.overdue || 0, amount: 0 },
          { status: "Pending Agent ", count: stats.pendingAgentConfirmation || 0, amount: 0 },
          { status: "Disbursed", count: stats.disbursed || 0, amount: 0 },
          { status: "Total Pending", count: stats.totalPending || 0, amount: 0 },
          { status: "Partner Approved", count: stats.partnerApproved || 0, amount: 0 },
          { status: "Pending Admin ", count: stats.pendingSuperAdminApproval || 0, amount: 0 },
        ];
        
        setLoanMonitoringData(chartData);
      } catch (error: any) {
        console.error("Error fetching loan monitoring stats:", error);
        // Fallback to static data on error
        setLoanMonitoringData(systemMetricsData.loanMonitoring);
      }
    };
    fetchLoanMonitoringStats();
  }, []);

  // Calculate stats from real data
  useEffect(() => {
    if (!institutionsLoading && !agentsLoading) {
      const totalInstitutions = institutions?.length || 0;
      const activeInstitutions = institutions?.filter((i: any) => i.status === "Approved" && i.adminStatus === "Approved").length || 0;
      const pendingInstitutions = institutions?.filter((i: any) => i.status === "Pending" || i.adminStatus === "Pending").length || 0;

      const totalAgents = agents?.length || 0;
      const activeAgents = agents?.filter((a: any) => a.status === "Approved" && a.adminStatus === "Approved").length || 0;
      
      // Calculate new agents this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newAgentsThisMonth = agents?.filter((a: any) => {
        if (!a.form?.createdAt) return false;
        try {
          const createdDate = new Date(a.form.createdAt);
          return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
        } catch {
          return false;
        }
      }).length || 0;

      const totalUsers = usersCount + consumersCount + totalInstitutions + totalAgents;

      setStatsData([
        {
          title: "Total Users",
          value: totalUsers.toLocaleString(),
          change: 0,
          trend: "up",
          icon: Users,
          color: "cyan",
          primaryLabel: "Active Users",
          secondaryValue: (activeInstitutions + activeAgents).toLocaleString(),
          secondaryLabel: "Active Entities",
        },
        {
          title: "Institutions",
          value: totalInstitutions,
          change: 0,
          trend: "up",
          icon: DollarSign,
          color: "cyan",
          primaryLabel: "Active",
          secondaryValue: pendingInstitutions,
          secondaryLabel: "Pending Review",
        },
        {
          title: "Agents",
          value: totalAgents,
          change: 0,
          trend: "up",
          icon: Coins,
          color: "cyan",
          primaryLabel: "Active",
          secondaryValue: newAgentsThisMonth,
          secondaryLabel: "New This Month",
        },
        {
          title: "System Health",
          value: "99.8%",
          change: 0.2,
          trend: "up",
          icon: TrendingUp,
          color: "cyan",
          primaryLabel: "Uptime",
          secondaryValue: "2.1s",
          secondaryLabel: "Avg Response",
        },
      ]);

      // Calculate entity distribution
      const totalEntities = totalAgents + totalInstitutions + consumersCount;
      const distribution = totalEntities > 0 ? [
        { type: "Agents", count: totalAgents, percentage: Math.round((totalAgents / totalEntities) * 100) },
        { type: "Consumers", count: consumersCount, percentage: Math.round((consumersCount / totalEntities) * 100) },
        { type: "Institutions", count: totalInstitutions, percentage: Math.round((totalInstitutions / totalEntities) * 100) },
      ] : [];
      setEntityDistribution(distribution);

      setLoading(false);
    }
  }, [institutions, agents, institutionsLoading, agentsLoading, usersCount, consumersCount]);

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          System overview and monitoring for cooperative management platform
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats statsData={statsData} />

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
            <EntityDistributionChart data={entityDistribution.length > 0 ? entityDistribution : systemMetricsData.entityDistribution} />
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
            <LoanMonitoringChart data={loanMonitoringData.length > 0 ? loanMonitoringData : systemMetricsData.loanMonitoring} />
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
