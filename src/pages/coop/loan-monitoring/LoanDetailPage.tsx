import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Input } from "../../../common/ui/input";
import { Label } from "../../../common/ui/label";
import { Textarea } from "../../../common/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { CheckCircle, X, FileText } from "lucide-react";
import loanApplicationService, { LoanApplication } from "../../../services/loanApplicationService";
import { toast } from "react-hot-toast";
import API from "../../../config/axios-config";
import factoryService from "../../../services/factoryService";
import loanProductService from "../../../services/loanProductService";
import agentService from "../../../services/agentService";

const LoanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [loanData, setLoanData] = useState<LoanApplication | null>(null);
  const [agentLoanApplications, setAgentLoanApplications] = useState<LoanApplication[]>([]);
  const [agentDetails, setAgentDetails] = useState<any>(null);
  const [isLoadingAgentDetails, setIsLoadingAgentDetails] = useState(false);
  const [factoryLoanApplications, setFactoryLoanApplications] = useState<LoanApplication[]>([]);
  const [factoryDetails, setFactoryDetails] = useState<any>(null);
  const [isLoadingFactoryDetails, setIsLoadingFactoryDetails] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isApprovingLoan, setIsApprovingLoan] = useState(false);
  const [isRejectingLoan, setIsRejectingLoan] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState<string>("");
  const [customRejectionReason, setCustomRejectionReason] = useState<string>("");
  const [showLoanRejectDialog, setShowLoanRejectDialog] = useState(false);
  const [showLoanApproveDialog, setShowLoanApproveDialog] = useState(false);
  
  // Loan approval form fields
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [loanProduct, setLoanProduct] = useState<any>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<string>("products");
  
  // Rejection reasons options
  const rejectionReasons = [
    "Insufficient credit history",
    "High risk score",
    "Incomplete documentation",
    "Unable to verify income",
    "Loan amount exceeds limit",
    "Poor payment history",
    "Insufficient collateral",
    "Business not eligible",
    "Other"
  ];
  const isFromTracking = (() => {
    const state = location.state as { from?: string } | undefined;
    const sessionReferrer = typeof window !== 'undefined' ? sessionStorage.getItem('loanDetailReferrer') : undefined;
    return state?.from === '/coop/loan-monitoring/tracking' || sessionReferrer === '/coop/loan-monitoring/tracking';
  })();


  // Debug: Log location state when component mounts
  useEffect(() => {
    console.log('LoanDetailPage mounted with location.state:', location.state);
    console.log('LoanDetailPage mounted with sessionStorage:', sessionStorage.getItem('loanDetailReferrer'));
  }, [location.state]);

  // Function to handle back navigation
  const handleBackNavigation = () => {
    // Check if there's a state with the previous page
    const state = location.state as { from?: string };
    console.log('Back navigation - location.state:', location.state);
    console.log('Back navigation - state.from:', state?.from);
    
    // Check sessionStorage as fallback
    const sessionReferrer = sessionStorage.getItem('loanDetailReferrer');
    console.log('Back navigation - sessionReferrer:', sessionReferrer);
    
    if (state?.from) {
      console.log('Navigating to state.from:', state.from);
      navigate(state.from);
    } else if (sessionReferrer) {
      console.log('Navigating to sessionReferrer:', sessionReferrer);
      navigate(sessionReferrer);
      // Clear the session storage after use
      sessionStorage.removeItem('loanDetailReferrer');
    } else {
      console.log('No referrer found, using browser history');
      // Fallback to browser history or default to loan monitoring
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/coop/loan-monitoring');
      }
    }
  };

  // Function to fetch agent data
  const fetchAgentData = async (agentId: string) => {
    if (!agentId) return;
    
    // Fetch agent details from /v1/agents/{id}
    setIsLoadingAgentDetails(true);
    try {
      console.log("=== FETCHING AGENT DETAILS ===");
      console.log("Agent ID:", agentId);
      const agent = await agentService.getAgentById(agentId);
      console.log("Agent Details API Response:", agent);
      
      // Handle different response structures
      const agentData = (agent as any)?.data || agent;
      setAgentDetails(agentData);
      console.log("Processed Agent Details:", agentData);
      
      // Update loanData with borrower name from agent details
      if (agentData) {
        const borrowerName = agentData.fullName || agentData.fullLegalName || agentData.name || agentData.username || '';
        if (borrowerName) {
          setLoanData(prev => {
            if (prev) {
              return { ...prev, borrowerName };
            }
            return prev;
          });
          console.log("Updated borrower name from agent details:", borrowerName);
        }
      }
    } catch (e) {
      console.warn("Failed to load agent details:", e);
      setAgentDetails(null);
    } finally {
      setIsLoadingAgentDetails(false);
    }
    
    // Load agent's loan applications to derive financial fields
    try {
      const apps = await loanApplicationService.getLoanApplicationsByAgent(agentId);
      if (Array.isArray(apps)) {
        setAgentLoanApplications(apps);
      } else if (apps) {
        // Some backends may return an object with data key
        const maybeArray = (apps as any).data;
        if (Array.isArray(maybeArray)) setAgentLoanApplications(maybeArray);
      }
    } catch (e) {
      console.warn("Failed to load agent loan applications:", e);
      setAgentLoanApplications([]);
    }
  };

  const fetchFactoryLoans = async (factoryId: string) => {
    if (!factoryId) return;
    try {
      console.log("=== FETCHING FACTORY LOAN APPLICATIONS ===");
      console.log("Factory ID:", factoryId);
      const apps = await loanApplicationService.getLoanApplicationsByFactory(factoryId);
      console.log("Factory Loan Applications API Response:", apps);
      
      // Handle different response structures
      let factoryApps: any[] = [];
      if (Array.isArray(apps)) {
        factoryApps = apps;
      } else if (apps && (apps as any).data) {
        const maybeArray = (apps as any).data;
        if (Array.isArray(maybeArray)) {
          factoryApps = maybeArray;
        }
      } else if (apps) {
        // If it's a single object, wrap it in an array
        factoryApps = [apps];
      }
      
      console.log("Processed Factory Loan Applications:", factoryApps);
      setFactoryLoanApplications(factoryApps);
    } catch (e) {
      console.warn("Failed to load factory loan applications:", e);
      setFactoryLoanApplications([]);
    }
  };

  const fetchFactoryDetails = async (factoryId: string) => {
    if (!factoryId) return;
    setIsLoadingFactoryDetails(true);
    try {
      const factory = await factoryService.getFactoryById(factoryId);
      setFactoryDetails(factory);
    } catch (e) {
      console.warn("Failed to load factory details:", e);
      setFactoryDetails(null);
    } finally {
      setIsLoadingFactoryDetails(false);
    }
  };

  const fetchTransactions = async (applicationNumber: string) => {
    if (!applicationNumber) return;
    setIsLoadingTransactions(true);
    try {
      const response = await API.get(`/v1/transactions/loan/${applicationNumber}`);
      const transactionsData = response.data?.data || response.data || [];
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
    } catch (e) {
      console.warn("Failed to load transactions:", e);
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Function to fetch loan data from /v1/loan-applications/{applicationNumber} API
  const fetchLoanData = async (loanId: string) => {
    if (!loanId) return;
    
    console.log("=== FETCHING LOAN DATA ===");
    console.log("Loan ID/Application Number:", loanId);
    
    setIsLoading(true);
    try {
      console.log("Calling loanApplicationService.getLoanApplicationByNumber...");
      const loan = await loanApplicationService.getLoanApplicationByNumber(loanId);
      console.log("Loan Application API Response:", loan);
      
      console.log("Found Loan:", loan);
      console.log("Found loan status:", loan.status);
      console.log("Found loan superAdminStatus:", loan.superAdminStatus);
      console.log("Loan factoryId:", (loan as any).factoryId || (loan as any).factory_id || (loan as any).factory?.id);
      
      // Transform API data to match our expected format with proper field mapping
      const transformedLoan: LoanApplication = {
        applicationNumber: (loan as any).applicationNumber || (loan as any).id || loanId,
        loanType: (loan as any).loanTypeName || (loan as any).loanType || (loan as any).type || 'Goods Purchase Financing',
        status: (loan as any).status || 'PENDING_PARTNER_APPROVAL',
        // CRITICAL: Preserve superAdminStatus and agentStatus to correctly show separate statuses
        // superAdminStatus represents Super Admin's decision, agentStatus represents Partner's decision
        superAdminStatus: (loan as any).superAdminStatus || (loan as any).super_admin_status || undefined,
        agentStatus: (loan as any).agentStatus || (loan as any).agent_status || (loan as any).partnerStatus || (loan as any).partner_status || undefined,
        requestedAmount: (loan as any).requestedAmount || (loan as any).amount || (loan as any).loanAmount || (loan as any).request_amount || (loan as any).requestAmount || (loan as any).principalAmount || (loan as any).principal_amount || (loan as any).totalAmount || (loan as any).total_amount || (loan as any).loanDetails?.amount || (loan as any).financialDetails?.amount || (loan as any).applicationDetails?.amount || 0,
        approvedAmount: (loan as any).approvedAmount || (loan as any).approved_amount || undefined,
        tenure: (loan as any).tenure || (loan as any).duration || 12,
        products: (loan as any).products || (loan as any).productCount || 0,
        created: (loan as any).created || (loan as any).createdAt || (loan as any).date_created || new Date().toISOString(),
        factoryId: (loan as any).factoryId || (loan as any).factory_id || (loan as any).factory?.id,
        agentId: (loan as any).agentId || (loan as any).agent_id || (loan as any).agent?.id,
        borrowerName: (loan as any).borrowerName || (loan as any).borrower_name || (loan as any).borrower?.name || 'N/A',
        interestRate: (loan as any).interestRate || (loan as any).interest_rate || undefined,
        purpose: (loan as any).purpose || (loan as any).description || 'N/A',
        documents: (loan as any).documents || (loan as any).attachments || [],
        riskScore: (loan as any).riskScore || (loan as any).risk_score || undefined,
        // Additional fields for better display
        loanTypeCode: (loan as any).loanTypeCode || (loan as any).productCode || (loan as any).typeCode,
        loanTypeName: (loan as any).loanTypeName || (loan as any).productName || (loan as any).loanType,
        requestDate: (loan as any).requestDate || (loan as any).created || (loan as any).createdAt || (loan as any).date_created,
        submissionDate: (loan as any).submissionDate || (loan as any).submittedAt || (loan as any).created,
      };
      
      console.log("Transformed Loan Data:", transformedLoan);
      setLoanData(transformedLoan);
      
      // Fetch agent data
      if (transformedLoan.agentId) {
        console.log("Fetching agent data for ID:", transformedLoan.agentId);
        fetchAgentData(transformedLoan.agentId.toString());
      }
      
      // Fetch factory loan applications using factory ID from the loan application
      const factoryId = transformedLoan.factoryId;
      if (factoryId) {
        console.log("Fetching factory loan applications for factory ID:", factoryId);
        fetchFactoryLoans(factoryId.toString());
        fetchFactoryDetails(factoryId.toString());
      } else {
        console.warn("No factory ID found in loan application");
        setFactoryLoanApplications([]);
        setFactoryDetails(null);
      }
      
      // Transactions will be fetched via useEffect when loanData is set and isFromTracking is true
      
      console.log("Loan data loaded successfully");
    } catch (error: any) {
      console.error("Error fetching loan data:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Fallback: Create a basic loan object with the ID
      console.log("Creating fallback loan data...");
      const fallbackLoan: LoanApplication = {
        applicationNumber: loanId,
        loanType: 'Goods Purchase Financing',
        status: 'PENDING_PARTNER_APPROVAL',
        superAdminStatus: 'pending',
        agentStatus: undefined, // Partner status unknown in fallback
        requestedAmount: 0,
        approvedAmount: undefined,
        tenure: 12,
        products: 0,
        created: new Date().toISOString(),
        factoryId: undefined,
        agentId: undefined,
        borrowerName: 'N/A',
        interestRate: undefined,
        purpose: 'N/A',
        documents: [],
        riskScore: undefined,
      };
      
      setLoanData(fallbackLoan);
      setFactoryLoanApplications([]);
      setFactoryDetails(null);
      
      toast.error(`API failed, showing basic details for ${loanId}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to open approve dialog is controlled inline where needed

  // Function to submit loan approval
  const handleSubmitLoanApproval = async () => {
    if (!loanData) return;
    
    // Validate required fields
    if (approvedAmount <= 0) {
      toast.error('Please enter a valid approved amount');
      return;
    }

    // Get values from loan product
    const interestRate = loanProduct?.defaultInterestRate || loanData?.interestRate || 0;
    const processingFeeType = loanProduct?.processingFeeType || 'PERCENTAGE';
    const processingFeeValue = loanProduct?.processingFeeValue || 0;
    
    // Calculate processing fee based on type
    let processingFeePercentage = 0;
    let processingFeeFactor = 0;
    
    if (processingFeeType === 'PERCENTAGE') {
      processingFeePercentage = processingFeeValue;
      processingFeeFactor = (approvedAmount * processingFeeValue) / 100;
    } else {
      processingFeeFactor = processingFeeValue;
    }
    
    setIsApprovingLoan(true);
    try {
      const response = await loanApplicationService.approveLoanApplication({
        applicationNumber: loanData.applicationNumber,
        approved: true,
        approvedAmount: approvedAmount,
        interestRate: interestRate,
        processingFeePercentage: processingFeePercentage,
        processingFeeFactor: processingFeeFactor,
        rejectionReason: ""
      });
      
      console.log('Approval API response:', response);
      console.log('Updated loan status:', response.status);
      console.log('Updated superAdminStatus:', response.superAdminStatus);
      
      toast.success('Loan application approved successfully');
      setShowLoanApproveDialog(false);
      // Add a small delay before refreshing to ensure API has updated
      setTimeout(() => {
        console.log("Refreshing loan data after approval...");
        fetchLoanData(loanData.applicationNumber);
      }, 1000);
    } catch (error: any) {
      console.error('Error approving loan:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve loan application';
      toast.error(errorMessage);
    } finally {
      setIsApprovingLoan(false);
    }
  };

  // Function to reject loan
  const handleRejectLoan = async () => {
    if (!loanData) return;
    
    // Determine the final rejection reason
    const finalRejectionReason = selectedRejectionReason === "Other" 
      ? customRejectionReason.trim() 
      : selectedRejectionReason;
    
    if (!finalRejectionReason) {
      toast.error('Please select or provide a rejection reason');
      return;
    }
    
    setIsRejectingLoan(true);
    try {
      const response = await loanApplicationService.rejectLoanApplication({
        applicationNumber: loanData.applicationNumber,
        approved: false,
        interestRate: 0,
        processingFeePercentage: 0,
        processingFeeFactor: 0,
        rejectionReason: finalRejectionReason
      });
      
      console.log('=== REJECT RESPONSE HANDLING ===');
      console.log('Reject API response:', response);
      console.log('Before rejection - Main status:', loanData.status);
      console.log('Before rejection - SuperAdminStatus:', loanData.superAdminStatus);
      console.log('After rejection - Main status should be:', loanData.status);
      console.log('After rejection - SuperAdminStatus should be: rejected');
      console.log('Partner status should remain unchanged');
      
      // Verify the response shows only superAdminStatus changed
      if (response) {
        console.log('Response status:', response.status);
        console.log('Response superAdminStatus:', response.superAdminStatus);
        console.log('Response agentStatus:', response.agentStatus);
      }
      
      toast.success('Loan application rejected by super admin (superAdminStatus updated only)');
      setShowLoanRejectDialog(false);
      setSelectedRejectionReason("");
      setCustomRejectionReason("");
      // Refresh loan data to see updated superAdminStatus
      setTimeout(() => {
        fetchLoanData(loanData.applicationNumber);
      }, 500);
    } catch (error: any) {
      console.error('Error rejecting loan:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reject loan application';
      toast.error(errorMessage);
    } finally {
      setIsRejectingLoan(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchLoanData(id);
    }
  }, [id]);

  // Fetch loan product details when loan data is loaded
  useEffect(() => {
    const fetchLoanProduct = async () => {
      if (!loanData?.loanTypeCode) return;
      
      setIsLoadingProduct(true);
      try {
        const response = await loanProductService.getLoanTypeByCode(loanData.loanTypeCode);
        if (response.success && response.data) {
          setLoanProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching loan product:', error);
        setLoanProduct(null);
      } finally {
        setIsLoadingProduct(false);
      }
    };

    if (loanData) {
      setApprovedAmount(loanData.approvedAmount || loanData.requestedAmount || 0);
      if (loanData.loanTypeCode) {
        fetchLoanProduct();
      }
    }
  }, [loanData]);

  // Fetch transactions when on tracking page and loan data is available
  useEffect(() => {
    if (isFromTracking && loanData?.applicationNumber) {
      fetchTransactions(loanData.applicationNumber);
    }
  }, [isFromTracking, loanData?.applicationNumber]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading loan details...</p>
        </div>
      </div>
    );
  }

  // Derive financial fields from agent applications endpoint when missing on main loan data
  const relatedAgentApp = (() => {
    if (!agentLoanApplications || agentLoanApplications.length === 0) return undefined;
    const byId = agentLoanApplications.find(
      (a: any) => a?.applicationNumber === loanData?.applicationNumber || a?.id === loanData?.applicationNumber
    );
    if (byId) return byId as any;
    // fallback to latest
    const sorted = [...agentLoanApplications].sort((a: any, b: any) => {
      const da = new Date(a.created || a.submissionDate || a.requestDate || '').getTime();
      const db = new Date(b.created || b.submissionDate || b.requestDate || '').getTime();
      return db - da;
    });
    return (sorted[0] as any) || undefined;
  })();

  const derivedApprovedAmount: number | undefined = (
    (loanData as any)?.approvedAmount ??
    (relatedAgentApp?.approvedAmount ??
      relatedAgentApp?.approved_amount ??
      relatedAgentApp?.finalApprovedAmount ??
      relatedAgentApp?.final_approved_amount ??
      relatedAgentApp?.amountApproved ??
      relatedAgentApp?.amount_approved ??
      relatedAgentApp?.disbursedAmount ??
      relatedAgentApp?.disbursed_amount)
  );

  const derivedInterestRate: number | undefined = (
    (loanData as any)?.interestRate ??
    relatedAgentApp?.interestRate ??
    relatedAgentApp?.interest_rate
  );

  const derivedProcessingFee: number | undefined = (
    (relatedAgentApp?.processingFee ??
      relatedAgentApp?.processing_fee ??
      relatedAgentApp?.fees ??
      relatedAgentApp?.loanFees)
  );

  // Derive product lists from agent and factory endpoints
  const agentProducts: any[] = (() => {
    const source = relatedAgentApp as any;
    const products = source?.products || source?.applicationProducts || [];
    return Array.isArray(products) ? products : [];
  })();

  // Factory products intentionally not used in UI to avoid redundancy

  // Determine if Approve/Reject buttons should be enabled
  // Buttons are ACTIVE only when status is PENDING_SUPER_ADMIN_APPROVAL (approved by partner, waiting for system approval)
  // Buttons are DISABLED for:
  // - PENDING_PARTNER_APPROVAL (partner hasn't approved yet)
  // - REJECTED or CANCELLED or any status containing REJECTED (already rejected)
  // - APPROVED or DISBURSED (both already approved)
  const status = loanData?.status?.toUpperCase() || '';
  const canApproveOrReject = status === 'PENDING_SUPER_ADMIN_APPROVAL';

  // Get the reason message for why buttons are disabled
  const getDisabledReason = () => {
    if (!loanData) return '';
    const status = loanData.status?.toUpperCase() || '';
    
    // Check if status contains PENDING_PARTNER, PENDING_AGENT, or is DRAFT
    // This covers: PENDING_PARTNER_APPROVAL, PENDING AGENT CONFIRMATION, PENDING_AGENT_CONFIRMATION, etc.
    if (status === 'PENDING_PARTNER_APPROVAL' || 
        status === 'DRAFT' || 
        status.includes('PENDING_PARTNER') ||
        status.includes('PENDING AGENT') ||
        status.includes('PENDING_AGENT') ||
        status === 'PENDING_AGENT_CONFIRMATION' ||
        status === 'PENDING AGENT CONFIRMATION') {
      return 'Partner should approve first';
    }
    // Check if status contains REJECTED (handles REJECTED, PARTNER_REJECTED, PARTNER REJECTED, etc.)
    if (status.includes('REJECTED') || status === 'CANCELLED') {
      return 'Rejected by partner';
    }
    if (status === 'APPROVED' || status === 'DISBURSED') {
      return 'This loan request has already been processed';
    }
    // For any other pending status that's not PENDING_SUPER_ADMIN_APPROVAL, show default message
    if (status.includes('PENDING') && status !== 'PENDING_SUPER_ADMIN_APPROVAL') {
      return 'Partner should approve first';
    }
    return '';
  };

  // Calculate total amount for products
  const calculateTotalAmount = () => {
    return agentProducts.reduce((total: number, p: any) => {
      const productTotal = p.productTotalPrice || (p.productUnitPrice || 0) * (p.productQuantity || 1);
      return total + (productTotal || 0);
    }, 0);
  };

  // Calculate days remaining until license expiry date
  const calculateLicenseDaysRemaining = (expiryDate: string) => {
    if (!expiryDate) return null;
    
    try {
      const expiry = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiry.setHours(0, 0, 0, 0);
      
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      console.error("Error calculating license expiry days:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleBackNavigation}
            className="flex items-center"
          >
            ← Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {loanData?.borrowerName && loanData.borrowerName !== 'N/A' 
                ? `${loanData.borrowerName} - Loan Application`
                : 'Loan Application'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Application {loanData?.applicationNumber}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {!isFromTracking && (
            <>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-600"
                onClick={() => setShowLoanApproveDialog(true)}
                disabled={!canApproveOrReject || isApprovingLoan || isRejectingLoan}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Loan
              </Button>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                onClick={() => setShowLoanRejectDialog(true)}
                disabled={!canApproveOrReject || isApprovingLoan || isRejectingLoan}
              >
                <X className="w-4 h-4 mr-2" />
                Reject Loan
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Message Banner */}
      {!isFromTracking && !canApproveOrReject && loanData && getDisabledReason() && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
          <p className="text-sm text-yellow-800">{getDisabledReason()}</p>
        </div>
      )}

      {/* Loan Application Details */}
      <Card className="mb-6 border-l-4 border-l-cyan-500 dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:bg-slate-700">
          <CardTitle className="flex items-center text-cyan-900 dark:text-white">
            Loan Application Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Application Number</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{loanData?.applicationNumber || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Borrower Name</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{loanData?.borrowerName || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Product Name</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{loanData?.loanTypeName || loanData?.loanType || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{loanData?.status?.replace(/_/g, ' ') || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Request Date</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {loanData?.requestDate ? new Date(loanData.requestDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Requested Amount</p>
                <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">ETB {loanData?.requestedAmount?.toLocaleString() || '0.00'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Product Code</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{loanData?.loanTypeCode || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Purpose</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{loanData?.purpose || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tenure</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{loanData?.tenure || 12} months</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Submission Date</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {loanData?.submissionDate ? new Date(loanData.submissionDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Sections */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isFromTracking ? 'grid-cols-5' : 'grid-cols-4'} mb-6 dark:bg-slate-700`}>
              <TabsTrigger 
                value="agent-details"
                className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
              >
                Agent Details
              </TabsTrigger>
              <TabsTrigger 
                value="tin-registry"
                className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
              >
                TIN Registry
              </TabsTrigger>
              <TabsTrigger 
                value="manufacturer-details"
                className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
              >
                Manufacturer Details
              </TabsTrigger>
              <TabsTrigger 
                value="products"
                className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
              >
                Products
              </TabsTrigger>
            {isFromTracking && (
                <TabsTrigger 
                  value="transaction-history"
                  className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
                >
                  Transaction History
                </TabsTrigger>
              )}
            </TabsList>

            {/* Agent Details Tab */}
            <TabsContent value="agent-details" className="space-y-4">
              {isLoadingAgentDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading agent details...</p>
                  </div>
                </div>
              ) : agentDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Gender</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {agentDetails?.gender || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {agentDetails?.email || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Agent Type</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {agentDetails?.agentType || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">ID Number</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {agentDetails?.idNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Address</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {(() => {
                        const city = agentDetails?.address?.city || agentDetails?.city || '';
                        const country = agentDetails?.address?.country || agentDetails?.country || '';
                        if (city && country) {
                          return `${city}, ${country}`;
                        } else if (city) {
                          return city;
                        } else if (country) {
                          return country;
                        }
                        return 'N/A';
                      })()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Registration Number</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {agentDetails?.registrationNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">License Number</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {agentDetails?.licenseNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">License Expiry Date</p>
                    {agentDetails?.licenseExpiryDate ? (() => {
                      const expiryDate = new Date(agentDetails.licenseExpiryDate);
                      const daysRemaining = calculateLicenseDaysRemaining(agentDetails.licenseExpiryDate);
                      const isExpired = daysRemaining !== null && daysRemaining < 0;
                      const isExpiringSoon = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 30;
                      
                      return (
                        <div>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {expiryDate.toLocaleDateString()}
                          </p>
                          {daysRemaining !== null && (
                            <div className="mt-2">
                              {isExpired ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400">
                                  Expired {Math.abs(daysRemaining)} day{daysRemaining !== -1 ? 's' : ''} ago
                                </span>
                              ) : isExpiringSoon ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400">
                                  {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400">
                                  {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })() : (
                      <p className="text-lg font-medium text-gray-900 dark:text-white">N/A</p>
                    )}
                  </div>
                  {/* Bank Information */}
                  {agentDetails?.bankAccountInfos && Array.isArray(agentDetails.bankAccountInfos) && agentDetails.bankAccountInfos.length > 0 && (
                    <>
                      {agentDetails.bankAccountInfos.map((account: any, index: number) => (
                        <div key={account?.id || index} className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bank Name</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {account?.bankName || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Account Number</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {account?.accountNumber || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Account Name</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {account?.accountName || 'N/A'}
                                </p>
                                {account?.isPrimary && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 mt-1.5">
                                    Primary Account
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Right Column */}
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Branch Name</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {account?.branchName || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Swift Code</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {account?.swiftCode || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">IBAN</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {account?.iban || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-medium mb-2">No Agent Details Available</p>
                  <p className="text-sm">Agent information will be displayed here when available</p>
                </div>
              )}
            </TabsContent>

            {/* TIN Registry Tab */}
            <TabsContent value="tin-registry" className="space-y-4">
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg font-medium mb-2">TIN Registry Information</p>
                <p className="text-sm">TIN registry details will be displayed here</p>
              </div>
            </TabsContent>

            {/* Manufacturer Details Tab */}
            <TabsContent value="manufacturer-details" className="space-y-4">
              {factoryDetails || (factoryLoanApplications && factoryLoanApplications.length > 0) ? (
                isLoadingFactoryDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Loading factory details...</p>
                </div>
              </div>
            ) : (() => {
              const first = factoryLoanApplications[0] as any;
              const factoryName = factoryDetails?.name || factoryDetails?.factoryName || factoryDetails?.businessName || first?.factoryName || first?.factory?.name || 'N/A';
              const factoryId = factoryDetails?.id || factoryDetails?.registrationNo || factoryDetails?.registrationNumber || first?.factoryId || first?.factory_id || loanData?.factoryId || 'N/A';
              const totalApplications = factoryLoanApplications.length;
              const lastCreated = factoryLoanApplications
                .map((a: any) => new Date(a.created || a.submissionDate || a.requestDate || a.createdAt || 0).getTime())
                .filter((t: number) => !Number.isNaN(t))
                .sort((a: number, b: number) => b - a)[0];
              const latestDate = lastCreated ? new Date(lastCreated).toLocaleDateString() : 'N/A';
              const totalApproved = factoryLoanApplications.filter((a: any) => (a.status || '').includes('APPROVED') || (a.superAdminStatus || '') === 'approved').length;
              const totalDisbursed = factoryLoanApplications.filter((a: any) => (a.status || '') === 'DISBURSED').length;
              return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Factory Name</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">{factoryName}</p>
                  </div>
                        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Factory ID</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">{factoryId}</p>
                  </div>
                        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Latest Application Date</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">{latestDate}</p>
                  </div>
                </div>
                <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Applications</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">{totalApplications}</p>
                  </div>
                        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Approved</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">{totalApproved}</p>
                    </div>
                        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Disbursed</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">{totalDisbursed}</p>
                    </div>
                  </div>
                      </div>
                    );
                })()
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-medium mb-2">No Manufacturer Details Available</p>
                  <p className="text-sm">Manufacturer information will be displayed here when available</p>
                </div>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center dark:text-white">
                    <FileText className="w-5 h-5 mr-2" />
                    Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {agentProducts.length > 0 ? (
                    <div className="space-y-4">
                      {/* Products Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Product Name</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Unit Price</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Total Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {agentProducts.map((p: any, idx: number) => {
                              const productName = p.productName || p.name || 'N/A';
                              const category = p.category || p.productCategory || 'N/A';
                              const quantity = p.productQuantity || p.quantity || 1;
                              const unitPrice = p.productUnitPrice || p.unitPrice || 0;
                              const totalPrice = p.productTotalPrice || (unitPrice * quantity);
                              
                              return (
                                <tr key={idx} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                                  <td className="p-3 text-sm text-gray-900 dark:text-white">{productName}</td>
                                  <td className="p-3 text-sm text-gray-900 dark:text-white">{category}</td>
                                  <td className="p-3 text-sm text-gray-900 dark:text-white">{quantity}</td>
                                  <td className="p-3 text-sm text-gray-900 dark:text-white">ETB {unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                  <td className="p-3 text-sm text-gray-900 dark:text-white">ETB {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Total Amount Summary */}
                      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-slate-600">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount:</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ETB {calculateTotalAmount().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p className="text-lg font-medium mb-2">No Products Available</p>
                      <p className="text-sm">Product information will be displayed here when available</p>
                    </div>
                  )}
        </CardContent>
      </Card>
            </TabsContent>

            {/* Transaction History Tab (only for tracking detail) */}
      {isFromTracking && (
              <TabsContent value="transaction-history" className="space-y-4">
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center dark:text-white">
              Transaction History
            </CardTitle>
          </CardHeader>
                  <CardContent>
            {isLoadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading transactions...</p>
                </div>
              </div>
            ) : transactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No transactions found for this loan application.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                            <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Transaction Reference</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Transaction Type</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Method</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Transaction Date</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                              <tr key={transaction.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                                <td className="p-3 text-sm text-gray-900 dark:text-white">{transaction.transactionReference || 'N/A'}</td>
                                <td className="p-3 text-sm text-gray-900 dark:text-white">{transaction.transactionType?.replace(/_/g, ' ') || 'N/A'}</td>
                                <td className="p-3 text-sm font-medium text-cyan-600 dark:text-cyan-400">ETB {Number(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="p-3 text-sm text-gray-900 dark:text-white">{transaction.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'COMPLETED' 
                                      ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400' 
                              : transaction.status === 'PENDING'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : transaction.status === 'FAILED'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {transaction.status?.replace(/_/g, ' ') || 'N/A'}
                          </span>
                        </td>
                                <td className="p-3 text-sm text-gray-900 dark:text-white">
                          {transaction.transactionDate 
                            ? new Date(transaction.transactionDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })
                            : 'N/A'}
                        </td>
                                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{transaction.description || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
              </TabsContent>
      )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Separate product cards removed; products are merged into their respective sections */}

      {/* Loan Rejection Dialog */}
      {showLoanRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Loan Application</h3>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason for Rejection *
                </Label>
                <div className="space-y-2">
                  {rejectionReasons.map((reason) => (
                    <div key={reason} className="flex items-center">
                      <input
                        type="radio"
                        id={`reject-${reason}`}
                        name="rejectionReason"
                        value={reason}
                        checked={selectedRejectionReason === reason}
                        onChange={(e) => {
                          setSelectedRejectionReason(e.target.value);
                          if (e.target.value !== "Other") {
                            setCustomRejectionReason("");
                          }
                        }}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label
                        htmlFor={`reject-${reason}`}
                        className="ml-2 block text-sm text-gray-700 cursor-pointer"
                      >
                        {reason}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {selectedRejectionReason === "Other" && (
                <div>
                  <Label htmlFor="customRejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                    Please specify the reason
                  </Label>
                  <Textarea
                    id="customRejectionReason"
                    value={customRejectionReason}
                    onChange={(e) => setCustomRejectionReason(e.target.value)}
                    placeholder="Enter the rejection reason..."
                    className="w-full"
                    rows={3}
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLoanRejectDialog(false);
                    setSelectedRejectionReason("");
                    setCustomRejectionReason("");
                  }}
                  disabled={isRejectingLoan}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRejectLoan}
                  disabled={isRejectingLoan || !selectedRejectionReason || (selectedRejectionReason === "Other" && !customRejectionReason.trim())}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isRejectingLoan ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : null}
                  {isRejectingLoan ? 'Rejecting...' : 'Reject Loan'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loan Approval Dialog */}
      {showLoanApproveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Loan Application</h3>
            {isLoadingProduct ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading product details...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="approvedAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Approved Amount (ETB) *
                  </Label>
                  <Input
                    id="approvedAmount"
                    type="number"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(Number(e.target.value))}
                    placeholder="Enter approved amount"
                    className="w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                {/* Display auto-populated values from product */}
                {loanProduct && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Product Details (Auto-filled from {loanProduct.name}):</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-medium text-gray-900">{loanProduct.defaultInterestRate || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee:</span>
                        <span className="font-medium text-gray-900">
                          {loanProduct.processingFeeType === 'PERCENTAGE' 
                            ? `${loanProduct.processingFeeValue || 0}%` 
                            : `ETB ${(loanProduct.processingFeeValue || 0).toLocaleString()}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowLoanApproveDialog(false);
                      setApprovedAmount(loanData?.approvedAmount || loanData?.requestedAmount || 0);
                    }}
                    disabled={isApprovingLoan}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitLoanApproval}
                    disabled={isApprovingLoan || approvedAmount <= 0}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    {isApprovingLoan ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {isApprovingLoan ? 'Approving...' : 'Approve Loan'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetailPage;