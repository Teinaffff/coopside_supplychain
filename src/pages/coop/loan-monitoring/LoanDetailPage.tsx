import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Download, CheckCircle, XCircle, User, Building2, Phone, Mail, MapPin, AlertCircle } from "lucide-react";
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

  // Function to fetch loan data
  const fetchLoanData = async (loanId: string) => {
    if (!loanId) return;
    
    console.log("=== FETCHING LOAN DATA ===");
    console.log("Loan ID:", loanId);
    
    setIsLoading(true);
    try {
      console.log("Calling loanApplicationService.getLoanApplicationById...");
      const loan = await loanApplicationService.getLoanApplicationById(loanId);
      console.log("API Response:", loan);
      
      // Transform API data to match our expected format
      const transformedLoan: LoanApplication = {
        applicationNumber: loan.applicationNumber || loan.id || loanId,
        loanType: loan.loanType || loan.type || 'Goods Purchase Financing',
        status: loan.status || 'PENDING',
        requestedAmount: loan.requestedAmount || loan.amount || 0,
        approvedAmount: loan.approvedAmount || loan.approved_amount || undefined,
        tenure: loan.tenure || loan.duration || 12,
        products: loan.products || loan.productCount || 0,
        created: loan.created || loan.createdAt || loan.date_created || new Date().toISOString(),
        factoryId: loan.factoryId || loan.factory_id || loan.factory?.id,
        agentId: loan.agentId || loan.agent_id || loan.agent?.id,
        borrowerName: loan.borrowerName || loan.borrower_name || loan.borrower?.name || 'N/A',
        interestRate: loan.interestRate || loan.interest_rate || undefined,
        purpose: loan.purpose || loan.description || 'N/A',
        documents: loan.documents || loan.attachments || [],
        riskScore: loan.riskScore || loan.risk_score || undefined,
      };
      
      console.log("Transformed Loan Data:", transformedLoan);
      setLoanData(transformedLoan);
      
      // Fetch agent and factory data
      if (transformedLoan.agentId) {
        console.log("Fetching agent data for ID:", transformedLoan.agentId);
        fetchAgentData(transformedLoan.agentId);
      }
      if (transformedLoan.factoryId) {
        console.log("Fetching factory data for ID:", transformedLoan.factoryId);
        fetchFactoryData(transformedLoan.factoryId);
      }
      
      console.log("Loan data loaded successfully");
    } catch (error) {
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
        status: 'PENDING',
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
        'Loan Type': loanData.loanType,
        'Status': loanData.status.replace(/_/g, ' '),
        'Requested Amount': loanData.requestedAmount,
        'Approved Amount': loanData.approvedAmount || 'N/A',
        'Interest Rate': loanData.interestRate || 'N/A',
        'Tenure (Months)': loanData.tenure,
        'Products Count': loanData.products,
        'Created Date': new Date(loanData.created).toLocaleDateString(),
        'Risk Score': loanData.riskScore || 'N/A',
        'Purpose': loanData.purpose || 'N/A',
        'Agent ID': loanData.agentId || 'N/A',
        'Factory ID': loanData.factoryId || 'N/A',
        'Agent Name': agentData?.name || 'N/A',
        'Agent Email': agentData?.email || 'N/A',
        'Agent Phone': agentData?.phone || 'N/A',
        'Factory Name': factoryData?.name || 'N/A',
        'Factory Email': factoryData?.email || 'N/A',
        'Factory Phone': factoryData?.phone || 'N/A'
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
                <p className="text-sm font-semibold text-gray-700 mb-1">Borrower Name</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.borrowerName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Loan Type</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.loanType}</p>
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
                <p className="text-lg font-medium text-gray-900">{loanData?.status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Tenure</p>
                <p className="text-lg font-medium text-gray-900">{loanData?.tenure} months</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Agent Name</p>
                  <p className="text-lg font-medium text-gray-900">{agentData.name || 'N/A'}</p>
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
                  <p className="text-sm font-semibold text-gray-700 mb-1">Address</p>
                  <p className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {agentData.address || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                  <p className="text-lg font-medium text-gray-900">{agentData.status || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Agent ID</p>
                  <p className="text-lg font-medium text-gray-900">{agentData.id || 'N/A'}</p>
                </div>
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
                  <p className="text-lg font-medium text-gray-900">{factoryData.name || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Email</p>
                  <p className="text-lg font-medium text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {factoryData.email || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Phone</p>
                  <p className="text-lg font-medium text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {factoryData.phone || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Address</p>
                  <p className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {factoryData.address || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                  <p className="text-lg font-medium text-gray-900">{factoryData.status || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Factory ID</p>
                  <p className="text-lg font-medium text-gray-900">{factoryData.id || 'N/A'}</p>
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