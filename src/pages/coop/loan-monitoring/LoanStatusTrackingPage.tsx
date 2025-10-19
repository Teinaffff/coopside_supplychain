import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../common/ui/dialog";
import loanApplicationService, { LoanApplication } from "../../../services/loanApplicationService";
import disbursementService from "../../../services/disbursementService";
import { toast } from "react-hot-toast";
import { processLoanApplications, ProcessedLoanApplication } from "../../../lib/loan-status-utils";
import API from "../../../config/axios-config";

type FilterState = {
  loanType: string;
  tenure: string;
  disbursementStatus: string;
};

const LoanStatusTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [processedApplications, setProcessedApplications] = useState<ProcessedLoanApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loanTypes, setLoanTypes] = useState<string[]>([]);
  const [disbursingApplications, setDisbursingApplications] = useState<Set<string>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ProcessedLoanApplication | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    loanType: "all",
    tenure: "all",
    disbursementStatus: "all",
  });

  useEffect(() => {
    loadLoanApplications();
    loadLoanTypes();
  }, [filters, searchTerm]);

  useEffect(() => {
    loadLoanTypes();
  }, []);

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
      // Use the new enriched data function that includes agent names
      const applications = await loanApplicationService.getAllLoanApplicationsWithAgentData();
      
      // Debug: Log the structure of the first application to see available fields
      if (applications.length > 0) {
        console.log('=== API RESPONSE DEBUG ===');
        console.log('First application structure:', applications[0]);
        console.log('Available fields:', Object.keys(applications[0]));
        console.log('Approved amount fields:', {
          approvedAmount: (applications[0] as any).approvedAmount,
          approved_amount: (applications[0] as any).approved_amount,
          loanApprovedAmount: (applications[0] as any).loanApprovedAmount,
          disbursedAmount: (applications[0] as any).disbursedAmount,
          amount: (applications[0] as any).amount,
          loanAmount: (applications[0] as any).loanAmount
        });
      }

      // Try to enrich applications with disbursement data for approved amounts
      const enrichedApplications = await Promise.all(
        applications.map(async (app: any) => {
          try {
            // Try to get disbursement details for approved applications
            if (app.status === 'APPROVED' || app.status === 'DISBURSED') {
              const disbursementData = await disbursementService.getDisbursementByApplication(app.applicationNumber);
              console.log(`Disbursement data for ${app.applicationNumber}:`, disbursementData);
              
              return {
                ...app,
                approvedAmount: app.approvedAmount || app.approved_amount || disbursementData?.loanAmount || (disbursementData as any)?.approvedAmount || app.amount || app.loanAmount,
                fees: app.fees || app.processingFee || app.loanFees || disbursementData?.loanFees || 0,
                interest: app.interest || app.interestAmount || app.loanInterest || disbursementData?.loanInterest || 0,
              };
            }
            return app;
          } catch (error) {
            console.warn(`Could not fetch disbursement data for ${app.applicationNumber}:`, error);
            return app;
          }
        })
      );

      // Transform API data to match our expected format
      const transformedApplications = enrichedApplications.map((app: any) => ({
        applicationNumber: app.applicationNumber || app.id || 'N/A',
        loanType: app.loanType || app.type || 'Goods Purchase Financing',
        status: app.status || 'PENDING',
        superAdminStatus: app.superAdminStatus || 'pending',
        requestedAmount: app.requestedAmount || app.amount || app.loanAmount || app.request_amount || app.requestAmount || app.principalAmount || app.principal_amount || app.totalAmount || app.total_amount || app.loanDetails?.amount || app.financialDetails?.amount || app.applicationDetails?.amount || 0,
        approvedAmount: app.approvedAmount || app.approved_amount || app.approvedAmountValue || app.approved_amount_value || app.loanApprovedAmount || app.loan_approved_amount || app.finalApprovedAmount || app.final_approved_amount || app.amountApproved || app.amount_approved || app.approvedLoanAmount || app.approved_loan_amount || app.disbursedAmount || app.disbursed_amount || undefined,
        fees: app.fees || app.processingFee || app.loanFees || 0,
        interest: app.interest || app.interestAmount || app.loanInterest || 0,
        agentStatus: app.agentStatus || (app.status === 'APPROVED' || app.status === 'DISBURSED' ? 'APPROVED' : 'PENDING'),
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
      
      // Process applications directly
      setProcessedApplications(processed);
      toast.success(`Loaded  loan applications with agent data`);
    } catch (error) {
      console.error('Error loading loan applications from API:', error);
      toast.error('Failed to load loan applications from API. Using mock data for demonstration.');
      // Use mock data for demonstration
      const mockApplications: LoanApplication[] = [
        {
          applicationNumber: "LA-7A4FF322",
          loanType: "Goods Purchase Financing",
          status: "DISBURSED",
          superAdminStatus: "approved",
          requestedAmount: 4300,
          approvedAmount: 4000,
          fees: 200,
          interest: 300,
          agentStatus: "APPROVED",
          tenure: 12,
          products: 2,
          created: "2025-07-10T10:00:00Z",
          factoryId: "FAC-67890",
          agentId: "AG-12345",
          borrowerName: "Unknown Agent",
          interestRate: 10,
          purpose: "Purchase steel pipes and cement bags for construction project.",
          documents: [],
          riskScore: 75,
        },
        {
          applicationNumber: "LA-5AAE5E9B",
          loanType: "Goods Purchase Financing",
          status: "APPROVED",
          superAdminStatus: "approved",
          requestedAmount: 100,
          approvedAmount: 0,
          fees: 50,
          interest: 25,
          agentStatus: "APPROVED",
          tenure: 12,
          products: 1,
          created: "2025-07-07T10:00:00Z",
          factoryId: "FAC-12345",
          agentId: "AG-67890",
          borrowerName: "Sara Jemal",
          interestRate: 8,
          purpose: "Purchase office supplies.",
          documents: [],
          riskScore: 80,
        },
        {
          applicationNumber: "LA-9488CA1E",
          loanType: "Goods Purchase Financing",
          status: "DISBURSED",
          superAdminStatus: "approved",
          requestedAmount: 5000,
          approvedAmount: 4000,
          fees: 300,
          interest: 400,
          agentStatus: "APPROVED",
          tenure: 18,
          products: 3,
          created: "2025-07-08T14:30:00Z",
          factoryId: "FAC-11223",
          agentId: "AG-98765",
          borrowerName: "Sara Jemal",
          interestRate: 9,
          purpose: "Bulk purchase of raw materials.",
          documents: [],
          riskScore: 85,
        },
      ];
      const processed = processLoanApplications(mockApplications);
      // Use mock data directly
      setProcessedApplications(processed);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (application: ProcessedLoanApplication) => {
    // Only navigate if not clicking on action buttons
    console.log('Navigating to loan detail with state:', { from: '/coop/loan-monitoring/tracking' });
    // Store the current page in sessionStorage
    sessionStorage.setItem('loanDetailReferrer', '/coop/loan-monitoring/tracking');
    navigate(`/coop/loan-monitoring/${application.applicationNumber}`, {
      state: { from: '/coop/loan-monitoring/tracking' }
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

      // Apply disbursement status filter
      if (filters.disbursementStatus !== "all") {
        dataToExport = dataToExport.filter(app => app.trackingStatus === filters.disbursementStatus);
      }

      // Filter only tracking applications
      dataToExport = dataToExport.filter(app => app.shouldShowInTracking);

      if (dataToExport.length === 0) {
        toast.error('No data available to export. Please check your filters.');
        return;
      }

      // Prepare data for Excel export
      const excelData = dataToExport.map(app => ({
        'Application Number': app.applicationNumber,
        'Borrower Name': app.borrowerName || 'N/A',
        'Loan Type': app.loanType,
        'Requested Amount': `ETB ${app.requestedAmount.toLocaleString()}`,
        'Approved Amount': app.approvedAmount ? `ETB ${app.approvedAmount.toLocaleString()}` : 'N/A',
        'Fees': app.fees ? `ETB ${app.fees.toLocaleString()}` : 'N/A',
        'Interest': app.interest ? `ETB ${app.interest.toLocaleString()}` : 'N/A',
        'Agent Status': app.agentStatus || 'N/A',
        'Interest Rate': app.interestRate ? `${app.interestRate}%` : 'N/A',
        'Tenure (Months)': app.tenure,
        'Disbursement Status': app.trackingStatus?.replace(/_/g, ' ') || 'N/A',
        'Risk Score': app.riskScore || 'N/A',
        'Purpose': app.purpose || 'N/A',
        'Partner Status': app.displayPartnerStatus,
        'Super Admin Status': app.displaySuperAdminStatus
      }));

      // Convert to CSV format
      const headers = Object.keys(excelData[0] || {});
      const csvContent = [
        headers.join(','),
        ...excelData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
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
      link.setAttribute('download', `loan-status-tracking-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Successfully exported ${dataToExport.length} loan records to Excel!`);
    } catch (error) {
      console.error('Error exporting loan status tracking data:', error);
      toast.error('Failed to export loan status tracking data. Please try again.');
    }
  };


  const getTrackingStatusBadge = (status: "DISBURSED" | "NOT_DISBURSED") => {
    const config = {
      DISBURSED: { 
        variant: "default" as const, 
        color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
        icon: CheckCircle
      },
      NOT_DISBURSED: { 
        variant: "secondary" as const, 
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock
      }
    };

    const statusConfig = config[status];
    const Icon = statusConfig.icon;

    return (
      <Badge variant={statusConfig.variant} className={statusConfig.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const getAgentStatusBadge = (status: string) => {
    const config = {
      APPROVED: { 
        variant: "default" as const, 
        color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
        icon: CheckCircle
      },
      PENDING: { 
        variant: "secondary" as const, 
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: Clock
      },
      REJECTED: { 
        variant: "destructive" as const, 
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: Clock
      }
    };

    const statusConfig = config[status as keyof typeof config] || config.PENDING;
    const Icon = statusConfig.icon;

    return (
      <Badge variant={statusConfig.variant} className={statusConfig.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status || "PENDING"}
      </Badge>
    );
  };

  const handleDisburseClick = (application: ProcessedLoanApplication) => {
    setSelectedApplication(application);
    setShowConfirmDialog(true);
  };

  const handleConfirmDisburse = async () => {
    if (!selectedApplication) return;

    try {
      if (!selectedApplication.agentId) {
        toast.error('Agent ID is required for disbursement');
        return;
      }

      // Add to loading state
      setDisbursingApplications(prev => new Set(prev).add(selectedApplication.applicationNumber));

      console.log('Disbursing loan for application:', selectedApplication.applicationNumber);
      
      const response = await disbursementService.disburseLoan({
        applicationNumber: selectedApplication.applicationNumber,
        agentId: selectedApplication.agentId,
        remarks: `Loan disbursed for ${selectedApplication.borrowerName}`
      });
      
      console.log('Disbursement response:', response);
      
      if (response) {
        toast.success('Loan disbursed successfully!');
        // Reload applications to reflect the change
        await loadLoanApplications();
        // Close dialog
        setShowConfirmDialog(false);
        setSelectedApplication(null);
      }
    } catch (error: any) {
      console.error('Error disbursing loan:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(`Failed to disburse loan: ${error.response?.data?.message || error.message}`);
    } finally {
      // Remove from loading state
      setDisbursingApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedApplication.applicationNumber);
        return newSet;
      });
    }
  };

  const handleCancelDisburse = () => {
    setShowConfirmDialog(false);
    setSelectedApplication(null);
  };


  const columns = [
    {
      accessorKey: "applicationNumber",
      header: "Application No.",
      cell: ({ row }: any) => (
        <div className="text-blue-600 font-medium py-2 cursor-pointer hover:text-blue-800">
          {row.getValue("applicationNumber")}
        </div>
      ),
    },
    {
      accessorKey: "borrowerName",
      header: "Borrower Name",
      cell: ({ row }: any) => (
        <div className="py-2">
          {row.original.borrowerName || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "loanType",
      header: "Loan Type",
      cell: ({ row }: any) => (
        <div className="py-2">
          <Badge variant="outline">{row.getValue("loanType")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "requestedAmount",
      header: "Requested Amount",
      cell: ({ row }: any) => (
        <div className="py-2 font-medium">
          {row.original.requestedAmount ? `ETB ${row.original.requestedAmount.toLocaleString()}` : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "approvedAmount",
      header: "Approved Amount",
      cell: ({ row }: any) => (
        <div className="py-2 font-medium">
          {row.original.approvedAmount ? `ETB ${row.original.approvedAmount.toLocaleString()}` : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "fees",
      header: "Fees",
      cell: ({ row }: any) => (
        <div className="py-2">
          {row.original.fees ? `ETB ${row.original.fees.toLocaleString()}` : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "interest",
      header: "Interest",
      cell: ({ row }: any) => (
        <div className="py-2">
          {row.original.interest ? `ETB ${row.original.interest.toLocaleString()}` : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "agentStatus",
      header: "Agent Status",
      cell: ({ row }: any) => (
        <div className="py-2">
          {getAgentStatusBadge(row.original.agentStatus)}
        </div>
      ),
    },
    {
      accessorKey: "trackingStatus",
      header: "Disbursement Status",
      cell: ({ row }: any) => (
        <div className="py-2">
          {row.original.trackingStatus ? getTrackingStatusBadge(row.original.trackingStatus) : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const isDisbursing = disbursingApplications.has(row.original.applicationNumber);
        const canDisburse = row.original.agentStatus === "APPROVED" && row.original.trackingStatus === "NOT_DISBURSED";
        
        return (
          <div className="py-2 flex space-x-2">
            {canDisburse && (
              <Button
                size="sm"
                disabled={isDisbursing}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDisburseClick(row.original);
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
              >
                {isDisbursing ? "Processing..." : "Disburse"}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const trackingApplications = processedApplications.filter(app => app.shouldShowInTracking);

  const stats = {
    total: trackingApplications.length,
    disbursed: trackingApplications.filter(app => app.trackingStatus === "DISBURSED").length,
    notDisbursed: trackingApplications.filter(app => app.trackingStatus === "NOT_DISBURSED").length,
    totalValue: trackingApplications.reduce((sum, app) => sum + (app.approvedAmount || 0), 0)
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Status Tracking ({stats.total})
          </h1>
          <p className="text-gray-600">Track approved loans and their disbursement status</p>
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
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Approved loan applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disbursed</CardTitle>
            <CheckCircle className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">{stats.disbursed}</div>
            <p className="text-xs text-muted-foreground">
              Loans disbursed to borrowers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Disbursement</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.notDisbursed}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting disbursement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ETB {stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total approved loan value
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
              value={filters.disbursementStatus}
              onValueChange={(value) => handleFilterChange("disbursementStatus", value)}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Disbursement Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Disbursement Status</SelectItem>
                <SelectItem value="DISBURSED">Disbursed</SelectItem>
                <SelectItem value="NOT_DISBURSED">Not Disbursed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Approved Loans Tracking</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {trackingApplications.length > 0 ? (
            <DataTable
              columns={columns}
              data={trackingApplications}
              searchKey="applicationNumber"
              searchPlaceholder="Search approved loans..."
              clickable={true}
              getSelectedRow={handleViewDetails}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No approved loans available for tracking</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Disbursement
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve and disburse this loan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Application:</span>
                  <p className="font-semibold">{selectedApplication.applicationNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Borrower:</span>
                  <p className="font-semibold">{selectedApplication.borrowerName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Requested Amount:</span>
                  <p className="font-semibold">ETB {selectedApplication.requestedAmount?.toLocaleString() || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Approved Amount:</span>
                  <p className="font-semibold">
                    {selectedApplication.approvedAmount ? `ETB ${selectedApplication.approvedAmount.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Fees:</span>
                  <p className="font-semibold">
                    {selectedApplication.fees ? `ETB ${selectedApplication.fees.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Interest:</span>
                  <p className="font-semibold">
                    {selectedApplication.interest ? `ETB ${selectedApplication.interest.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDisburse}
              disabled={disbursingApplications.has(selectedApplication?.applicationNumber || '')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDisburse}
              disabled={disbursingApplications.has(selectedApplication?.applicationNumber || '')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {disbursingApplications.has(selectedApplication?.applicationNumber || '') ? 'Processing...' : 'Confirm Disbursement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanStatusTrackingPage;
