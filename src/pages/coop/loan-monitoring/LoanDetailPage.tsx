import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Input } from "../../../common/ui/input";
import { Label } from "../../../common/ui/label";
import { Textarea } from "../../../common/ui/textarea";
import { CheckCircle, X } from "lucide-react";
import loanApplicationService, { LoanApplication } from "../../../services/loanApplicationService";
import { toast } from "react-hot-toast";
import API from "../../../config/axios-config";
import factoryService from "../../../services/factoryService";
import loanProductService from "../../../services/loanProductService";

const LoanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [loanData, setLoanData] = useState<LoanApplication | null>(null);
  const [agentLoanApplications, setAgentLoanApplications] = useState<LoanApplication[]>([]);
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
      const apps = await loanApplicationService.getLoanApplicationsByFactory(factoryId);
      if (Array.isArray(apps)) {
        setFactoryLoanApplications(apps);
      } else if (apps) {
        const maybeArray = (apps as any).data;
        if (Array.isArray(maybeArray)) setFactoryLoanApplications(maybeArray);
      }
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

  // Function to fetch loan data from all loan applications API
  const fetchLoanData = async (loanId: string) => {
    if (!loanId) return;
    
    console.log("=== FETCHING LOAN DATA ===");
    console.log("Loan ID:", loanId);
    
    setIsLoading(true);
    try {
      console.log("Calling loanApplicationService.getAllLoanApplicationsWithAgentData...");
      const allLoans = await loanApplicationService.getAllLoanApplicationsWithAgentData();
      console.log("All Loans API Response with Agent Data:", allLoans);
      
      // Find the specific loan by application number or ID
      const loan = allLoans.find((l: any) => 
        l.applicationNumber === loanId || 
        l.id === loanId || 
        l.applicationNumber === loanId.toString()
      );
      
      if (!loan) {
        throw new Error(`Loan with ID ${loanId} not found`);
      }
      
      console.log("Found Loan:", loan);
      console.log("Found loan status:", loan.status);
      console.log("Found loan superAdminStatus:", loan.superAdminStatus);
      console.log("Loan amount fields:", {
        requestedAmount: (loan as any).requestedAmount,
        amount: (loan as any).amount,
        loanAmount: (loan as any).loanAmount,
        request_amount: (loan as any).request_amount,
        requestAmount: (loan as any).requestAmount,
        principalAmount: (loan as any).principalAmount,
        principal_amount: (loan as any).principal_amount,
        totalAmount: (loan as any).totalAmount,
        total_amount: (loan as any).total_amount,
        // Check nested objects
        loanDetails: (loan as any).loanDetails,
        financialDetails: (loan as any).financialDetails,
        applicationDetails: (loan as any).applicationDetails
      });
      
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
      
      // Processed status data removed; keeping only base loan details for this page
      
      // Fetch agent and factory data
      if (transformedLoan.agentId) {
        console.log("Fetching agent data for ID:", transformedLoan.agentId);
        fetchAgentData(transformedLoan.agentId.toString());
      }
      if (transformedLoan.factoryId) {
        console.log("Fetching factory loan applications for ID:", transformedLoan.factoryId);
        fetchFactoryLoans(transformedLoan.factoryId.toString());
        fetchFactoryDetails(transformedLoan.factoryId.toString());
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleBackNavigation}
            className="flex items-center"
          >
            ← Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loan Application Details</h1>
            <p className="text-gray-600">Application {loanData?.applicationNumber}</p>
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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800">{getDisabledReason()}</p>
        </div>
      )}

      {/* Loan Application Details */}
      <Card className="border-l-4 border-l-cyan-500">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
          <CardTitle className="flex items-center text-cyan-900">
            Loan Application Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Application Number</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.applicationNumber}</p>
              </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-1">Requested Amount</p>
              <p className="text-xl font-bold text-cyan-600">ETB {loanData?.requestedAmount?.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Borrower Name</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.borrowerName}</p>
              </div>
            {isFromTracking && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Approved Amount</p>
                <p className="text-xl font-bold text-cyan-600">
                  {derivedApprovedAmount !== undefined ? `ETB ${Number(derivedApprovedAmount).toLocaleString()}` : 'N/A'}
                </p>
              </div>
            )}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Product Code</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.loanTypeCode || 'N/A'}</p>
              </div>
            {isFromTracking && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Interest Rate</p>
                <p className="text-lg font-medium text-gray-900">
                  {derivedInterestRate !== undefined ? `${derivedInterestRate}%` : 'N/A'}
                </p>
              </div>
            )}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Product Name</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.loanTypeName || loanData?.loanType}</p>
              </div>
            {isFromTracking && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Processing Fee</p>
                <p className="text-lg font-medium text-gray-900">
                  {derivedProcessingFee !== undefined ? `ETB ${Number(derivedProcessingFee).toLocaleString()}` : 'N/A'}
                </p>
              </div>
            )}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Purpose</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.purpose}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.status?.replace(/_/g, ' ')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Tenure</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.tenure} months</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Request Date</p>
                <p className="text-lg font-medium text-gray-900">
                  {loanData?.requestDate ? new Date(loanData.requestDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Submission Date</p>
                <p className="text-lg font-medium text-gray-900">
                  {loanData?.submissionDate ? new Date(loanData.submissionDate).toLocaleDateString() : 'N/A'}
                </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      {agentProducts.length > 0 && (
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardTitle className="flex items-center text-cyan-900">
              Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {agentProducts.map((p: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <span className="font-medium">{p.productName || p.name} × {p.productQuantity || p.quantity || 1}</span>
                  <span className="font-medium text-gray-900">ETB {(p.productTotalPrice || (p.productUnitPrice || 0) * (p.productQuantity || 1)).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Factory Details */}
      {(factoryDetails || (factoryLoanApplications && factoryLoanApplications.length > 0)) && (
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardTitle className="flex items-center text-cyan-900">
              Factory Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            {isLoadingFactoryDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading factory details...</p>
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
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Factory Name</p>
                      <p className="text-lg font-medium text-gray-900">{factoryName}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Factory ID</p>
                      <p className="text-lg font-medium text-gray-900">{factoryId}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Latest Application Date</p>
                      <p className="text-lg font-medium text-gray-900">{latestDate}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Total Applications</p>
                      <p className="text-lg font-medium text-gray-900">{totalApplications}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Approved</p>
                      <p className="text-lg font-medium text-gray-900">{totalApproved}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Disbursed</p>
                      <p className="text-lg font-medium text-gray-900">{totalDisbursed}</p>
                    </div>
                  </div>
                  {/* Factory products section intentionally removed to avoid redundancy */}
                      </div>
                    );
                  })()}
        </CardContent>
      </Card>
      )}

      {/* Transaction History (only for tracking detail) */}
      {isFromTracking && (
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <CardTitle className="flex items-center text-cyan-900">
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading transactions...</p>
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No transactions found for this loan application.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Transaction Reference</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Transaction Type</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Amount</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Payment Method</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Transaction Date</th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900">{transaction.transactionReference || 'N/A'}</td>
                        <td className="p-3 text-sm text-gray-900">{transaction.transactionType?.replace(/_/g, ' ') || 'N/A'}</td>
                        <td className="p-3 text-sm font-medium text-cyan-600">ETB {Number(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="p-3 text-sm text-gray-900">{transaction.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === 'COMPLETED' 
                              ? 'bg-cyan-100 text-cyan-800' 
                              : transaction.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : transaction.status === 'FAILED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.status?.replace(/_/g, ' ') || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-900">
                          {transaction.transactionDate 
                            ? new Date(transaction.transactionDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })
                            : 'N/A'}
                        </td>
                        <td className="p-3 text-sm text-gray-600">{transaction.description || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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