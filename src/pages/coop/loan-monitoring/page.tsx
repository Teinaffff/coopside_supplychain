import React, { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Input } from "../../../common/ui/input";
import { Button } from "../../../common/ui/button";
import { Badge } from "../../../common/ui/badge";
import { DataTable } from "../../../common/ui/data-table";
import { 
  Search, 
  Filter, 
  Download, 
  Clock,
  DollarSign,
  Calendar,
  Package,
  FileText,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";
import { useNavigate } from "react-router-dom";
import loanApplicationService, { LoanApplication } from "../../../services/loanApplicationService";
import { toast } from "react-hot-toast";
import { processLoanApplications, ProcessedLoanApplication, getStatusBadgeConfig } from "../../../lib/loan-status-utils";
import API from "../../../config/axios-config";

type FilterState = {
  loanType: string;
  tenure: string;
  partnerStatus: string;
  superAdminStatus: string;
};

const LoanMonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [processedApplications, setProcessedApplications] = useState<ProcessedLoanApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loanTypes, setLoanTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    loanType: "all",
    tenure: "all",
    partnerStatus: "all",
    superAdminStatus: "all",
  });


  useEffect(() => {
    loadLoanApplications();
    loadLoanTypes();
  }, [filters, searchTerm]);

  const loadLoanTypes = async () => {
    try {
      const response = await API.get('/v1/loan-types');
      const loanTypesData = response.data?.data || response.data || [];
      const typeNames = loanTypesData.map((type: any) => type.name).filter(Boolean);
      setLoanTypes(typeNames);
    } catch (error) {
      console.error('Error loading loan types:', error);
      // Fallback to default loan types if API fails
      setLoanTypes(['Goods Purchase Financing', 'Equipment Financing', 'Working Capital Loan']);
    }
  };

  const loadLoanApplications = async () => {
    try {
      console.log('[LOAD LOAN APPLICATIONS] Fetching real data from API...');
      // Use the new enriched data function that includes agent names
      const applications = await loanApplicationService.getAllLoanApplicationsWithAgentData();
      
      console.log('[LOAD LOAN APPLICATIONS] API returned', applications.length, 'real loan applications');
      console.log('[LOAD LOAN APPLICATIONS] Sample application:', applications[0] ? {
        applicationNumber: applications[0].applicationNumber,
        borrowerName: (applications[0] as any).borrowerName,
        status: (applications[0] as any).status,
        agentStatus: (applications[0] as any).agentStatus
      } : 'No applications');
      
      // Transform API data to match our expected format
      const transformedApplications = applications.map((app: any) => ({
        applicationNumber: app.applicationNumber || app.id || 'N/A',
        loanType: app.loanType || app.type || 'Goods Purchase Financing',
        status: app.status || 'PENDING',
        superAdminStatus: app.superAdminStatus || 'pending',
        // Extract agentStatus - this represents the actual partner/agent status from API
        agentStatus: app.agentStatus || app.agent_status || app.partnerStatus || app.partner_status || undefined,
        requestedAmount: app.requestedAmount || app.amount || app.loanAmount || app.request_amount || app.requestAmount || app.principalAmount || app.principal_amount || app.totalAmount || app.total_amount || app.loanDetails?.amount || app.financialDetails?.amount || app.applicationDetails?.amount || 0,
        approvedAmount: app.approvedAmount || app.approved_amount || undefined,
        tenure: app.tenure || app.duration || 12,
        products: app.products || app.productCount || 0,
        created: app.created || app.createdAt || app.date_created || new Date().toISOString(),
        factoryId: app.factoryId || app.factory_id || app.factory?.id,
        agentId: app.agentId || app.agent_id || app.agent?.id,
        borrowerName: app.borrowerName || app.borrower_name || app.borrower?.name || 'N/A',
        interestRate: app.interestRate || app.interest_rate || undefined,
        purpose: app.purpose || app.description || 'N/A',
        documents: app.documents || app.attachments || [],
        riskScore: app.riskScore || app.risk_score || undefined,
      }));
      
      // Process applications with status logic
      const processed = processLoanApplications(transformedApplications);
      
      // Debug: Log applications that should show in tracking
      const trackingApps = processed.filter(app => app.shouldShowInTracking);
      console.log('Applications for tracking:', trackingApps.map(app => ({
        applicationNumber: app.applicationNumber,
        status: app.status,
        superAdminStatus: app.superAdminStatus,
        displayPartnerStatus: app.displayPartnerStatus,
        displaySuperAdminStatus: app.displaySuperAdminStatus,
        shouldShowInTracking: app.shouldShowInTracking,
        trackingStatus: app.trackingStatus
      })));
      
      setLoanApplications(transformedApplications);
      setProcessedApplications(processed);
      
      // Count applications that should appear in Loan Requests (not in tracking)
      const loanRequestsCount = processed.filter(app => !app.shouldShowInTracking).length;
      console.log('[LOAD LOAN APPLICATIONS] Successfully loaded', transformedApplications.length, 'real loan applications from API');
      console.log('[LOAD LOAN APPLICATIONS] Applications for Loan Requests page:', loanRequestsCount);
      toast.success(`Loaded ${loanRequestsCount} loan applications`);
    } catch (error: any) {
      console.error('Error loading loan applications from API:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      toast.error(`Failed to load loan applications: ${errorMessage}`);
      // Don't use mock data - show error and keep empty state
      setLoanApplications([]);
      setProcessedApplications([]);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (application: ProcessedLoanApplication) => {
    // Store the current page in sessionStorage
    sessionStorage.setItem('loanDetailReferrer', '/coop/loan-monitoring');
    navigate(`/coop/loan-monitoring/${application.applicationNumber}`, {
      state: { from: '/coop/loan-monitoring' }
    });
  };


  const exportToExcel = () => {
    try {
      // Filter the data based on current filters
      let dataToExport = [...processedApplications];

      // Apply search filter
      if (searchTerm) {
        dataToExport = dataToExport.filter(app =>
          app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply loan type filter
      if (filters.loanType !== "all") {
        dataToExport = dataToExport.filter(app => app.loanType === filters.loanType);
      }

      // Apply tenure filter
      if (filters.tenure !== "all") {
        const tenureValue = parseInt(filters.tenure);
        dataToExport = dataToExport.filter(app => app.tenure === tenureValue);
      }

      // Apply partner status filter
      if (filters.partnerStatus !== "all") {
        dataToExport = dataToExport.filter(app => app.displayPartnerStatus === filters.partnerStatus);
      }

      // Apply super admin status filter
      if (filters.superAdminStatus !== "all") {
        dataToExport = dataToExport.filter(app => app.displaySuperAdminStatus === filters.superAdminStatus);
      }

      // Prepare data for Excel export
      const excelData = dataToExport.map(app => ({
        'Application Number': app.applicationNumber,
        'Borrower Name': app.borrowerName || 'N/A',
        'Loan Type': app.loanType,
        'Status by Partner': app.displayPartnerStatus,
        'Status by Super Admin': app.displaySuperAdminStatus,
        'Requested Amount': app.requestedAmount,
        'Approved Amount': app.approvedAmount || 'N/A',
        'Interest Rate': app.interestRate || 'N/A',
        'Tenure (Months)': app.tenure,
        'Products Count': app.products,
        'Created Date': new Date(app.created).toLocaleDateString(),
        'Risk Score': app.riskScore || 'N/A',
        'Purpose': app.purpose || 'N/A',
        'Tracking Status': app.trackingStatus || 'N/A'
      }));

      // Convert to CSV format
      const headers = Object.keys(excelData[0] || {});
      const csvContent = [
        headers.join(','),
        ...excelData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `loan-applications-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Loan applications exported successfully!');
    } catch (error) {
      console.error('Error exporting loan applications:', error);
      toast.error('Failed to export loan applications.');
    }
  };

  const getDisplayStatusBadge = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    const config = getStatusBadgeConfig(status);
    const Icon = config.icon === "Clock" ? Clock : config.icon === "CheckCircle" ? CheckCircle : XCircle;

    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const columns: ColumnDef<ProcessedLoanApplication>[] = useMemo(
    () => [
      {
        accessorKey: "applicationNumber",
        header: "Application No.",
        cell: ({ row }) => (
          <div className="text-blue-600 font-medium py-2">
            {row.getValue("applicationNumber")}
          </div>
        ),
      },
      {
        accessorKey: "borrowerName",
        header: "Borrower Name",
        cell: ({ row }) => (
          <div className="py-2">
            {row.original.borrowerName || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "loanType",
        header: "Loan Type",
        cell: ({ row }) => (
          <div className="py-2">
            <Badge variant="outline">{row.getValue("loanType")}</Badge>
          </div>
        ),
      },
      {
        accessorKey: "requestedAmount",
        header: "Requested Amount",
        cell: ({ row }) => (
          <div className="py-2 font-medium">
            ETB {row.getValue("requestedAmount")?.toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const partnerStatus = row.original.displayPartnerStatus || row.original.agentStatus || "PENDING";
          // If partner status is REJECTED, show REJECTED, otherwise show partner status
          const displayStatus = partnerStatus === "REJECTED" ? "REJECTED" : partnerStatus;
          return (
            <div className="py-2">
              {getDisplayStatusBadge(displayStatus as "PENDING" | "APPROVED" | "REJECTED")}
            </div>
          );
        },
      },
      {
        accessorKey: "created",
        header: "Created Date",
        cell: ({ row }) => (
          <div className="py-2">
            {new Date(row.getValue("created")).toLocaleDateString()}
          </div>
        ),
      },
    ],
    []
  );

  // Filter applications based on current filters
  const filteredApplications = useMemo(() => {
    // First, exclude applications that should show in tracking (like PENDING_AGENT_CONFIRMATION)
    // These should only appear in Loan Status Tracking page, not in Loan Requests
    let filtered = processedApplications.filter(app => !app.shouldShowInTracking);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply loan type filter
    if (filters.loanType !== "all") {
      filtered = filtered.filter(app => app.loanType === filters.loanType);
    }

    // Apply tenure filter
    if (filters.tenure !== "all") {
      const tenureValue = parseInt(filters.tenure);
      filtered = filtered.filter(app => app.tenure === tenureValue);
    }

    // Apply partner status filter
    if (filters.partnerStatus !== "all") {
      filtered = filtered.filter(app => app.displayPartnerStatus === filters.partnerStatus);
    }

    // Apply super admin status filter
    if (filters.superAdminStatus !== "all") {
      filtered = filtered.filter(app => app.displaySuperAdminStatus === filters.superAdminStatus);
    }

    return filtered;
  }, [processedApplications, searchTerm, filters]);

  const stats = useMemo(() => {
    const total = filteredApplications.length;
    const pending = filteredApplications.filter(app => 
      app.displayPartnerStatus === "PENDING" || app.displaySuperAdminStatus === "PENDING"
    ).length;
    const approved = filteredApplications.filter(app => 
      app.displayPartnerStatus === "APPROVED" && app.displaySuperAdminStatus === "APPROVED"
    ).length;
    const totalValue = filteredApplications.reduce((sum, app) => sum + (app.approvedAmount || 0), 0);

    return { total, pending, approved, totalValue };
  }, [filteredApplications]);

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Applications ({stats.total})
          </h1>
          <p className="text-gray-600">Manage Loan Applications and Approvals</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={exportToExcel}
            className="bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 hover:border-cyan-600"
          >
            <Download className="mr-2 h-4 w-4" /> Export to Excel
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All submitted applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Ready for disbursement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loan Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ETB{" "}
              {stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Value of all approved loans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by application number, borrower..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>


            <Select
              value={filters.loanType}
              onValueChange={(value) => handleFilterChange("loanType", value)}
            >
              <SelectTrigger className="w-[180px]">
                <Package className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Loan Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Loan Types</SelectItem>
                {loanTypes.map((loanType) => (
                  <SelectItem key={loanType} value={loanType}>
                    {loanType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.tenure}
              onValueChange={(value) => handleFilterChange("tenure", value)}
            >
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Tenure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenures</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="9">9 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
                <SelectItem value="18">18 Months</SelectItem>
                <SelectItem value="24">24 Months</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.partnerStatus}
              onValueChange={(value) => handleFilterChange("partnerStatus", value)}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Partner Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partner Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.superAdminStatus}
              onValueChange={(value) => handleFilterChange("superAdminStatus", value)}
            >
              <SelectTrigger className="w-[220px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Super Admin Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Super Admin Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loan Applications Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">All Loan Applications</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <DataTable
            columns={columns}
            data={filteredApplications}
            searchKey="applicationNumber"
            searchPlaceholder="Search applications..."
            clickable={true}
            getSelectedRow={handleViewDetails}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanMonitoringPage;