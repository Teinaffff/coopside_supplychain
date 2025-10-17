import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Download, CheckCircle, XCircle, User, Building2, Phone, Mail, MapPin, AlertCircle, CreditCard, FileText, Calendar, Hash } from "lucide-react";
import agentService, { Agent } from "../../../services/agentService";
import factoryService, { Factory } from "../../../services/factoryService";
import loanApplicationService, { LoanApplication } from "../../../services/loanApplicationService";
import { toast } from "react-hot-toast";

const LoanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loanData, setLoanData] = useState<LoanApplication | null>(null);
  const [agentData, setAgentData] = useState<Agent | null>(null);
  const [factoryData, setFactoryData] = useState<Factory | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [factoryLoading, setFactoryLoading] = useState(false);
  const [isApprovingLoan, setIsApprovingLoan] = useState(false);
  const [isRejectingLoan, setIsRejectingLoan] = useState(false);
  const [loanRejectReason, setLoanRejectReason] = useState("");
  const [showLoanRejectDialog, setShowLoanRejectDialog] = useState(false);

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

  // Function to approve loan
  const handleApproveLoan = async () => {
    if (!loanData) return;
    
    setIsApprovingLoan(true);
    try {
      await loanApplicationService.approveLoanApplication({
        applicationNumber: loanData.applicationNumber,
        remarks: 'Approved by bank'
      });
      toast.success('Loan application approved successfully');
      // Refresh loan data
      fetchLoanData(loanData.applicationNumber);
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

  // Function to export loan details to Excel
  const exportToExcel = () => {
    if (!loanData) return;
    
    try {
      const excelData = {
        'Application Number': loanData.applicationNumber,
        'Borrower Name': loanData.borrowerName || 'N/A',
        'Product Code': loanData.loanTypeCode || 'N/A',
        'Product Name': loanData.loanTypeName || loanData.loanType,
        'Status': loanData.status.replace(/_/g, ' '),
        'Requested Amount': loanData.requestedAmount,
        'Approved Amount': loanData.approvedAmount || 'N/A',
        'Interest Rate': loanData.interestRate || 'N/A',
        'Tenure (Months)': loanData.tenure,
        'Products Count': loanData.products,
        'Request Date': loanData.requestDate ? new Date(loanData.requestDate).toLocaleDateString() : 'N/A',
        'Submission Date': loanData.submissionDate ? new Date(loanData.submissionDate).toLocaleDateString() : 'N/A',
        'Created Date': new Date(loanData.created).toLocaleDateString(),
        'Risk Score': loanData.riskScore || 'N/A',
        'Purpose': loanData.purpose || 'N/A',
        'Agent ID': loanData.agentId || 'N/A',
        'Factory ID': loanData.factoryId || 'N/A',
        'Agent Full Name': agentData?.fullName || agentData?.fullLegalName || agentData?.name || 'N/A',
        'Agent Username': agentData?.username || 'N/A',
        'Agent Email': agentData?.email || 'N/A',
        'Agent Phone': agentData?.phone || 'N/A',
        'Agent Location': agentData?.location || agentData?.address || 'N/A',
        'Agent Type': agentData?.agentType || 'N/A',
        'Agent Approval Status': agentData?.superAdminApprovalStatus || agentData?.status || 'N/A',
        'Factory Name': factoryData?.factoryName || factoryData?.businessName || factoryData?.name || 'N/A',
        'Factory Registration': factoryData?.registrationNumber || factoryData?.registrationNo || 'N/A',
        'Factory TIN': factoryData?.tin || factoryData?.taxId || 'N/A',
        'Factory Email': factoryData?.email || factoryData?.emailAddress || 'N/A',
        'Factory Phone': factoryData?.phone || factoryData?.phoneNumber || 'N/A',
        'Factory Address': factoryData?.address || factoryData?.factoryLocation || 'N/A',
        'Factory Industry': factoryData?.industry || factoryData?.industryType || 'N/A',
        'Factory Contact Person': factoryData?.contactPerson || factoryData?.contact || 'N/A',
        'Factory Bank Account': factoryData?.bankAccount || factoryData?.bankDetails || 'N/A',
        'Factory Production Capacity': factoryData?.productionCapacity || factoryData?.capacity || 'N/A',
        'Factory Approval Status': factoryData?.adminApprovalStatus || factoryData?.status || 'N/A'
      };

      // Convert to CSV format
      const headers = Object.keys(excelData);
      const csvContent = [
        headers.join(','),
        headers.map(header => {
          const value = excelData[header as keyof typeof excelData];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `loan-details-${loanData.applicationNumber}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Loan details exported successfully!');
    } catch (error) {
      console.error('Error exporting loan details:', error);
      toast.error('Failed to export loan details.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchLoanData(id);
    }
  }, [id]);

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
            onClick={() => navigate('/coop/loan-monitoring')}
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
          <Button 
            variant="outline" 
            onClick={exportToExcel}
            className="bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 hover:border-cyan-600"
          >
            <Download className="mr-2 h-4 w-4" /> Export to Excel
          </Button>
          
          {/* Loan Action Buttons */}
          {loanData && (loanData.status === "PENDING_PARTNER_APPROVAL" || loanData.status === "PENDING_SUPER_ADMIN_APPROVAL") && (
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleApproveLoan}
                disabled={isApprovingLoan}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
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
                className="px-4 py-2"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Loan
              </Button>
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
                  <p className="text-sm font-semibold text-gray-700 mb-1">Registration Number</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.registrationNumber || factoryData.registrationNo || factoryData.businessLicense || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">TIN</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.tin || factoryData.taxId || 'N/A'}
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Address</p>
                  <p className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {factoryData.address || factoryData.factoryLocation || factoryData.location || 'N/A'}
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
                    {factoryData.industry || factoryData.industryType || factoryData.businessSector || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Contact Person</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.contactPerson || factoryData.contact || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Bank Account</p>
                  <p className="text-lg font-medium text-gray-900">
                    {factoryData.bankAccount || factoryData.bankDetails || 'N/A'}
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
    </div>
  );
};

export default LoanDetailPage;