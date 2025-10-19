import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Input } from "../../../common/ui/input";
import { Label } from "../../../common/ui/label";
import { CheckCircle, XCircle, User, Building2, Phone, Mail, MapPin, AlertCircle, CreditCard, FileText, Calendar, Hash } from "lucide-react";
import agentService, { Agent } from "../../../services/agentService";
import factoryService, { Factory } from "../../../services/factoryService";
import loanApplicationService, { LoanApplication } from "../../../services/loanApplicationService";
import { toast } from "react-hot-toast";
import { processLoanApplicationStatus, ProcessedLoanApplication } from "../../../lib/loan-status-utils";

const LoanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [loanData, setLoanData] = useState<LoanApplication | null>(null);
  const [processedLoanData, setProcessedLoanData] = useState<ProcessedLoanApplication | null>(null);
  const [agentData, setAgentData] = useState<Agent | null>(null);
  const [factoryData, setFactoryData] = useState<Factory | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [factoryLoading, setFactoryLoading] = useState(false);
  const [isApprovingLoan, setIsApprovingLoan] = useState(false);
  const [isRejectingLoan, setIsRejectingLoan] = useState(false);
  const [loanRejectReason, setLoanRejectReason] = useState("");
  const [showLoanRejectDialog, setShowLoanRejectDialog] = useState(false);
  const [showLoanApproveDialog, setShowLoanApproveDialog] = useState(false);
  
  // Loan approval form fields
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [processingFeePercentage, setProcessingFeePercentage] = useState<number>(0);
  const [processingFeeFactor, setProcessingFeeFactor] = useState<number>(0);

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
    
    setAgentLoading(true);
    try {
      const agent = await agentService.getAgentById(agentId);
      setAgentData(agent);
    } catch (error) {
      console.error("Error fetching agent data:", error);
      setAgentData(null);
    } finally {
      setAgentLoading(false);
    }
  };

  // Function to fetch factory data
  const fetchFactoryData = async (factoryId: string) => {
    if (!factoryId) return;
    
    setFactoryLoading(true);
    try {
      const factory = await factoryService.getFactoryById(factoryId);
      setFactoryData(factory);
    } catch (error) {
      console.error("Error fetching factory data:", error);
      setFactoryData(null);
    } finally {
      setFactoryLoading(false);
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
      
      // Process loan data with status logic
      console.log("Processing loan status - Input:", {
        status: transformedLoan.status,
        superAdminStatus: transformedLoan.superAdminStatus
      });
      const processedLoan = processLoanApplicationStatus(transformedLoan);
      setProcessedLoanData(processedLoan);
      console.log("Processed Loan Data:", processedLoan);
      console.log("Processed statuses:", {
        displayPartnerStatus: processedLoan.displayPartnerStatus,
        displaySuperAdminStatus: processedLoan.displaySuperAdminStatus,
        shouldShowInTracking: processedLoan.shouldShowInTracking
      });
      
      // Fetch agent and factory data
      if (transformedLoan.agentId) {
        console.log("Fetching agent data for ID:", transformedLoan.agentId);
        fetchAgentData(transformedLoan.agentId.toString());
      }
      if (transformedLoan.factoryId) {
        console.log("Fetching factory data for ID:", transformedLoan.factoryId);
        fetchFactoryData(transformedLoan.factoryId.toString());
      }
      
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
      
      // Process fallback loan data with status logic
      const processedFallbackLoan = processLoanApplicationStatus(fallbackLoan);
      setProcessedLoanData(processedFallbackLoan);
      toast.error(`API failed, showing basic details for ${loanId}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to open approve dialog
  const handleApproveLoan = () => {
    setShowLoanApproveDialog(true);
  };

  // Function to submit loan approval
  const handleSubmitLoanApproval = async () => {
    if (!loanData) return;
    
    // Validate required fields
    if (approvedAmount <= 0) {
      toast.error('Please enter a valid approved amount');
      return;
    }
    if (interestRate < 0) {
      toast.error('Please enter a valid interest rate');
      return;
    }
    if (processingFeePercentage < 0) {
      toast.error('Please enter a valid processing fee percentage');
      return;
    }
    if (processingFeeFactor < 0) {
      toast.error('Please enter a valid processing fee factor');
      return;
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
    } catch (error) {
      console.error('Error approving loan:', error);
      toast.error('Failed to approve loan application');
    } finally {
      setIsApprovingLoan(false);
    }
  };

  // Function to reject loan
  const handleRejectLoan = async () => {
    if (!loanData || !loanRejectReason.trim()) return;
    
    setIsRejectingLoan(true);
    try {
      await loanApplicationService.rejectLoanApplication({
        applicationNumber: loanData.applicationNumber,
        reason: loanRejectReason,
        remarks: 'Rejected by bank'
      });
      toast.success('Loan application rejected');
      setShowLoanRejectDialog(false);
      setLoanRejectReason("");
      // Refresh loan data
      fetchLoanData(loanData.applicationNumber);
    } catch (error) {
      console.error('Error rejecting loan:', error);
      toast.error('Failed to reject loan application');
    } finally {
      setIsRejectingLoan(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchLoanData(id);
    }
  }, [id]);

  // Initialize form fields when loan data loads
  useEffect(() => {
    if (loanData) {
      setApprovedAmount(loanData.approvedAmount || loanData.requestedAmount || 0);
      setInterestRate(loanData.interestRate || 0);
      setProcessingFeePercentage(0); // Default to 0 as this might not be in loan data
      setProcessingFeeFactor(0); // Default to 0 as this might not be in loan data
    }
  }, [loanData]);

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
          
          {/* Loan Action Buttons */}
          {processedLoanData && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {processedLoanData.displayPartnerStatus === "PENDING" || processedLoanData.displayPartnerStatus === "REJECTED" ? (
                  <div className="flex items-center space-x-3 w-full">
                    <Button
                      disabled={true}
                      className="bg-cyan-300 text-white px-6 py-2 cursor-not-allowed flex-1 opacity-60"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Loan
                    </Button>
                    <Button
                      disabled={true}
                      className="bg-red-300 text-white px-6 py-2 cursor-not-allowed flex-1 opacity-60"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Loan
                    </Button>
                  </div>
                ) : processedLoanData.displaySuperAdminStatus === "APPROVED" || processedLoanData.displaySuperAdminStatus === "REJECTED" ? (
                  <div className="flex items-center space-x-3 w-full">
                    <Button
                      disabled={true}
                      className="bg-cyan-300 text-white px-6 py-2 cursor-not-allowed flex-1 opacity-60"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Loan
                    </Button>
                    <Button
                      disabled={true}
                      className="bg-red-300 text-white px-6 py-2 cursor-not-allowed flex-1 opacity-60"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Loan
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 w-full">
                    <Button
                      onClick={handleApproveLoan}
                      disabled={isApprovingLoan}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 flex-1"
                    >
                      {isApprovingLoan ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      {isApprovingLoan ? 'Approving...' : 'Approve Loan'}
                    </Button>
                    <Button
                      onClick={() => setShowLoanRejectDialog(true)}
                      disabled={isRejectingLoan}
                      variant="destructive"
                      className="px-6 py-2 flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Loan
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Status Message Banner - positioned under buttons */}
              {(processedLoanData.displayPartnerStatus === "PENDING" || 
                processedLoanData.displayPartnerStatus === "REJECTED" || 
                processedLoanData.displaySuperAdminStatus === "APPROVED" || 
                processedLoanData.displaySuperAdminStatus === "REJECTED") && (
                <div className="w-full bg-yellow-100 border-t border-b border-yellow-200 text-gray-700 py-2 px-4 text-center text-sm">
                  {processedLoanData.displayPartnerStatus === "PENDING" 
                    ? "This loan request is pending partner approval"
                    : processedLoanData.displayPartnerStatus === "REJECTED"
                    ? "This loan request has been rejected by partner"
                    : processedLoanData.displaySuperAdminStatus === "APPROVED"
                    ? "This loan request has already been processed"
                    : "This loan request has already been processed"
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loan Application Details */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
          <CardTitle className="flex items-center text-purple-900">
            Loan Application Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Application Number</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.applicationNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Borrower Name</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.borrowerName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Product Code</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.loanTypeCode || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Product Name</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.loanTypeName || loanData?.loanType}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Purpose</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.purpose}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Requested Amount</p>
                <p className="text-xl font-bold text-purple-600">ETB {loanData?.requestedAmount?.toLocaleString()}</p>
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
          </div>
        </CardContent>
      </Card>

      {/* Agent Details */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center text-blue-900">
            <User className="w-5 h-5 mr-2" />
            Agent Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {agentLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading agent details...</span>
            </div>
          ) : agentData ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Agent Full Name</p>
                    <p className="text-lg font-medium text-gray-900">
                      {agentData.fullName || agentData.fullLegalName || agentData.name || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Username</p>
                    <p className="text-lg font-medium text-gray-900">{agentData.username || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Email</p>
                    <p className="text-lg font-medium text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      {agentData.email || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Phone</p>
                    <p className="text-lg font-medium text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      {agentData.phone || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Agent ID</p>
                    <p className="text-lg font-medium text-gray-900">{agentData.agentId || agentData.id || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Agent Type</p>
                    <p className="text-lg font-medium text-gray-900">{agentData.agentType || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Location</p>
                    <p className="text-lg font-medium text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {agentData.location || agentData.address || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Approval Status</p>
                    <p className="text-lg font-medium text-gray-900">
                      {agentData.superAdminApprovalStatus || agentData.status || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Account Information */}
              {agentData.documents && agentData.documents.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    Bank Account Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agentData.documents
                      .filter((doc: any) => doc.type === 'bankAccount' || doc.documentType === 'bankAccount' || doc.category === 'bankAccount')
                      .map((bankAccount: any, index: number) => (
                        <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-blue-700">Bank Account #{index + 1}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Account Name:</span> {bankAccount.accountName || bankAccount.account_name || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Bank Name:</span> {bankAccount.bankName || bankAccount.bank_name || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Branch Name:</span> {bankAccount.branchName || bankAccount.branch_name || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Account Number:</span> {bankAccount.accountNumber || bankAccount.account_number || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    {agentData.documents.filter((doc: any) => doc.type === 'bankAccount' || doc.documentType === 'bankAccount' || doc.category === 'bankAccount').length === 0 && (
                      <div className="col-span-2 text-center py-4 text-gray-500">
                        No bank account information available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tax and License Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Tax & License Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-green-700 flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        Tax Information
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Tax ID Number:</span> {agentData.taxIdentificationNumber || agentData.taxId || agentData.tin || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-green-700 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        License Information
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">License Number:</span> {agentData.licenseNumber || agentData.license_number || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="font-medium">Expiry Date:</span> {agentData.licenseExpiryDate || agentData.license_expiry_date ? new Date(agentData.licenseExpiryDate || agentData.license_expiry_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Documents Summary</p>
                <p className="text-lg font-medium text-gray-900">
                  {agentData.documents ? `${agentData.documents.length} documents uploaded` : 'No documents available'}
                </p>
                {agentData.documents && agentData.documents.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Document types: {agentData.documents.map((doc: any) => doc.type || doc.documentType || 'Unknown').join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No agent data available</p>
              <p className="text-sm text-gray-500">Agent ID: {loanData?.agentId || 'N/A'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Factory Details */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center text-green-900">
            <Building2 className="w-5 h-5 mr-2" />
            Factory Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {factoryLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Loading factory details...</span>
            </div>
          ) : factoryData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Factory Name</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.factoryName || factoryData.businessName || factoryData.name || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Factory Type</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.factoryType || factoryData.industry || factoryData.industryType || factoryData.businessSector || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">License Number</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.licenseNumber || factoryData.businessLicense || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">License Expiration</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.licenseExpiryDate || factoryData.licenseExpirationDate || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">TIN</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.tinNumber || factoryData.tin || factoryData.taxId || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Email</p>
                  <p className="text-lg font-medium text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {factoryData.email || factoryData.emailAddress || factoryData.contactEmail || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Phone</p>
                  <p className="text-lg font-medium text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {factoryData.phone || factoryData.phoneNumber || factoryData.contactPhone || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Factory ID</p>
                  <p className="text-lg font-medium text-gray-900">{factoryData.id || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Industry</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.factoryType || factoryData.industry || factoryData.industryType || factoryData.businessSector || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Production Capacity</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.productionCapacity || factoryData.capacity || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Approval Status</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.adminApprovalStatus || factoryData.status || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No factory data available</p>
              <p className="text-sm text-gray-500">Factory ID: {loanData?.factoryId || 'N/A'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loan Rejection Dialog */}
      {showLoanRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Loan Application</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={loanRejectReason}
                  onChange={(e) => setLoanRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this loan application..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLoanRejectDialog(false);
                    setLoanRejectReason("");
                  }}
                  disabled={isRejectingLoan}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRejectLoan}
                  disabled={isRejectingLoan || !loanRejectReason.trim()}
                  variant="destructive"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Loan Application</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%) *
                  </Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    placeholder="Enter interest rate"
                    className="w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="processingFeePercentage" className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Fee Percentage (%) *
                  </Label>
                  <Input
                    id="processingFeePercentage"
                    type="number"
                    value={processingFeePercentage}
                    onChange={(e) => setProcessingFeePercentage(Number(e.target.value))}
                    placeholder="Enter processing fee percentage"
                    className="w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="processingFeeFactor" className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Fee Factor *
                  </Label>
                  <Input
                    id="processingFeeFactor"
                    type="number"
                    value={processingFeeFactor}
                    onChange={(e) => setProcessingFeeFactor(Number(e.target.value))}
                    placeholder="Enter processing fee factor"
                    className="w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLoanApproveDialog(false);
                    // Reset form fields
                    setApprovedAmount(loanData?.approvedAmount || loanData?.requestedAmount || 0);
                    setInterestRate(loanData?.interestRate || 0);
                    setProcessingFeePercentage(0);
                    setProcessingFeeFactor(0);
                  }}
                  disabled={isApprovingLoan}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitLoanApproval}
                  disabled={isApprovingLoan || approvedAmount <= 0 || interestRate < 0 || processingFeePercentage < 0 || processingFeeFactor < 0}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetailPage;