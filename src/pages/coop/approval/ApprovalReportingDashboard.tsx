import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Badge } from "../../../common/ui/badge";
import { Users, Building2, Factory, UserCircle2, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../common/ui/select";

// Mock data - this would come from your API
const mockApprovalData = {
  agents: [
    { id: 1, name: "Prime Agents", status: "Approved", submittedAt: "2024-01-15", approvedAt: "2024-01-20" },
    { id: 2, name: "Sunrise Traders", status: "Pending", submittedAt: "2024-01-18", approvedAt: null },
    { id: 3, name: "MegaMart Sellers", status: "Rejected", submittedAt: "2024-01-10", approvedAt: null },
    { id: 4, name: "Global Trade Co", status: "Approved", submittedAt: "2024-01-12", approvedAt: "2024-01-16" },
    { id: 5, name: "Local Merchants", status: "Pending", submittedAt: "2024-01-22", approvedAt: null },
  ],
  institutions: [
    { id: 1, name: "Central Union", status: "Rejected", submittedAt: "2024-01-08", approvedAt: null },
    { id: 2, name: "Office 1", status: "Pending", submittedAt: "2024-01-14", approvedAt: null },
    { id: 3, name: "Office 2", status: "Approved", submittedAt: "2024-01-05", approvedAt: "2024-01-10" },
    { id: 4, name: "Regional Coop", status: "Approved", submittedAt: "2024-01-20", approvedAt: "2024-01-25" },
  ],
  factories: [
    { id: 1, name: "ABC Factory", status: "Pending", submittedAt: "2024-01-16", approvedAt: null },
    { id: 2, name: "Beta Manufacturing", status: "Approved", submittedAt: "2024-01-11", approvedAt: "2024-01-18" },
    { id: 3, name: "Global Textiles", status: "Rejected", submittedAt: "2024-01-09", approvedAt: null },
    { id: 4, name: "Tech Industries", status: "Approved", submittedAt: "2024-01-13", approvedAt: "2024-01-19" },
    { id: 5, name: "Modern Mills", status: "Pending", submittedAt: "2024-01-21", approvedAt: null },
  ],
  consumers: [
    { id: 1, name: "Teina Tesfaye", status: "Pending", submittedAt: "2024-01-17", approvedAt: null },
    { id: 2, name: "Samuel Kebede", status: "Approved", submittedAt: "2024-01-07", approvedAt: "2024-01-12" },
    { id: 3, name: "Lulit Bekele", status: "Rejected", submittedAt: "2024-01-06", approvedAt: null },
    { id: 4, name: "Dawit Alemu", status: "Approved", submittedAt: "2024-01-19", approvedAt: "2024-01-24" },
    { id: 5, name: "Hanan Ahmed", status: "Pending", submittedAt: "2024-01-23", approvedAt: null },
    { id: 6, name: "Meron Tadesse", status: "Approved", submittedAt: "2024-01-15", approvedAt: "2024-01-21" },
  ],
};

interface ApprovalEntity {
  id: number;
  name: string;
  status: "Approved" | "Pending" | "Rejected";
  submittedAt: string;
  approvedAt: string | null;
}

type EntityType = "agents" | "institutions" | "factories" | "consumers";

const ApprovalReportingDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("30");
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | "all">("all");

  // Calculate statistics
  const stats = useMemo(() => {
    const allEntities = [
      ...mockApprovalData.agents,
      ...mockApprovalData.institutions,
      ...mockApprovalData.factories,
      ...mockApprovalData.consumers,
    ];

    const totalCount = allEntities.length;
    const approvedCount = allEntities.filter(e => e.status === "Approved").length;
    const pendingCount = allEntities.filter(e => e.status === "Pending").length;
    const rejectedCount = allEntities.filter(e => e.status === "Rejected").length;

    const approvalRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : "0";

    return {
      total: totalCount,
      approved: approvedCount,
      pending: pendingCount,
      rejected: rejectedCount,
      approvalRate: parseFloat(approvalRate),
      agents: mockApprovalData.agents.length,
      institutions: mockApprovalData.institutions.length,
      factories: mockApprovalData.factories.length,
      consumers: mockApprovalData.consumers.length,
    };
  }, []);

  // Note: Charts removed as per requirement. Keeping core stats only.

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const filteredData = useMemo<Record<string, ApprovalEntity[]>>(() => {
    if (selectedEntityType === "all") {
      return {
        agents: mockApprovalData.agents as ApprovalEntity[],
        institutions: mockApprovalData.institutions as ApprovalEntity[],
        factories: mockApprovalData.factories as ApprovalEntity[],
        consumers: mockApprovalData.consumers as ApprovalEntity[],
      };
    }
    return {
      [selectedEntityType]: mockApprovalData[selectedEntityType] as ApprovalEntity[],
    } as Record<string, ApprovalEntity[]>;
  }, [selectedEntityType]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Approval Management Dashboard
          </h1>
          
        </div>
        
        {/* Filters */}
        <div className="flex gap-3">
          <Select value={selectedEntityType} onValueChange={(value) => setSelectedEntityType(value as EntityType | "all")}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="agents">Agents</SelectItem>
              <SelectItem value="institutions">Institutions</SelectItem>
              <SelectItem value="factories">Factories</SelectItem>
              <SelectItem value="consumers">Consumers</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.approved}</div>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.approvalRate}% approval rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pending}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.rejected}</div>
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              Need review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts removed */}

      {/* Entity Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents</CardTitle>
            <UserCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.agents}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {mockApprovalData.agents.filter(a => a.status === "Approved").length} Approved
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {mockApprovalData.agents.filter(a => a.status === "Pending").length} Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Institutions</CardTitle>
            <Building2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.institutions}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {mockApprovalData.institutions.filter(i => i.status === "Approved").length} Approved
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {mockApprovalData.institutions.filter(i => i.status === "Pending").length} Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factories</CardTitle>
            <Factory className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.factories}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {mockApprovalData.factories.filter(f => f.status === "Approved").length} Approved
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {mockApprovalData.factories.filter(f => f.status === "Pending").length} Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-200 dark:border-cyan-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumers</CardTitle>
            <Users className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consumers}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {mockApprovalData.consumers.filter(c => c.status === "Approved").length} Approved
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {mockApprovalData.consumers.filter(c => c.status === "Pending").length} Pending
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Submitted</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(filteredData).map(([type, entities]) =>
                  entities.slice(0, 5).map((entity) => (
                    <tr key={`${type}-${entity.id}`} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2 font-medium">{entity.name}</td>
                      <td className="p-2 capitalize">{type.slice(0, -1)}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(entity.status)}
                          <Badge variant={getStatusBadgeVariant(entity.status) as any}>
                            {entity.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-2 text-gray-600 dark:text-gray-400">
                        {new Date(entity.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalReportingDashboard;
