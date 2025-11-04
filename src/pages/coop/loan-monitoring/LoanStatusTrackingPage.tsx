import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Input } from "../../../common/ui/input";
import { Button } from "../../../common/ui/button";
import { Badge } from "../../../common/ui/badge";
import { DataTable } from "../../../common/ui/data-table";
import { 
  Search, 
  Download, 
  Clock,
  DollarSign,
  Calendar,
  Package,
  CheckCircle,
  TrendingUp,
  XCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";
import loanApplicationService, { LoanApplication } from "../../../services/loanApplicationService";
import disbursementService from "../../../services/disbursementService";
import repaymentService from "../../../services/repaymentService";
import { toast } from "react-hot-toast";
import { processLoanApplications, ProcessedLoanApplication } from "../../../lib/loan-status-utils";
import API from "../../../config/axios-config";

type FilterState = {
  loanType: string;
  tenure: string;
  status: string;
};

const LoanStatusTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [processedApplications, setProcessedApplications] = useState<ProcessedLoanApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loanTypes, setLoanTypes] = useState<string[]>([]);
  const [agentsWithRepayments, setAgentsWithRepayments] = useState<Set<string>>(new Set());
  const [isCheckingRepayments, setIsCheckingRepayments] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    loanType: "all",
    tenure: "all",
    status: "all",
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
      console.log('[LOAD LOAN APPLICATIONS - TRACKING] Fetching real data from API...');
      // Use the new enriched data function that includes agent names
      const applications = await loanApplicationService.getAllLoanApplicationsWithAgentData();
      
      console.log('[LOAD LOAN APPLICATIONS - TRACKING] API returned', applications.length, 'real loan applications');
      
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
        // Extract agentStatus - this represents the actual partner/agent status from API
        agentStatus: app.agentStatus || app.agent_status || app.partnerStatus || app.partner_status || undefined,
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
        agentStatus: app.agentStatus,
        superAdminStatus: app.superAdminStatus,
        displayPartnerStatus: app.displayPartnerStatus,
        displaySuperAdminStatus: app.displaySuperAdminStatus,
        shouldShowInTracking: app.shouldShowInTracking,
        trackingStatus: app.trackingStatus
      })));
      
      // Process applications directly
      setProcessedApplications(processed);
      
      // Count applications that should appear in Loan Status Tracking
      const trackingCount = processed.filter(app => app.shouldShowInTracking).length;
      console.log('[LOAD LOAN APPLICATIONS - TRACKING] Successfully loaded', processed.length, 'real loan applications from API');
      console.log('[LOAD LOAN APPLICATIONS - TRACKING] Applications for tracking:', trackingCount);
      
      // Check which agents have repayments
      checkAgentsWithRepayments(processed);
      
      toast.success(`Loaded ${trackingCount} loan applications`);
    } catch (error: any) {
      console.error('Error loading loan applications from API:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      toast.error(`Failed to load loan applications: ${errorMessage}`);
      // Don't use mock data - show error and keep empty state
      setProcessedApplications([]);
    }
  };

  const checkAgentsWithRepayments = async (applications: ProcessedLoanApplication[]) => {
    // Get unique agent IDs
    const uniqueAgentIds = [...new Set(
      applications
        .filter(app => app.agentId)
        .map(app => app.agentId!.toString())
    )];

    if (uniqueAgentIds.length === 0) {
      return;
    }

    setIsCheckingRepayments(true);
    const agentsWithData = new Set<string>();

    // Check each agent for repayments using the same flow as RepaymentDetailPage:
    // 1. First get all loan applications by agent ID
    // 2. Then for each loan application, check if it has repayment data
    const checkPromises = uniqueAgentIds.map(async (agentId) => {
      try {
        // Step 1: Get all loan applications for this agent
        let loanApplications: any = await loanApplicationService.getLoanApplicationsByAgent(agentId);
        
        // Handle nested response structure
        if (loanApplications && !Array.isArray(loanApplications) && (loanApplications as any).data) {
          loanApplications = (loanApplications as any).data;
        }
        if (!Array.isArray(loanApplications)) {
          loanApplications = loanApplications ? [loanApplications] : [];
        }

        if (loanApplications.length === 0) {
          console.debug(`No loan applications found for agent ${agentId}`);
          return;
        }

        // Step 2: Check if any loan application has repayment data
        const repaymentCheckPromises = loanApplications.map(async (loanApp: any) => {
          const applicationNumber = loanApp.applicationNumber || loanApp.id;
          if (!applicationNumber) {
            return false;
          }
          
          try {
            const repayments = await repaymentService.getRepaymentsByLoan(applicationNumber);
            return repayments && repayments.length > 0;
          } catch (error) {
            // If no repayment found for this loan, that's okay
            return false;
          }
        });

        const repaymentResults = await Promise.all(repaymentCheckPromises);
        const hasAnyRepayments = repaymentResults.some(hasRepayment => hasRepayment === true);

        if (hasAnyRepayments) {
          agentsWithData.add(agentId);
          console.debug(`Agent ${agentId} has repayment data`);
        } else {
          console.debug(`No repayments found for agent ${agentId}'s loan applications`);
        }
      } catch (error) {
        // Silently fail - agent probably doesn't have repayments
        console.debug(`Error checking repayments for agent ${agentId}:`, error);
      }
    });

    await Promise.all(checkPromises);
    setAgentsWithRepayments(agentsWithData);
    setIsCheckingRepayments(false);
    console.log(`[LoanStatusTrackingPage] Found ${agentsWithData.size} agent(s) with repayment data out of ${uniqueAgentIds.length} total agents`);
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

  const handleViewRepayments = (agentId: string | undefined, borrowerName?: string, applicationNumber?: string) => {
    if (!agentId) {
      toast.error('Agent ID is not available for this loan');
      return;
    }
    console.log('[LoanStatusTrackingPage] Navigating to repayments:', {
      agentId,
      borrowerName,
      applicationNumber,
      path: `/coop/loan-monitoring/repayments/agent/${agentId}`
    });
    // Navigate to repayment detail page with agentId and borrower info
    navigate(`/coop/loan-monitoring/repayments/agent/${agentId}`, {
      state: { borrowerName, applicationNumber }
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

      // Apply status filter
      if (filters.status !== "all") {
        dataToExport = dataToExport.filter(app => app.displayPartnerStatus === filters.status);
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
        'Agent Status': app.displayPartnerStatus || app.agentStatus || 'N/A',
        'Interest Rate': app.interestRate ? `${app.interestRate}%` : 'N/A',
        'Tenure (Months)': app.tenure,
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
      accessorKey: "displayPartnerStatus",
      header: "Agent Status",
      cell: ({ row }: any) => (
        <div className="py-2">
          {getAgentStatusBadge(row.original.displayPartnerStatus || row.original.agentStatus || "PENDING")}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Repayment Data",
      cell: ({ row }: any) => {
        const application = row.original as ProcessedLoanApplication;
        const agentId = application.agentId?.toString();
        const agentStatus = application.displayPartnerStatus || application.agentStatus || "";
        const isAgentApproved = agentStatus.toUpperCase() === "APPROVED";
        const hasRepayments = agentId ? agentsWithRepayments.has(agentId) : false;
        const isButtonDisabled = !agentId || !hasRepayments || !isAgentApproved || isCheckingRepayments;
        
        return (
          <div className="py-2 flex items-center gap-2">
            {agentId && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isButtonDisabled) {
                    handleViewRepayments(
                      agentId,
                      application.borrowerName,
                      application.applicationNumber
                    );
                  }
                }}
                disabled={isButtonDisabled}
                className={
                  isButtonDisabled
                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                    : "bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-300 hover:border-cyan-400"
                }
                title={
                  isButtonDisabled
                    ? !agentId
                      ? "Agent ID not available"
                      : isCheckingRepayments
                      ? "Checking repayments..."
                      : !isAgentApproved
                      ? "Agent status must be APPROVED to view repayments"
                      : "No repayments available for this agent"
                    : "View repayments"
                }
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Repayments
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // Filter tracking applications
  const trackingApplications = useMemo(() => {
    let filtered = processedApplications.filter(app => app.shouldShowInTracking);
    
    // Apply status filter (filter by Agent Status)
    if (filters.status !== "all") {
      filtered = filtered.filter(app => app.displayPartnerStatus === filters.status);
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
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [processedApplications, filters, searchTerm]);

  const stats = {
    total: trackingApplications.length,
    totalValue: trackingApplications.reduce((sum, app) => sum + (app.approvedAmount || 0), 0),
    approved: trackingApplications.filter(app => 
      app.displayPartnerStatus === "APPROVED" && app.displaySuperAdminStatus === "APPROVED"
    ).length,
    pending: trackingApplications.filter(app => 
      app.displayPartnerStatus === "PENDING" || app.displaySuperAdminStatus === "PENDING"
    ).length,
    rejected: trackingApplications.filter(app => 
      app.displayPartnerStatus === "REJECTED" || app.displaySuperAdminStatus === "REJECTED"
    ).length
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Status Tracking ({stats.total})
          </h1>
          <p className="text-gray-600">Track approved loans</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Loan applications in tracking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              Fully approved applications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Applications pending approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              Rejected applications
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
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-[180px]">
                <CheckCircle className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
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

    </div>
  );
};

export default LoanStatusTrackingPage;
