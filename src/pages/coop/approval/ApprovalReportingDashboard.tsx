import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Badge } from "../../../common/ui/badge";
import { Users, Building2, Factory, UserCircle2, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, Calendar, Filter, Activity, BarChart3, PieChart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../common/ui/select";
import { useFactories } from "../hooks/use-factories";
import { useAgents } from "../hooks/use-Agents";
import { useInstitutions } from "../hooks/useInstitutions";
import { useAllConsumers } from "../hooks/useAllConsumers";

interface ApprovalEntity {
  id: number;
  name: string;
  status: "Approved" | "Pending" | "Rejected";
  adminStatus: "Approved" | "Pending" | "Rejected";
  submittedAt: string;
  approvedAt: string | null;
  type: string;
}

type EntityType = "agents" | "institutions" | "factories" | "consumers";

const ApprovalReportingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("30");
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | "all">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Navigation function for detail pages
  const handleViewDetails = (entity: ApprovalEntity) => {
    const basePath = "/coop/approval";
    switch (entity.type) {
      case "Agent":
        navigate(`${basePath}/agents/${entity.id}`);
        break;
      case "Institution":
        navigate(`${basePath}/institutions/${entity.id}`);
        break;
      case "Manufacturer":
        navigate(`${basePath}/factories/${entity.id}`);
        break;
      case "Consumer":
        navigate(`${basePath}/consumers/${entity.id}`);
        break;
      default:
        console.warn(`Unknown entity type: ${entity.type}`);
    }
  };

  // Fetch real data
  const { factories = [], isLoading: factoriesLoading } = useFactories();
  const { agents = [], isLoading: agentsLoading } = useAgents();
  const { institutions = [], isLoading: institutionsLoading } = useInstitutions();
  const { data: consumers = [], isLoading: consumersLoading } = useAllConsumers();

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const allEntities = [
      ...factories.map(f => ({
        ...f,
        type: "Factory",
        submittedAt: f.form?.createdAt || new Date().toISOString(),
        approvedAt: f.status === "Approved" ? f.form?.approvedAt || new Date().toISOString() : null
      })),
      ...agents.map(a => ({
        ...a,
        type: "Agent",
        submittedAt: a.form?.createdAt || new Date().toISOString(),
        approvedAt: a.status === "Approved" ? a.form?.approvedAt || new Date().toISOString() : null
      })),
      ...institutions.map(i => ({
        ...i,
        type: "Institution",
        submittedAt: i.form?.createdAt || new Date().toISOString(),
        approvedAt: i.status === "Approved" ? i.form?.approvedAt || new Date().toISOString() : null
      })),
      ...consumers.map(c => ({
        ...c,
        type: "Consumer",
        submittedAt: c.form?.createdAt || new Date().toISOString(),
        approvedAt: c.status === "Approved" ? c.form?.approvedAt || new Date().toISOString() : null
      })),
    ];

    const totalCount = allEntities.length;
    const approvedCount = allEntities.filter(e => e.status === "Approved").length;
    const pendingCount = allEntities.filter(e => e.status === "Pending").length;
    const rejectedCount = allEntities.filter(e => e.status === "Rejected").length;
    const adminApprovedCount = allEntities.filter(e => e.adminStatus === "Approved").length;
    const adminPendingCount = allEntities.filter(e => e.adminStatus === "Pending").length;
    const adminRejectedCount = allEntities.filter(e => e.adminStatus === "Rejected").length;

    const approvalRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : "0";
    const adminApprovalRate = totalCount > 0 ? ((adminApprovedCount / totalCount) * 100).toFixed(1) : "0";
    const readyForReview = adminApprovedCount - approvedCount;

    // Entity type breakdown
    const entityBreakdown = {
      agents: {
        total: agents.length,
        approved: agents.filter(a => a.status === "Approved").length,
        pending: agents.filter(a => a.status === "Pending").length,
        rejected: agents.filter(a => a.status === "Rejected").length,
        adminApproved: agents.filter(a => a.adminStatus === "Approved").length,
      },
      institutions: {
        total: institutions.length,
        approved: institutions.filter(i => i.status === "Approved").length,
        pending: institutions.filter(i => i.status === "Pending").length,
        rejected: institutions.filter(i => i.status === "Rejected").length,
        adminApproved: institutions.filter(i => i.adminStatus === "Approved").length,
      },
      factories: {
        total: factories.length,
        approved: factories.filter(f => f.status === "Approved").length,
        pending: factories.filter(f => f.status === "Pending").length,
        rejected: factories.filter(f => f.status === "Rejected").length,
        adminApproved: factories.filter(f => f.adminStatus === "Approved").length,
      },
      consumers: {
        total: consumers.length,
        approved: consumers.filter(c => c.status === "Approved").length,
        pending: consumers.filter(c => c.status === "Pending").length,
        rejected: consumers.filter(c => c.status === "Rejected").length,
        adminApproved: consumers.filter(c => c.adminStatus === "Approved").length,
      },
    };

    return {
      total: totalCount,
      approved: approvedCount,
      pending: pendingCount,
      rejected: rejectedCount,
      adminApproved: adminApprovedCount,
      adminPending: adminPendingCount,
      adminRejected: adminRejectedCount,
      readyForReview: readyForReview,
      approvalRate: parseFloat(approvalRate),
      adminApprovalRate: parseFloat(adminApprovalRate),
      entityBreakdown,
    };
  }, [factories, agents, institutions, consumers]);

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
    const allEntities = [
      ...factories.map(f => ({
        id: f.id,
        name: f.name,
        status: f.status,
        adminStatus: f.adminStatus,
        type: "Manufacturer",
        submittedAt: f.form?.createdAt || new Date().toISOString(),
        approvedAt: f.status === "Approved" ? f.form?.approvedAt || new Date().toISOString() : null
      })),
      ...agents.map(a => ({
        id: a.id,
        name: a.name,
        status: a.status,
        adminStatus: a.adminStatus,
        type: "Agent",
        submittedAt: a.form?.createdAt || new Date().toISOString(),
        approvedAt: a.status === "Approved" ? a.form?.approvedAt || new Date().toISOString() : null
      })),
      ...institutions.map(i => ({
        id: i.id,
        name: i.name,
        status: i.status,
        adminStatus: i.adminStatus,
        type: "Institution",
        submittedAt: i.form?.createdAt || new Date().toISOString(),
        approvedAt: i.status === "Approved" ? i.form?.approvedAt || new Date().toISOString() : null
      })),
      ...consumers.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        adminStatus: c.adminStatus,
        type: "Consumer",
        submittedAt: c.form?.createdAt || new Date().toISOString(),
        approvedAt: c.status === "Approved" ? c.form?.approvedAt || new Date().toISOString() : null
      })),
    ];

    // Apply time range filter
    const now = new Date();
    const timeRangeDays = parseInt(selectedTimeRange);
    const cutoffDate = new Date(now.getTime() - (timeRangeDays * 24 * 60 * 60 * 1000));
    
    const timeFilteredEntities = allEntities.filter(entity => {
      const submittedDate = new Date(entity.submittedAt);
      return submittedDate >= cutoffDate;
    });

    // Sort by submittedAt date (most recent first)
    timeFilteredEntities.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    if (selectedEntityType === "all") {
      return {
        agents: timeFilteredEntities.filter(e => e.type === "Agent"),
        institutions: timeFilteredEntities.filter(e => e.type === "Institution"),
        factories: timeFilteredEntities.filter(e => e.type === "Manufacturer"),
        consumers: timeFilteredEntities.filter(e => e.type === "Consumer"),
      };
    }
    
    const entityTypeMap = {
      agents: timeFilteredEntities.filter(e => e.type === "Agent"),
      institutions: timeFilteredEntities.filter(e => e.type === "Institution"),
      factories: timeFilteredEntities.filter(e => e.type === "Manufacturer"),
      consumers: timeFilteredEntities.filter(e => e.type === "Consumer"),
    };

    return {
      [selectedEntityType]: entityTypeMap[selectedEntityType] || [],
    } as Record<string, ApprovalEntity[]>;
  }, [selectedEntityType, selectedTimeRange, factories, agents, institutions, consumers]);

  // Pagination logic for recent applications
  const paginatedData = useMemo(() => {
    const allEntities = [
      ...factories.map(f => ({
        id: f.id,
        name: f.name,
        status: f.status,
        adminStatus: f.adminStatus,
        type: "Manufacturer",
        submittedAt: f.form?.createdAt || new Date().toISOString(),
        approvedAt: f.status === "Approved" ? f.form?.approvedAt || new Date().toISOString() : null
      })),
      ...agents.map(a => ({
        id: a.id,
        name: a.name,
        status: a.status,
        adminStatus: a.adminStatus,
        type: "Agent",
        submittedAt: a.form?.createdAt || new Date().toISOString(),
        approvedAt: a.status === "Approved" ? a.form?.approvedAt || new Date().toISOString() : null
      })),
      ...institutions.map(i => ({
        id: i.id,
        name: i.name,
        status: i.status,
        adminStatus: i.adminStatus,
        type: "Institution",
        submittedAt: i.form?.createdAt || new Date().toISOString(),
        approvedAt: i.status === "Approved" ? i.form?.approvedAt || new Date().toISOString() : null
      })),
      ...consumers.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        adminStatus: c.adminStatus,
        type: "Consumer",
        submittedAt: c.form?.createdAt || new Date().toISOString(),
        approvedAt: c.status === "Approved" ? c.form?.approvedAt || new Date().toISOString() : null
      })),
    ];

    // Sort by submittedAt date (most recent first)
    allEntities.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEntities = allEntities.slice(startIndex, endIndex);

    return {
      entities: paginatedEntities,
      totalItems: allEntities.length,
      totalPages: Math.ceil(allEntities.length / itemsPerPage),
      currentPage,
      hasNextPage: currentPage < Math.ceil(allEntities.length / itemsPerPage),
      hasPrevPage: currentPage > 1,
    };
  }, [factories, agents, institutions, consumers, currentPage, itemsPerPage]);

  const isLoading = factoriesLoading || agentsLoading || institutionsLoading || consumersLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Approval Management Dashboard
          </h1>
         
        </div>
        
        {/* Filters */}
        <div className="flex gap-3">
          <Select value={selectedEntityType} onValueChange={(value) => setSelectedEntityType(value as EntityType | "all")}>
            <SelectTrigger className="w-48 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="agents">🛒 Agents/Sellers</SelectItem>
              <SelectItem value="institutions">🏢 Institutions</SelectItem>
              <SelectItem value="factories">🏭 Manufacturies</SelectItem>
              <SelectItem value="consumers">👥 Consumers</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-40 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
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
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Applications
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-2">
              <Activity className="h-3 w-3 mr-1" />
              All entity types
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border-cyan-200 dark:border-cyan-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
              Super Admin Approved
            </CardTitle>
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">{stats.approved}</div>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.approvalRate}% approval rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Pending Review
            </CardTitle>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats.pending}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center mt-2">
              <Clock className="h-3 w-3 mr-1" />
              Awaiting super admin action
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Rejected
            </CardTitle>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.rejected}</div>
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-2">
              <TrendingDown className="h-3 w-3 mr-1" />
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Partner Approved
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.adminApproved}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-2">
              <BarChart3 className="h-3 w-3 mr-1" />
              {stats.adminApprovalRate}% partner approval rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Entity Summary */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-t-lg">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Entity Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Agents */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-800 dark:text-white">🛒 Agents/Sellers</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-medium">{stats.entityBreakdown.agents.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Super Admin Approved:</span>
                  <span className="font-medium text-green-600">{stats.entityBreakdown.agents.approved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Partner Approved:</span>
                  <span className="font-medium text-blue-600">{stats.entityBreakdown.agents.adminApproved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                  <span className="font-medium text-yellow-600">{stats.entityBreakdown.agents.pending}</span>
                </div>
              </div>
            </div>

            {/* Institutions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-gray-800 dark:text-white">🏢 Institutions</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-medium">{stats.entityBreakdown.institutions.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Super Admin Approved:</span>
                  <span className="font-medium text-green-600">{stats.entityBreakdown.institutions.approved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Partner Approved:</span>
                  <span className="font-medium text-blue-600">{stats.entityBreakdown.institutions.adminApproved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                  <span className="font-medium text-yellow-600">{stats.entityBreakdown.institutions.pending}</span>
                </div>
              </div>
            </div>

            {/* Factories */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Factory className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-800 dark:text-white">🏭 Manufacturers</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-medium">{stats.entityBreakdown.factories.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Super Admin Approved:</span>
                  <span className="font-medium text-green-600">{stats.entityBreakdown.factories.approved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Partner Approved:</span>
                  <span className="font-medium text-blue-600">{stats.entityBreakdown.factories.adminApproved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                  <span className="font-medium text-yellow-600">{stats.entityBreakdown.factories.pending}</span>
                </div>
              </div>
            </div>

            {/* Consumers */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-800 dark:text-white">👥 Consumers</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-medium">{stats.entityBreakdown.consumers.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Super Admin Approved:</span>
                  <span className="font-medium text-green-600">{stats.entityBreakdown.consumers.approved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Partner Approved:</span>
                  <span className="font-medium text-blue-600">{stats.entityBreakdown.consumers.adminApproved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                  <span className="font-medium text-yellow-600">{stats.entityBreakdown.consumers.pending}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications Table */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Partner Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Super Admin Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Submitted</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.entities.map((entity) => (
                  <tr key={`${entity.type}-${entity.id}`} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{entity.name}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {entity.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={entity.adminStatus === "Approved" ? "outline" : entity.adminStatus === "Rejected" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {entity.adminStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entity.status)}
                        <Badge variant={getStatusBadgeVariant(entity.status) as any} className="text-xs">
                          {entity.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {new Date(entity.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                        onClick={() => handleViewDetails(entity)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
                {paginatedData.entities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center space-y-2">
                        <Activity className="h-8 w-8 text-gray-400" />
                        <p>No applications found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {paginatedData.totalPages > 1 && (
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginatedData.totalItems)} of {paginatedData.totalItems} applications
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!paginatedData.hasPrevPage}
                  className="flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, paginatedData.totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    const isActive = pageNumber === currentPage;
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-8 h-8 p-0 ${isActive ? 'bg-cyan-600 text-white' : ''}`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  
                  {paginatedData.totalPages > 5 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(paginatedData.totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {paginatedData.totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginatedData.totalPages))}
                  disabled={!paginatedData.hasNextPage}
                  className="flex items-center gap-1"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApprovalReportingDashboard;
