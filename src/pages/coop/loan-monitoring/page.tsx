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

type FilterState = {
  status: string;
  loanType: string;
  tenure: string;
};

const LoanMonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    loanType: "all",
    tenure: "all",
  });

  // Mock data for development
  const mockLoanApplications: LoanApplication[] = [
    {
      applicationNumber: "LA-7A4FF322",
      loanType: "Goods Purchase Financing",
      status: "DISBURSED",
      superAdminStatus: "approved",
      requestedAmount: 4300,
      approvedAmount: 4000,
      tenure: 12,
      products: 2,
      created: "2025-07-10T10:00:00Z",
      factoryId: "FAC-67890",
      agentId: "AG-12345",
      borrowerName: "Alice Smith",
      interestRate: 10,
      purpose: "Purchase steel pipes and cement bags for construction project.",
      documents: [
        { name: "Proforma Invoice", url: "/docs/invoice-7A4FF322.pdf" },
        { name: "Business License", url: "/docs/license-AliceSmith.pdf" },
      ],
      riskScore: 75,
    },
    {
      applicationNumber: "LA-8B5GG433",
      loanType: "Equipment Financing",
      status: "PENDING_SUPER_ADMIN_APPROVAL",
      superAdminStatus: "pending",
      requestedAmount: 15000,
      approvedAmount: undefined,
      tenure: 24,
      products: 1,
      created: "2025-07-09T14:30:00Z",
      factoryId: "FAC-11223",
      agentId: "AG-98765",
      borrowerName: "Bob Johnson",
      interestRate: undefined,
      purpose: "Financing new agricultural machinery.",
      documents: [
        { name: "Equipment Quote", url: "/docs/quote-8B5GG433.pdf" },
      ],
      riskScore: 60,
    },
    {
      applicationNumber: "LA-9C6HH544",
      loanType: "Goods Purchase Financing",
      status: "APPROVED",
      superAdminStatus: "approved",
      requestedAmount: 7500,
      approvedAmount: 7000,
      tenure: 18,
      products: 3,
      created: "2025-07-08T09:15:00Z",
      factoryId: "FAC-44556",
      agentId: "AG-12345",
      borrowerName: "Charlie Brown",
      interestRate: 8,
      purpose: "Bulk purchase of raw materials.",
      documents: [
        { name: "Supplier Invoice", url: "/docs/invoice-9C6HH544.pdf" },
      ],
      riskScore: 80,
    },
    {
      applicationNumber: "LA-1D7II655",
      loanType: "Working Capital Loan",
      status: "REJECTED",
      superAdminStatus: "rejected",
      requestedAmount: 10000,
      approvedAmount: undefined,
      tenure: 6,
      products: 0,
      created: "2025-07-07T11:00:00Z",
      factoryId: "FAC-77889",
      agentId: "AG-54321",
      borrowerName: "Diana Prince",
      interestRate: undefined,
      purpose: "Short-term operational expenses.",
      documents: [],
      riskScore: 45,
    },
    {
      applicationNumber: "LA-2E8JJ766",
      loanType: "Goods Purchase Financing",
      status: "PENDING_PARTNER_APPROVAL",
      superAdminStatus: "pending",
      requestedAmount: 3000,
      approvedAmount: undefined,
      tenure: 9,
      products: 1,
      created: "2025-07-06T16:00:00Z",
      factoryId: "FAC-99001",
      agentId: "AG-98765",
      borrowerName: "Eve Adams",
      interestRate: undefined,
      purpose: "Purchase of office supplies.",
      documents: [
        { name: "Quotation", url: "/docs/quote-2E8JJ766.pdf" },
      ],
      riskScore: 70,
    },
  ];

  useEffect(() => {
    loadLoanApplications();
  }, [filters, searchTerm]);

  const loadLoanApplications = async () => {
    try {
      const applications = await loanApplicationService.getAllLoanApplications();
      
      // Transform API data to match our expected format
      const transformedApplications = applications.map((app: any) => ({
        applicationNumber: app.applicationNumber || app.id || 'N/A',
        loanType: app.loanType || app.type || 'Goods Purchase Financing',
        status: app.status || 'PENDING',
        requestedAmount: app.requestedAmount || app.amount || 0,
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
      
      setLoanApplications(transformedApplications);
      toast.success(`Loaded ${transformedApplications.length} loan applications`);
    } catch (error) {
      console.error('Error loading loan applications from API:', error);
      toast.error('Failed to load loan applications from API. Using mock data for demonstration.');
      setLoanApplications(mockLoanApplications);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (application: LoanApplication) => {
    navigate(`/coop/loan-monitoring/${application.applicationNumber}`);
  };


  const exportToExcel = () => {
    try {
      // Filter the data based on current filters
      let dataToExport = [...loanApplications];

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

      // Apply status filter
      if (filters.status !== "all") {
        dataToExport = dataToExport.filter(app => app.status === filters.status);
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

      // Prepare data for Excel export
      const excelData = dataToExport.map(app => ({
        'Application Number': app.applicationNumber,
        'Borrower Name': app.borrowerName || 'N/A',
        'Loan Type': app.loanType,
        'Status by Partner': app.status.replace(/_/g, ' '),
        'Status by Super Admin': (app.superAdminStatus || 'pending').toUpperCase(),
        'Requested Amount': app.requestedAmount,
        'Approved Amount': app.approvedAmount || 'N/A',
        'Interest Rate': app.interestRate || 'N/A',
        'Tenure (Months)': app.tenure,
        'Products Count': app.products,
        'Created Date': new Date(app.created).toLocaleDateString(),
        'Risk Score': app.riskScore || 'N/A',
        'Purpose': app.purpose || 'N/A'
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DISBURSED: { variant: "default" as const, color: "bg-green-100 text-green-800", icon: CheckCircle },
      PENDING_PARTNER_APPROVAL: { variant: "secondary" as const, color: "bg-orange-100 text-orange-800", icon: Clock },
      PENDING_SUPER_ADMIN_APPROVAL: { variant: "secondary" as const, color: "bg-purple-100 text-purple-800", icon: Clock },
      APPROVED: { variant: "default" as const, color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      REJECTED: { variant: "destructive" as const, color: "bg-red-100 text-red-800", icon: XCircle },
      DRAFT: { variant: "outline" as const, color: "bg-gray-100 text-gray-800", icon: Clock },
      CANCELLED: { variant: "outline" as const, color: "bg-gray-100 text-gray-800", icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const getSuperAdminStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { variant: "default" as const, color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { variant: "destructive" as const, color: "bg-red-100 text-red-800", icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const columns: ColumnDef<LoanApplication>[] = useMemo(
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
        accessorKey: "approvedAmount",
        header: "Approved Amount",
        cell: ({ row }) => (
          <div className="py-2 font-medium">
            {row.original.approvedAmount ? `ETB ${row.original.approvedAmount.toLocaleString()}` : "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status by Partner",
        cell: ({ row }) => (
          <div className="py-2">
            {getStatusBadge(row.getValue("status"))}
          </div>
        ),
      },
      {
        accessorKey: "superAdminStatus",
        header: "Status by Super Admin",
        cell: ({ row }) => (
          <div className="py-2">
            {getSuperAdminStatusBadge(row.original.superAdminStatus || "pending")}
          </div>
        ),
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

  const stats = useMemo(() => {
    const total = loanApplications.length;
    const pending = loanApplications.filter(app => 
      app.status === "PENDING_PARTNER_APPROVAL" || app.status === "PENDING_SUPER_ADMIN_APPROVAL"
    ).length;
    const approved = loanApplications.filter(app => 
      app.status === "APPROVED" || app.status === "DISBURSED"
    ).length;
    const totalValue = loanApplications.reduce((sum, app) => sum + (app.approvedAmount || 0), 0);

    return { total, pending, approved, totalValue };
  }, [loanApplications]);

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
                placeholder="Search by application number, borrower, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING_PARTNER_APPROVAL">Pending Partner Approval</SelectItem>
                <SelectItem value="PENDING_SUPER_ADMIN_APPROVAL">Pending Super Admin Approval</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="DISBURSED">Disbursed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>

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
                <SelectItem value="Goods Purchase Financing">Goods Purchase Financing</SelectItem>
                <SelectItem value="Equipment Financing">Equipment Financing</SelectItem>
                <SelectItem value="Working Capital Loan">Working Capital Loan</SelectItem>
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
            data={loanApplications}
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