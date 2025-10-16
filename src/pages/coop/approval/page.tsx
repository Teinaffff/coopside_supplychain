import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { Button } from "../../../common/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Badge } from "../../../common/ui/badge";
import { Input } from "../../../common/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw, Search } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../common/ui/data-table";
import ApprovalReportingDashboard from "./ApprovalReportingDashboard";
import { useFactories } from "../hooks/use-factories";
import { useAgents } from "../hooks/use-Agents";
import { useInstitutions } from "../hooks/useInstitutions";



interface DocItem {
  id: number;
  name: string;
  uploadedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}



interface Entity {
  id: number;
  name: string;
  type: "agent" | "factory" | "institution" | "consumer";
  status: "Pending" | "Approved" | "Rejected"; // Super Admin Status (this portal)
  adminStatus: "Pending" | "Approved" | "Rejected"; // Admin Status (external portal)
  docs: DocItem[];
  form: Record<string, any>;
}


const ApprovalManagementPage: React.FC = () => {
  const [filter, setFilter] = useState<DocItem["status"] | "All">("All");
  const [statusFilter, setStatusFilter] = useState<"admin" | "superAdmin">("superAdmin");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Status badge helper functions
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    
    return (
      <Badge variant="outline" className={statusClasses[status as keyof typeof statusClasses]}>
        {status}
      </Badge>
    );
  };

  // Column definitions for Manufacturies table
  const manufacturiesColumns: ColumnDef<Entity>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="text-blue-600 font-medium py-2 cursor-pointer hover:text-blue-800">
            {row.getValue("name")}
          </div>
        ),
      },
      {
        accessorKey: "form.type",
        header: "Type",
        cell: ({ row }) => (
          <div className="py-2">
            <Badge variant="outline">{row.original.form.type || "Manufacturing"}</Badge>
          </div>
        ),
      },
      {
        accessorKey: "form.phone",
        header: "Phone",
        cell: ({ row }) => (
          <div className="py-2">
            {row.original.form.contactPhone || row.original.form.phone || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "adminStatus",
        header: "Status by Partner",
        cell: ({ row }) => (
          <div className="py-2">
            {getStatusBadge(row.getValue("adminStatus"))}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status by Super Admin",
        cell: ({ row }) => (
          <div className="py-2">
            {getStatusBadge(row.getValue("status"))}
          </div>
        ),
      },
    ],
    []
  );

  // Column definitions for Agents table
  const agentsColumns: ColumnDef<Entity>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="text-blue-600 font-medium py-2 cursor-pointer hover:text-blue-800">
            {row.getValue("name")}
          </div>
        ),
      },
      {
        accessorKey: "form.phone",
        header: "Phone",
        cell: ({ row }) => (
          <div className="py-2">
            {row.original.form.phone || row.original.form.phoneNumber || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "form.email",
        header: "Email",
        cell: ({ row }) => (
          <div className="py-2">
            {row.original.form.email || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "adminStatus",
        header: "Status by Partner",
        cell: ({ row }) => (
          <div className="py-2">
            {getStatusBadge(row.getValue("adminStatus"))}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status by Super Admin",
        cell: ({ row }) => (
          <div className="py-2">
            {getStatusBadge(row.getValue("status"))}
          </div>
        ),
      },
    ],
    []
  );

  // Column definitions for Institutions table
  const institutionsColumns: ColumnDef<Entity>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="text-blue-600 font-medium py-2 cursor-pointer hover:text-blue-800">
            {row.getValue("name")}
          </div>
        ),
      },
      {
        accessorKey: "form.phone",
        header: "Phone",
        cell: ({ row }) => (
          <div className="py-2">
            {row.original.form.contactPhone || row.original.form.phone || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "form.email",
        header: "Email",
        cell: ({ row }) => (
          <div className="py-2">
            {row.original.form.contactEmail || row.original.form.email || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "form.tin",
        header: "TIN",
        cell: ({ row }) => (
          <div className="py-2">
            {row.original.form.tin || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "adminStatus",
        header: "Status by Partner",
        cell: ({ row }) => (
          <div className="py-2">
            {getStatusBadge(row.getValue("adminStatus"))}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status by Super Admin",
        cell: ({ row }) => (
          <div className="py-2">
            {getStatusBadge(row.getValue("status"))}
          </div>
        ),
      },
    ],
    []
  );
  
  // Fetch real data from APIs
  const { factories, isLoading: factoriesLoading, refetch: refetchFactories } = useFactories();
  const { agents, isLoading: agentsLoading, refetch: refetchAgents } = useAgents();
  const { institutions, isLoading: institutionsLoading, refetch: refetchInstitutions } = useInstitutions();

  // Filter entities based on selected filters and search
  const filterEntities = (entities: Entity[]) => {
    return entities.filter(entity => {
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          entity.name.toLowerCase().includes(searchLower) ||
          entity.form?.email?.toLowerCase().includes(searchLower) ||
          entity.form?.phone?.toLowerCase().includes(searchLower) ||
          entity.form?.phoneNumber?.toLowerCase().includes(searchLower) ||
          entity.form?.contactPhone?.toLowerCase().includes(searchLower) ||
          entity.form?.tin?.toLowerCase().includes(searchLower) ||
          entity.form?.type?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Filter by status type (admin or superAdmin)
      const statusToCheck = statusFilter === "admin" ? entity.adminStatus : entity.status;
      
      // Filter by status value (All, Pending, Approved, Rejected)
      if (filter !== "All" && statusToCheck !== filter) {
        return false;
      }
      
      return true;
    });
  };

  // Combine all entities for real-time data with filtering applied
  const entities: Record<string, Entity[]> = {
    factories: filterEntities(factories || []),
    institutions: filterEntities(institutions || []),
    agents: filterEntities(agents || []),
  };
  
  const navigate = useNavigate();

  // Refresh all data
  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchFactories(),
        refetchAgents(),
        refetchInstitutions()
      ]);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Handle tab parameter from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['dashboard', 'factories', 'agents', 'institutions'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Click handlers for each table
  const handleManufacturyClick = (manufactury: Entity) => {
    navigate(`/coop/approval/factories/${manufactury.id}`);
  };

  const handleAgentClick = (agent: Entity) => {
    navigate(`/coop/approval/agents/${agent.id}`);
  };

  const handleInstitutionClick = (institution: Entity) => {
    navigate(`/coop/approval/institutions/${institution.id}`);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);
  
  
  // Replace renderTable calls with renderEntitiesTable and add details panel after TabsContent
  
  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Approval Management</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={factoriesLoading || agentsLoading || institutionsLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${(factoriesLoading || agentsLoading || institutionsLoading) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 dark:bg-slate-700">
              <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
              <TabsTrigger value="factories">🏭 Manufacturies</TabsTrigger>
              <TabsTrigger value="agents">🛒 Agents/Sellers</TabsTrigger>
              <TabsTrigger value="institutions">🏢 Institutions</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-4">
              <ApprovalReportingDashboard />
            </TabsContent>
            <TabsContent value="factories" className="mt-4">
              {/* Filter Section for Manufacturies */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Section */}
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by name, email, phone, department, or national ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

            {/* Status Type Filter */}
                  <div className="lg:w-80">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Status Type
                    </label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={statusFilter === "superAdmin" ? "default" : "outline"}
                onClick={() => setStatusFilter("superAdmin")}
                        className="flex-1"
              >
                        Status by Super Admin
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "admin" ? "default" : "outline"}
                onClick={() => setStatusFilter("admin")}
                        className="flex-1"
              >
                        Status by Partner
              </Button>
                    </div>
            </div>
            
            {/* Status Value Filter */}
                  <div className="lg:w-80">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Status
                    </label>
                    <div className="flex gap-1">
              {["All", "Pending", "Approved", "Rejected"].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={filter === s ? "default" : "outline"}
                  onClick={() => setFilter(s as any)}
                          className="flex-1 text-xs"
                >
                  {s}
                </Button>
              ))}
            </div>
                  </div>
                </div>

          </div>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Manufacturies</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <DataTable
                    columns={manufacturiesColumns}
                    data={entities.factories}
                    searchKey="name"
                    clickable={true}
                    getSelectedRow={handleManufacturyClick}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="agents" className="mt-4">
              {/* Filter Section for Agents */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Section */}
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by name, email, phone, department, or national ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Status Type Filter */}
                  <div className="lg:w-80">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Status Type
                    </label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={statusFilter === "superAdmin" ? "default" : "outline"}
                        onClick={() => setStatusFilter("superAdmin")}
                        className="flex-1"
                      >
                        Status by Super Admin
                      </Button>
                      <Button
                        size="sm"
                        variant={statusFilter === "admin" ? "default" : "outline"}
                        onClick={() => setStatusFilter("admin")}
                        className="flex-1"
                      >
                        Status by Partner
                      </Button>
                    </div>
                  </div>

                  {/* Status Value Filter */}
                  <div className="lg:w-80">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Status
                    </label>
                    <div className="flex gap-1">
                      {["All", "Pending", "Approved", "Rejected"].map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={filter === s ? "default" : "outline"}
                          onClick={() => setFilter(s as any)}
                          className="flex-1 text-xs"
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Agents/Sellers</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <DataTable
                    columns={agentsColumns}
                    data={entities.agents}
                    searchKey="name"
                    clickable={true}
                    getSelectedRow={handleAgentClick}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="institutions" className="mt-4">
              {/* Filter Section for Institutions */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Section */}
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by name, email, phone, department, or national ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Status Type Filter */}
                  <div className="lg:w-80">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Status Type
                    </label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={statusFilter === "superAdmin" ? "default" : "outline"}
                        onClick={() => setStatusFilter("superAdmin")}
                        className="flex-1"
                      >
                        Status by Super Admin
                      </Button>
                      <Button
                        size="sm"
                        variant={statusFilter === "admin" ? "default" : "outline"}
                        onClick={() => setStatusFilter("admin")}
                        className="flex-1"
                      >
                        Status by Partner
                      </Button>
                    </div>
                  </div>

                  {/* Status Value Filter */}
                  <div className="lg:w-80">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Status
                    </label>
                    <div className="flex gap-1">
                      {["All", "Pending", "Approved", "Rejected"].map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={filter === s ? "default" : "outline"}
                          onClick={() => setFilter(s as any)}
                          className="flex-1 text-xs"
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Institutions</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <DataTable
                    columns={institutionsColumns}
                    data={entities.institutions}
                    searchKey="name"
                    clickable={true}
                    getSelectedRow={handleInstitutionClick}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>


        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalManagementPage;