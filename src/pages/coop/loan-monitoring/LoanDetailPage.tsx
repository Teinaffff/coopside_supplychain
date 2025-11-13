import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Input } from "../../../common/ui/input";
import { Label } from "../../../common/ui/label";
import { Textarea } from "../../../common/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../common/ui/tabs";
import { CheckCircle, X, FileText, TrendingUp, ExternalLink, TrendingDown } from "lucide-react";
import loanApplicationService, { LoanApplication } from "../../../services/loanApplicationService";
import { toast } from "react-hot-toast";
import API from "../../../config/axios-config";
import factoryService from "../../../services/factoryService";
import loanProductService from "../../../services/loanProductService";
import agentService from "../../../services/agentService";
import creditScoreService, { CreditScoreResponse } from "../../../services/creditScoreService";
import { calculateLoanApproval, getRiskLevelColor, getDecisionColor } from "../../../utils/loanApprovalDecisionTree";

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
  const [factoryDetails, setFactoryDetails] = useState<any[]>([]);
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
  
  // Credit score state
  const [creditScore, setCreditScore] = useState<CreditScoreResponse | null>(null);
  const [isLoadingCreditScore, setIsLoadingCreditScore] = useState(false);
  const [creditScoreError, setCreditScoreError] = useState<string | null>(null);
  const [approvalDecision, setApprovalDecision] = useState<any>(null);
  
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

  // Function to fetch credit score from http://10.8.100.39:5004/api/v1/credit-score
  const fetchCreditScore = async (agentId: string) => {
    if (!agentId) {
      console.warn("Cannot fetch credit score: Agent ID is missing");
      setCreditScore(null);
      setCreditScoreError("Agent ID is missing");
      return;
    }
    
    setIsLoadingCreditScore(true);
    setCreditScoreError(null); // Clear previous errors
    try {
      console.log("=== FETCHING CREDIT SCORE ===");
      console.log("Agent ID to fetch credit score:", agentId);
      console.log("Calling POST http://10.8.100.39:5004/api/v1/credit-score with body: { agentId:", agentId, "}");
      
      const creditScoreData = await creditScoreService.getCreditScore(agentId);
      
      console.log("Credit Score API Response:", creditScoreData);
      console.log("Credit Score Amount:", creditScoreData.creditScore);
      console.log("Key Metrics:", creditScoreData.keyMetrics);
      console.log("Key Metrics account_age:", creditScoreData.keyMetrics?.account_age);
      console.log("Key Metrics transaction_activity:", creditScoreData.keyMetrics?.transaction_activity);
      console.log("Key Metrics loan_history:", creditScoreData.keyMetrics?.loan_history);
      console.log("Risk Level:", creditScoreData.riskLevel);
      
      // Set credit score regardless of value (0 is a valid score, just indicates high risk)
      setCreditScore(creditScoreData);
      setCreditScoreError(null); // Clear any previous errors
      console.log("✅ Credit score successfully fetched and set:", creditScoreData.creditScore);
      
      // Calculate approval decision if loan data is available
      // Use current loanData from state
      const currentLoanData = loanData;
      if (currentLoanData && currentLoanData.requestedAmount) {
        const decision = calculateLoanApproval(
          creditScoreData.creditScore,
          creditScoreData.riskLevel,
          currentLoanData.requestedAmount
        );
        setApprovalDecision(decision);
        console.log("Approval Decision calculated:", decision);
      } else {
        console.log("Loan data not yet available, approval decision will be calculated when loan data is set");
      }
    } catch (e: any) {
      console.error("❌ Failed to load credit score:", e);
      const errorMessage = e?.response?.data?.message || e?.message || "Unknown error occurred";
      const errorStatus = e?.response?.status;
      const errorCode = e?.code;
      
      console.error("Error details:", {
        message: errorMessage,
        status: errorStatus,
        code: errorCode,
        response: e?.response?.data,
        url: e?.config?.url,
        method: e?.config?.method,
        data: e?.config?.data
      });
      
      // Set user-friendly error message
      let userFriendlyError = "Failed to load credit score";
      if (errorCode === "ECONNREFUSED" || errorCode === "ERR_NETWORK") {
        userFriendlyError = "Cannot connect to credit score service. Please check your network connection.";
      } else if (errorStatus === 404) {
        userFriendlyError = "Credit score service not found. Please contact support.";
      } else if (errorStatus === 500) {
        userFriendlyError = "Credit score service error. Please try again later.";
      } else if (errorMessage) {
        userFriendlyError = `Error: ${errorMessage}`;
      }
      
      setCreditScore(null);
      setCreditScoreError(userFriendlyError);
      // Don't show error toast as credit score is optional, but log it
    } finally {
      setIsLoadingCreditScore(false);
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
    
    // Fetch credit score for the agent
    console.log("📊 About to fetch credit score for agent:", agentId);
    fetchCreditScore(agentId);
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

  const fetchFactoryDetails = async (factoryIds: string[]) => {
    if (!factoryIds || factoryIds.length === 0) {
      setFactoryDetails([]);
      return;
    }
    
    setIsLoadingFactoryDetails(true);
    try {
      console.log("=== FETCHING FACTORY DETAILS ===");
      console.log("Factory IDs to fetch:", factoryIds);
      
      // Fetch factory details for all factory IDs in parallel
      const factoryPromises = factoryIds.map(async (factoryId) => {
        try {
          console.log(`Fetching factory details for ID: ${factoryId}`);
          const factory = await factoryService.getFactoryById(factoryId);
          console.log(`Successfully fetched factory ${factoryId}:`, factory);
          console.log(`Factory ${factoryId} data structure:`, JSON.stringify(factory, null, 2));
          console.log(`Factory ${factoryId} keys:`, Object.keys(factory || {}));
          console.log(`Factory ${factoryId} name:`, factory?.name, factory?.factoryName, factory?.businessName);
          return factory;
        } catch (e) {
          console.warn(`Failed to load factory details for ID ${factoryId}:`, e);
          return null; // Return null for failed fetches, we'll filter them out
        }
      });
      
      const factories = await Promise.all(factoryPromises);
      // Filter out null values (failed fetches)
      const validFactories = factories.filter(factory => factory !== null);
      
      console.log(`Successfully fetched ${validFactories.length} out of ${factoryIds.length} factory details`);
      console.log('All fetched factories:', validFactories);
      console.log('Factory details state will be set to:', validFactories);
      setFactoryDetails(validFactories);
    } catch (e) {
      console.error("Error fetching factory details:", e);
      setFactoryDetails([]);
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
      console.log("Loan Application API Response (raw):", JSON.stringify(loan, null, 2));
      console.log("Loan Application API Response keys:", Object.keys(loan || {}));
      
      // Debug: Check all possible agentId field names
      const rawLoan = loan as any;
      console.log("=== AGENT ID EXTRACTION DEBUG ===");
      console.log("agentId:", rawLoan?.agentId);
      console.log("agent_id:", rawLoan?.agent_id);
      console.log("agent?.id:", rawLoan?.agent?.id);
      console.log("borrowerId:", rawLoan?.borrowerId);
      console.log("borrower_id:", rawLoan?.borrower_id);
      console.log("borrower?.id:", rawLoan?.borrower?.id);
      
      // Extract agentId with comprehensive field checking
      const extractedAgentId = rawLoan?.agentId || rawLoan?.agent_id || rawLoan?.agent?.id || 
                               rawLoan?.borrowerId || rawLoan?.borrower_id || rawLoan?.borrower?.id ||
                               rawLoan?.userId || rawLoan?.user_id || rawLoan?.user?.id;
      
      console.log("Extracted Agent ID (final):", extractedAgentId);
      console.log("Extracted Agent ID type:", typeof extractedAgentId);
      
      console.log("Found Loan:", loan);
      console.log("Found loan status:", loan.status);
      console.log("Found loan superAdminStatus:", loan.superAdminStatus);
      console.log("Loan factoryId:", rawLoan?.factoryId || rawLoan?.factory_id || rawLoan?.factory?.id);
      console.log("Loan factoryIds (array):", rawLoan?.factoryIds || rawLoan?.factory_ids || rawLoan?.factories);
      
      // Transform API data to match our expected format with proper field mapping
      const transformedLoan: LoanApplication = {
        applicationNumber: rawLoan?.applicationNumber || rawLoan?.id || loanId,
        loanType: rawLoan?.loanTypeName || rawLoan?.loanType || rawLoan?.type || 'Goods Purchase Financing',
        status: rawLoan?.status || 'PENDING_PARTNER_APPROVAL',
        // CRITICAL: Preserve superAdminStatus and agentStatus to correctly show separate statuses
        // superAdminStatus represents Super Admin's decision, agentStatus represents Partner's decision
        superAdminStatus: rawLoan?.superAdminStatus || rawLoan?.super_admin_status || undefined,
        agentStatus: rawLoan?.agentStatus || rawLoan?.agent_status || rawLoan?.partnerStatus || rawLoan?.partner_status || undefined,
        requestedAmount: rawLoan?.requestedAmount || rawLoan?.amount || rawLoan?.loanAmount || rawLoan?.request_amount || rawLoan?.requestAmount || rawLoan?.principalAmount || rawLoan?.principal_amount || rawLoan?.totalAmount || rawLoan?.total_amount || rawLoan?.loanDetails?.amount || rawLoan?.financialDetails?.amount || rawLoan?.applicationDetails?.amount || 0,
        approvedAmount: rawLoan?.approvedAmount || rawLoan?.approved_amount || undefined,
        tenure: rawLoan?.tenure || rawLoan?.duration || 12,
        products: rawLoan?.products || rawLoan?.productCount || 0,
        created: rawLoan?.created || rawLoan?.createdAt || rawLoan?.date_created || new Date().toISOString(),
        factoryId: rawLoan?.factoryId || rawLoan?.factory_id || rawLoan?.factory?.id,
        agentId: extractedAgentId, // Use the comprehensively extracted agentId
        borrowerName: rawLoan?.borrowerName || rawLoan?.borrower_name || rawLoan?.borrower?.name || 'N/A',
        interestRate: rawLoan?.interestRate || rawLoan?.interest_rate || undefined,
        purpose: rawLoan?.purpose || rawLoan?.description || 'N/A',
        documents: rawLoan?.documents || rawLoan?.attachments || [],
        riskScore: rawLoan?.riskScore || rawLoan?.risk_score || undefined,
        // Additional fields for better display
        loanTypeCode: rawLoan?.loanTypeCode || rawLoan?.productCode || rawLoan?.typeCode,
        loanTypeName: rawLoan?.loanTypeName || rawLoan?.productName || rawLoan?.loanType,
        requestDate: rawLoan?.requestDate || rawLoan?.created || rawLoan?.createdAt || rawLoan?.date_created,
        submissionDate: rawLoan?.submissionDate || rawLoan?.submittedAt || rawLoan?.created,
      };
      
      console.log("Transformed Loan Data:", transformedLoan);
      console.log("✅ Extracted Agent ID from loan application:", transformedLoan.agentId);
      setLoanData(transformedLoan);
      
      // Fetch agent data and credit score - CRITICAL: This must happen to get the credit score
      if (transformedLoan.agentId) {
        const agentIdString = transformedLoan.agentId.toString();
        console.log("🚀 Fetching agent data and credit score for Agent ID:", agentIdString);
        console.log("   → This will trigger: POST http://10.8.100.39:5004/api/v1/credit-score with { agentId:", agentIdString, "}");
        fetchAgentData(agentIdString);
      } else {
        console.error("❌ No Agent ID found in loan application response. Cannot fetch credit score.");
        console.error("   Available fields in loan response:", Object.keys(rawLoan || {}));
        setCreditScore(null);
      }
      
      // Extract factory IDs - could be single ID or array of IDs or array of factory objects
      const factoryId = transformedLoan.factoryId;
      
      // Try to get factory IDs from various possible fields
      let factoryIdsArray: any = rawLoan?.factoryIds || rawLoan?.factory_ids || rawLoan?.factories;
      
      // If factories is an array of objects, extract IDs from them
      if (Array.isArray(factoryIdsArray) && factoryIdsArray.length > 0) {
        // Check if first element is an object with an id property
        if (typeof factoryIdsArray[0] === 'object' && factoryIdsArray[0] !== null) {
          factoryIdsArray = factoryIdsArray.map((f: any) => f?.id || f?.factoryId || f?.factory_id);
        }
      }
      
      // If no array found, try single factory ID
      if (!factoryIdsArray || (Array.isArray(factoryIdsArray) && factoryIdsArray.length === 0)) {
        const singleFactoryId = rawLoan?.factoryId || rawLoan?.factory_id || rawLoan?.factory?.id;
        factoryIdsArray = singleFactoryId ? [singleFactoryId] : [];
      }
      
      // Ensure factoryIdsArray is an array and filter out null/undefined values
      const factoryIds: (string | number)[] = Array.isArray(factoryIdsArray) 
        ? factoryIdsArray.filter((id: any) => id !== null && id !== undefined)
        : [];
      
      console.log("Extracted Factory IDs:", factoryIds);
      
      if (factoryIds.length > 0) {
        // Fetch factory details for all factory IDs
        fetchFactoryDetails(factoryIds.map(id => id.toString()));
        
        // For factory loan applications, use the first factory ID (or we could fetch for all)
        const firstFactoryId = factoryIds[0];
        console.log("Fetching factory loan applications for factory ID:", firstFactoryId);
        fetchFactoryLoans(firstFactoryId.toString());
      } else {
        console.warn("No factory IDs found in loan application");
        setFactoryLoanApplications([]);
        setFactoryDetails([]);
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
      setFactoryDetails([]);
      
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
      
      // Calculate approval decision if credit score is available
      if (creditScore && loanData.requestedAmount) {
        console.log("🔄 Recalculating approval decision with:", {
          creditScore: creditScore.creditScore,
          riskLevel: creditScore.riskLevel,
          requestedAmount: loanData.requestedAmount
        });
        const decision = calculateLoanApproval(
          creditScore.creditScore,
          creditScore.riskLevel,
          loanData.requestedAmount
        );
        setApprovalDecision(decision);
        console.log("✅ Approval decision updated:", decision);
        // Auto-populate approved amount based on decision if not already set
        if (!loanData.approvedAmount && decision.approvedAmount > 0) {
          setApprovedAmount(decision.approvedAmount);
        }
      } else if (creditScore && !loanData.requestedAmount) {
        console.log("⚠️ Credit score available but loanData.requestedAmount is missing");
      } else if (!creditScore && loanData.requestedAmount) {
        console.log("⚠️ Loan data available but credit score not yet loaded");
      }
    }
  }, [loanData, creditScore]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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
      <Card className="mb-4 border-l-4 border-l-cyan-500 dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:bg-slate-700 p-3">
          <CardTitle className="flex items-center text-cyan-900 dark:text-white text-base">
            Loan Application Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left Column */}
            <div className="space-y-2">
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Application Number</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{loanData?.applicationNumber || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Borrower Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{loanData?.borrowerName || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Product Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{loanData?.loanTypeName || loanData?.loanType || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Status</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{loanData?.status?.replace(/_/g, ' ') || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Request Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {loanData?.requestDate ? new Date(loanData.requestDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              </div>
            
            {/* Right Column */}
            <div className="space-y-2">
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Requested Amount</p>
                <p className="text-base font-bold text-cyan-600 dark:text-cyan-400">ETB {loanData?.requestedAmount?.toLocaleString() || '0.00'}</p>
              </div>
              {/* Credit Score Display */}
              {isLoadingCreditScore ? (
                <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Credit Score</p>
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-600 mr-2"></div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Loading...</p>
                  </div>
                </div>
              ) : creditScore ? (
                <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Credit Score</p>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {typeof creditScore.creditScore === 'number' 
                        ? creditScore.creditScore 
                        : typeof creditScore.creditScore === 'string' 
                          ? Number(creditScore.creditScore) || 0 
                          : 0}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(creditScore.riskLevel || 'HIGH')}`}>
                      {typeof creditScore.riskLevel === 'string' ? creditScore.riskLevel : 'HIGH'} RISK
                    </span>
                  </div>
                  {approvalDecision && (
                    <div className="mt-1 pt-1 border-t border-gray-200 dark:border-slate-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Recommended Decision:</p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDecisionColor(approvalDecision.decision)}`}>
                          {approvalDecision.decision.replace(/_/g, ' ')}
                        </span>
                        {approvalDecision.approvedAmount > 0 && (
                          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                            ETB {approvalDecision.approvedAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : loanData?.agentId ? (
                <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Credit Score</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                    {creditScoreError || "Unable to load credit score. Check console for details."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => {
                      if (loanData?.agentId) {
                        console.log("🔄 Manually retrying credit score fetch for agent:", loanData.agentId);
                        fetchCreditScore(loanData.agentId.toString());
                      }
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : null}
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Product Code</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{loanData?.loanTypeCode || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Purpose</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{loanData?.purpose || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Tenure</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{loanData?.tenure || 12} months</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Submission Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {loanData?.submissionDate ? new Date(loanData.submissionDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Sections */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardContent className="p-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isFromTracking ? 'grid-cols-5' : 'grid-cols-4'} mb-3 dark:bg-slate-700`}>
              <TabsTrigger 
                value="agent-details"
                className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200 relative flex items-center gap-2"
              >
                <span>Agent Details</span>
                {agentDetails && (agentDetails?.id || loanData?.agentId) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const agentId = agentDetails?.id || loanData?.agentId;
                      if (agentId) {
                        navigate(`/coop/approval/agents/${agentId}`);
                      }
                    }}
                    className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-500 rounded transition-colors flex items-center justify-center"
                    title="View Full Agent Details"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  </button>
                )}
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
            <TabsContent value="agent-details" className="space-y-2">
              {isLoadingAgentDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading agent details...</p>
                  </div>
                </div>
              ) : agentDetails ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column - Agent Details */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Gender</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {agentDetails?.gender || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Agent Type</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {agentDetails?.agentType || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">ID Number</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {agentDetails?.idNumber || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">License Number</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {agentDetails?.licenseNumber || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg md:col-span-2">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">License Expiry Date</p>
                        {agentDetails?.licenseExpiryDate ? (() => {
                          const expiryDate = new Date(agentDetails.licenseExpiryDate);
                          const daysRemaining = calculateLicenseDaysRemaining(agentDetails.licenseExpiryDate);
                          const isExpired = daysRemaining !== null && daysRemaining < 0;
                          const isExpiringSoon = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 30;
                          
                          return (
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {expiryDate.toLocaleDateString()}
                              </p>
                              {daysRemaining !== null && (
                                <div className="mt-1">
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
                          <p className="text-sm font-medium text-gray-900 dark:text-white">N/A</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Bank Information */}
                    {agentDetails?.bankAccountInfos && Array.isArray(agentDetails.bankAccountInfos) && agentDetails.bankAccountInfos.length > 0 && (
                      <>
                        {agentDetails.bankAccountInfos.map((account: any, index: number) => (
                          <div key={account?.id || index} className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {/* Left Column */}
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Bank Name</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {account?.bankName || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Account Number</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {account?.accountNumber || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Account Name</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {account?.accountName || 'N/A'}
                                  </p>
                                  {account?.isPrimary && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400 mt-1">
                                      Primary Account
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Right Column */}
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Branch Name</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {account?.branchName || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Swift Code</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {account?.swiftCode || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">IBAN</p>
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

                  {/* Right Column - Credit Score Analysis Block */}
                  <div className="space-y-4">
                    {creditScore ? (
                      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
                        {/* Recommendation Banner */}
                        {creditScore.recommendation && (
                          <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3 mb-4">
                            <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-200">
                              {creditScore.recommendation}
                            </p>
                          </div>
                        )}
                        
                        {/* Header with Overall Score and Risk Level */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Overall Credit Score</p>
                            <div className="flex items-center gap-3">
                              <div className="w-20 h-20 rounded-full border-4 border-cyan-500 dark:border-cyan-400 flex items-center justify-center bg-cyan-50 dark:bg-cyan-900/20">
                                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                                  {typeof creditScore.creditScore === 'number' 
                                    ? creditScore.creditScore.toFixed(1)
                                    : typeof creditScore.creditScore === 'string' 
                                      ? Number(creditScore.creditScore).toFixed(1) || '0.0'
                                      : '0.0'}%
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getRiskLevelColor(creditScore.riskLevel || 'HIGH')}`}>
                              {creditScore.riskLevel || 'HIGH'}-RISK
                            </span>
                          </div>
                        </div>

                        {/* Score Breakdown and Financial Analysis - Side by Side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                          {/* Left Column - Score Breakdown */}
                          {creditScore.details && (
                            <div className="space-y-3">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Score Breakdown</p>
                              <div className="space-y-2">
                                {(creditScore.details.accountAge !== undefined || creditScore.details.account_age !== undefined) && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Account Age</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {(() => {
                                        const value = creditScore.details.accountAge ?? creditScore.details.account_age;
                                        return typeof value === 'number' ? value.toFixed(2) : value;
                                      })()}%
                                    </span>
                                  </div>
                                )}
                                {creditScore.details.demographic !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Demographic</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {typeof creditScore.details.demographic === 'number' 
                                        ? creditScore.details.demographic.toFixed(2) 
                                        : creditScore.details.demographic}%
                                    </span>
                                  </div>
                                )}
                                {(creditScore.details.transactionBehavior !== undefined || creditScore.details.transaction_behavior !== undefined) && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Transaction Behavior</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {(() => {
                                        const value = creditScore.details.transactionBehavior ?? creditScore.details.transaction_behavior;
                                        return typeof value === 'number' ? value.toFixed(2) : value;
                                      })()}%
                                    </span>
                                  </div>
                                )}
                                {(creditScore.details.paymentHistory !== undefined || creditScore.details.repayment_history !== undefined) && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Repayment History</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {(() => {
                                        const value = creditScore.details.paymentHistory ?? creditScore.details.repayment_history;
                                        return typeof value === 'number' ? value.toFixed(2) : value;
                                      })()}%
                                    </span>
                                  </div>
                                )}
                                {(creditScore.details.riskAdjustment !== undefined || creditScore.details.risk_adjustment !== undefined) && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Risk Adjustment</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {(() => {
                                        const value = creditScore.details.riskAdjustment ?? creditScore.details.risk_adjustment;
                                        return typeof value === 'number' ? value.toFixed(2) : value;
                                      })()}%
                                    </span>
                                  </div>
                                )}
                                {/* Fallback for other breakdown fields */}
                                {creditScore.details.creditHistoryLength !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Credit History Length</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {typeof creditScore.details.creditHistoryLength === 'number' 
                                        ? creditScore.details.creditHistoryLength.toFixed(2) 
                                        : creditScore.details.creditHistoryLength}%
                                    </span>
                                  </div>
                                )}
                                {creditScore.details.creditUtilization !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Credit Utilization</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {typeof creditScore.details.creditUtilization === 'number' 
                                        ? creditScore.details.creditUtilization.toFixed(2) 
                                        : creditScore.details.creditUtilization}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Right Column - Financial Analysis */}
                          {creditScore.financialAnalysis && (
                            <div className="space-y-3">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Financial Analysis</p>
                              <div className="space-y-2">
                                {creditScore.financialAnalysis.total_transactions_analyzed !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Total Transactions Analyzed</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {creditScore.financialAnalysis.total_transactions_analyzed}
                                    </span>
                                  </div>
                                )}
                                {creditScore.financialAnalysis.analysis_period && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Analysis Period</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {creditScore.financialAnalysis.analysis_period}
                                    </span>
                                  </div>
                                )}
                                {creditScore.financialAnalysis.average_account_balance !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Average Account Balance</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      ETB {creditScore.financialAnalysis.average_account_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                )}
                                {creditScore.financialAnalysis.total_credit_amount !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Total Credit Amount</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      ETB {creditScore.financialAnalysis.total_credit_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                )}
                                {creditScore.financialAnalysis.total_debit_amount !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Total Debit Amount</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      ETB {creditScore.financialAnalysis.total_debit_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                )}
                                {creditScore.financialAnalysis.transaction_pattern && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Transaction Pattern</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {creditScore.financialAnalysis.transaction_pattern.replace(/_/g, ' ')}
                                    </span>
                                  </div>
                                )}
                                {creditScore.financialAnalysis.active_loans !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Active Loans</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {creditScore.financialAnalysis.active_loans}
                                    </span>
                                  </div>
                                )}
                                {creditScore.financialAnalysis.overdue_loans !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Overdue Loans</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {creditScore.financialAnalysis.overdue_loans}
                                    </span>
                                  </div>
                                )}
                                {creditScore.financialAnalysis.total_repayment_history !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Total Repayment History</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {creditScore.financialAnalysis.total_repayment_history}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Strengths and Key Metrics - Side by Side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                          {/* Left Column - Strengths */}
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Strengths</p>
                            <div className="space-y-2">
                              {creditScore.creditScore >= 50 && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">Established account</span>
                                </div>
                              )}
                              {((creditScore.details?.transactionBehavior !== undefined && Number(creditScore.details.transactionBehavior) > 0) ||
                                (creditScore.details?.transaction_behavior !== undefined && Number(creditScore.details.transaction_behavior) > 0)) && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">Regular transactions</span>
                                </div>
                              )}
                              {((creditScore.details?.paymentHistory !== undefined && Number(creditScore.details.paymentHistory) > 0) ||
                                (creditScore.details?.repayment_history !== undefined && Number(creditScore.details.repayment_history) > 0)) && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">Satisfactory repayment history</span>
                                </div>
                              )}
                              {(!creditScore.details || Object.keys(creditScore.details).length === 0) && creditScore.creditScore >= 50 && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">Good credit standing</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Column - Key Metrics */}
                          {(creditScore.keyMetrics || creditScore.financialAnalysis || agentLoanApplications?.length > 0) && (
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Metrics</p>
                              <div className="space-y-2">
                                {/* Account Age - Always show if keyMetrics section exists */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700 dark:text-gray-300">Account Age</span>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {(() => {
                                      // Try keyMetrics.account_age first
                                      const keyMetricsValue = creditScore.keyMetrics?.account_age;
                                      if (keyMetricsValue !== undefined && keyMetricsValue !== null && keyMetricsValue !== '') {
                                        if (typeof keyMetricsValue === 'number') {
                                          return `Active for ${keyMetricsValue} days`;
                                        } else if (typeof keyMetricsValue === 'string' && keyMetricsValue.trim() !== '') {
                                          return keyMetricsValue;
                                        }
                                      }
                                      
                                      // Fallback to creditHistoryLength from details
                                      const creditHistoryValue = creditScore.details?.creditHistoryLength ?? creditScore.details?.credit_history_length;
                                      if (creditHistoryValue !== undefined && creditHistoryValue !== null) {
                                        if (typeof creditHistoryValue === 'number' && creditHistoryValue > 0) {
                                          // If it's a percentage (0-100), convert to days
                                          if (creditHistoryValue <= 100) {
                                            const estimatedDays = Math.round(creditHistoryValue * 365 / 100);
                                            return `Active for ${estimatedDays} days`;
                                          } else {
                                            // If it's already in days
                                            return `Active for ${creditHistoryValue} days`;
                                          }
                                        }
                                      }
                                      
                                      // Fallback to accountAge from breakdown
                                      const breakdownAccountAge = creditScore.details?.accountAge ?? creditScore.details?.account_age;
                                      if (breakdownAccountAge !== undefined && breakdownAccountAge !== null) {
                                        if (typeof breakdownAccountAge === 'number' && breakdownAccountAge > 0) {
                                          // If it's a percentage, convert to days
                                          if (breakdownAccountAge <= 100) {
                                            const estimatedDays = Math.round(breakdownAccountAge * 365 / 100);
                                            return `Active for ${estimatedDays} days`;
                                          } else {
                                            return `Active for ${breakdownAccountAge} days`;
                                          }
                                        }
                                      }
                                      
                                      return 'N/A';
                                    })()}
                                  </span>
                                </div>
                                {/* Transaction Activity */}
                                {creditScore.keyMetrics?.transaction_activity !== undefined && creditScore.keyMetrics?.transaction_activity !== null ? (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Transactions</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {(() => {
                                        const value = creditScore.keyMetrics.transaction_activity;
                                        if (typeof value === 'number') {
                                          return `${value} transactions analyzed`;
                                        } else if (typeof value === 'string' && value.trim() !== '') {
                                          return value;
                                        }
                                        return 'N/A';
                                      })()}
                                    </span>
                                  </div>
                                ) : creditScore.financialAnalysis?.total_transactions_analyzed !== undefined && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Transactions</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {creditScore.financialAnalysis.total_transactions_analyzed} transactions analyzed
                                    </span>
                                  </div>
                                )}
                                {/* Loan History */}
                                {(creditScore.keyMetrics?.loan_history !== undefined && creditScore.keyMetrics?.loan_history !== null && creditScore.keyMetrics?.loan_history !== '') ? (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Loan History</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {typeof creditScore.keyMetrics.loan_history === 'number' 
                                        ? `${creditScore.keyMetrics.loan_history} previous loan${creditScore.keyMetrics.loan_history !== 1 ? 's' : ''}`
                                        : String(creditScore.keyMetrics.loan_history)}
                                    </span>
                                  </div>
                                ) : (agentLoanApplications && agentLoanApplications.length > 0) && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Loan History</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {agentLoanApplications.length} previous loan{agentLoanApplications.length !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Overall Summary */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {creditScore.overallSummary || creditScore.overall_summary || 
                                (creditScore.creditScore >= 75 
                                  ? "Excellent financial health. Highly reliable candidate for credit."
                                  : creditScore.creditScore >= 50
                                    ? "Good financial health. Reliable candidate for credit."
                                    : "Fair financial health. Consider additional verification.")}
                            </p>
                          </div>
                        </div>

                        {/* Account Ownership Note */}
                        {(creditScore.accountOwnershipNote || creditScore.account_ownership_note) && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                              <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-200 mb-1">Account Ownership Note</p>
                              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                {creditScore.accountOwnershipNote || creditScore.account_ownership_note}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : isLoadingCreditScore ? (
                      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading credit score...</p>
                          </div>
                        </div>
                      </div>
                    ) : creditScoreError ? (
                      <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Unable to load credit score: {creditScoreError}
                        </p>
                      </div>
                    ) : null}
                  </div>
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
              {isLoadingFactoryDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading factory details...</p>
                  </div>
                </div>
              ) : factoryDetails && factoryDetails.length > 0 ? (
                <div className="space-y-4">
                  {factoryDetails.map((factory: any, index: number) => {
                    // Debug logging
                    console.log(`Rendering factory ${index}:`, factory);
                    console.log(`Factory ${index} keys:`, Object.keys(factory || {}));
                    console.log(`Factory ${index} form property:`, factory?.form);
                    
                    // Check if data is in a 'form' property (like in use-factories hook)
                    const factoryData = factory?.form || factory;
                    
                    const factoryName = factoryData?.name || factoryData?.factoryName || factoryData?.businessName || 
                                      factory?.name || factory?.factoryName || factory?.businessName || 'N/A';
                    const factoryId = factoryData?.id || factoryData?.registrationNo || factoryData?.registrationNumber || 
                                    factory?.id || factory?.registrationNo || factory?.registrationNumber || 'N/A';
                    const factoryLocation = factoryData?.location || factoryData?.address || factoryData?.factoryLocation || 
                                          factory?.location || factory?.address || factory?.factoryLocation || 'N/A';
                    const factoryPhone = factoryData?.phone || factoryData?.phoneNumber || factoryData?.contactPhone || factoryData?.contact || 
                                       factory?.phone || factory?.phoneNumber || factory?.contactPhone || factory?.contact || 'N/A';
                    const factoryEmail = factoryData?.email || factoryData?.emailAddress || factoryData?.contactEmail || 
                                       factory?.email || factory?.emailAddress || factory?.contactEmail || 'N/A';
                    const factoryTin = factoryData?.tin || factoryData?.tinNumber || factoryData?.taxId || 
                                     factory?.tin || factory?.tinNumber || factory?.taxId || 'N/A';
                    const factoryIndustry = factoryData?.industry || factoryData?.industryType || factoryData?.businessSector || factoryData?.factoryType || 
                                          factory?.industry || factory?.industryType || factory?.businessSector || factory?.factoryType || 'N/A';
                    const factoryLicense = factoryData?.businessLicense || factoryData?.licenseNumber || 
                                         factory?.businessLicense || factory?.licenseNumber || 'N/A';
                    
                    // Debug: Log extracted values
                    console.log(`Factory ${index} extracted values:`, {
                      factoryName,
                      factoryId,
                      factoryLocation,
                      factoryPhone,
                      factoryEmail,
                      factoryTin,
                      factoryIndustry,
                      factoryLicense
                    });
                    
                    // Get the actual factory ID for navigation
                    const actualFactoryId = factory?.id || factoryData?.id || factoryId;
                    
                    return (
                      <Card key={factoryId || index} className="dark:bg-slate-800 dark:border-slate-700">
                        <CardHeader className="p-3">
                          <CardTitle className="flex items-center dark:text-white text-base">
                            <span>Factory {factoryDetails.length > 1 ? `#${index + 1}` : ''} Details</span>
                            {actualFactoryId && actualFactoryId !== 'N/A' && (
                              <button
                                onClick={() => navigate(`/coop/approval/factories/${actualFactoryId}`)}
                                className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                                title="View factory details in Approval Management"
                              >
                                <ExternalLink className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                              </button>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Factory Name</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{factoryName}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Factory ID</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{factoryId}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Location</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{factoryLocation}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Phone</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{factoryPhone}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Email</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{factoryEmail}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">TIN Number</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{factoryTin}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Industry</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{factoryIndustry}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">License Number</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{factoryLicense}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-medium mb-2">No Manufacturer Details Available</p>
                  <p className="text-sm">Manufacturer information will be displayed here when available</p>
                </div>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-2">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader className="p-3">
                  <CardTitle className="flex items-center dark:text-white text-base">
                    <FileText className="w-4 h-4 mr-2" />
                    Products
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
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
                {/* Credit Score and Decision Tree Recommendation */}
                {approvalDecision && (
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 p-4 rounded-lg">
                    <div className="flex items-start mb-3">
                      <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mr-2 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-100 mb-1">
                          Loan Approval Decision Tree Recommendation
                        </p>
                        <p className="text-xs text-cyan-700 dark:text-cyan-300 mb-2">
                          {creditScore?.recommendation || approvalDecision.reason}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div>
                            <span className="text-xs text-cyan-600 dark:text-cyan-400">Credit Score: </span>
                            <span className="text-sm font-bold text-cyan-900 dark:text-cyan-100">
                              {creditScore?.creditScore && typeof creditScore.creditScore === 'number' 
                                ? creditScore.creditScore 
                                : creditScore?.creditScore && typeof creditScore.creditScore === 'string'
                                  ? Number(creditScore.creditScore) || 0
                                  : 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-cyan-600 dark:text-cyan-400">Risk Level: </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(creditScore?.riskLevel || 'HIGH')}`}>
                              {creditScore?.riskLevel && typeof creditScore.riskLevel === 'string' ? creditScore.riskLevel : 'HIGH'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-cyan-600 dark:text-cyan-400">Recommended: </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDecisionColor(approvalDecision.decision)}`}>
                              {approvalDecision.decision.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        {approvalDecision.approvedAmount > 0 && (
                          <div className="mt-2 pt-2 border-t border-cyan-200 dark:border-cyan-700">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-cyan-600 dark:text-cyan-400">Recommended Amount:</span>
                              <span className="text-lg font-bold text-cyan-900 dark:text-cyan-100">
                                ETB {approvalDecision.approvedAmount.toLocaleString()} ({approvalDecision.percentageApproved}%)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full text-cyan-600 border-cyan-300 hover:bg-cyan-100"
                              onClick={() => setApprovedAmount(approvalDecision.approvedAmount)}
                            >
                              Use Recommended Amount
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
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
                  {loanData?.requestedAmount && (
                    <p className="text-xs text-gray-500 mt-1">
                      Requested: ETB {loanData.requestedAmount.toLocaleString()}
                    </p>
                  )}
                </div>
                
                {/* Display auto-populated values from product */}
                {loanProduct && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Product Details:</p>
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