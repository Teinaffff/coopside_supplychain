import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Badge } from "../../../common/ui/badge";
import {
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import repaymentService, { RepaymentItem } from "../../../services/repaymentService";
import loanApplicationService from "../../../services/loanApplicationService";
import { toast } from "react-hot-toast";
import { Progress } from "../../../common/ui/progress";

const RepaymentDetailPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [repayments, setRepayments] = useState<RepaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRepaymentId, setExpandedRepaymentId] = useState<number | null>(null);

  // Get borrower info from location state if available
  const borrowerInfo = location.state as { borrowerName?: string; applicationNumber?: string } | undefined;
  
  // Show all repayments, but prioritize the one matching the application number if provided
  const sortedRepayments = useMemo(() => {
    if (!borrowerInfo?.applicationNumber) {
      return repayments;
    }
    // Sort repayments to put the matching application number first
    const matching = repayments.filter(r => r.applicationNumber === borrowerInfo.applicationNumber);
    const others = repayments.filter(r => r.applicationNumber !== borrowerInfo.applicationNumber);
    return [...matching, ...others];
  }, [repayments, borrowerInfo?.applicationNumber]);

  const loadRepayments = async () => {
    if (!agentId) return;

    setIsLoading(true);
    try {
      console.log('[RepaymentDetailPage] Step 1: Getting all loan applications for agent:', agentId);
      console.log('[RepaymentDetailPage] Borrower info from state:', borrowerInfo);
      
      // Step 1: Get all loan applications by agent ID
      let loanApplications: any = await loanApplicationService.getLoanApplicationsByAgent(agentId);
      
      // Handle nested response structure
      if (loanApplications && !Array.isArray(loanApplications) && (loanApplications as any).data) {
        loanApplications = (loanApplications as any).data;
      }
      if (!Array.isArray(loanApplications)) {
        loanApplications = loanApplications ? [loanApplications] : [];
      }
      
      console.log('[RepaymentDetailPage] Step 1 Complete: Found', loanApplications.length, 'loan applications for agent');
      
      if (loanApplications.length === 0) {
        toast.error("No loan applications found for this agent");
        setRepayments([]);
        setIsLoading(false);
        return;
      }

      // Step 2: For each loan application, get repayment details using /v1/repayments/loan/{applicationNumber}
      console.log('[RepaymentDetailPage] Step 2: Fetching repayment details for each loan application...');
      const repaymentPromises = loanApplications.map(async (loanApp: any) => {
        const applicationNumber = loanApp.applicationNumber || loanApp.id;
        if (!applicationNumber) {
          console.warn('[RepaymentDetailPage] Skipping loan app without application number:', loanApp);
          return [];
        }
        
        try {
          console.log('[RepaymentDetailPage] Fetching repayment for application:', applicationNumber);
          const repayments = await repaymentService.getRepaymentsByLoan(applicationNumber);
          console.log('[RepaymentDetailPage] Found', repayments.length, 'repayment(s) for application:', applicationNumber);
          return repayments;
        } catch (err: any) {
          // If a loan doesn't have repayment data yet, that's okay - just log and continue
          console.warn(`[RepaymentDetailPage] No repayment found for application ${applicationNumber}:`, err?.response?.data?.message || err?.message);
          return [];
        }
      });

      // Wait for all repayment fetches to complete
      const repaymentArrays = await Promise.all(repaymentPromises);
      
      // Flatten the array of arrays into a single array
      const allRepayments = repaymentArrays.flat();
      console.log('[RepaymentDetailPage] Step 2 Complete: Total repayments found:', allRepayments.length);
      
      setRepayments(allRepayments);
      
      // Auto-expand first repayment if available (prioritize matching application number if provided)
      if (allRepayments.length > 0) {
        let repaymentToExpand = allRepayments[0];
        if (borrowerInfo?.applicationNumber) {
          const matching = allRepayments.find(r => r.applicationNumber === borrowerInfo.applicationNumber);
          if (matching) {
            repaymentToExpand = matching;
          }
        }
        setExpandedRepaymentId(repaymentToExpand.id);
        console.log('[RepaymentDetailPage] Auto-expanding repayment:', repaymentToExpand.id, 'for application:', repaymentToExpand.applicationNumber);
      }
    } catch (err: any) {
      console.error("[RepaymentDetailPage] Failed to load repayments", err);
      toast.error(err?.response?.data?.message || "Failed to load repayments");
      setRepayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load repayments when agentId changes
  useEffect(() => {
    if (agentId) {
      loadRepayments();
    } else {
      toast.error("Agent ID is required");
      navigate("/coop/loan-monitoring/tracking");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  // Auto-expand the matching repayment when location state changes
  useEffect(() => {
    if (agentId && repayments.length > 0 && borrowerInfo?.applicationNumber) {
      const matching = repayments.find(r => r.applicationNumber === borrowerInfo.applicationNumber);
      if (matching && expandedRepaymentId !== matching.id) {
        setExpandedRepaymentId(matching.id);
      }
    }
  }, [borrowerInfo?.applicationNumber, repayments, agentId, expandedRepaymentId]);

  const toggleRepayment = (repaymentId: number) => {
    setExpandedRepaymentId(expandedRepaymentId === repaymentId ? null : repaymentId);
  };

  const stats = useMemo(() => {
    const total = repayments.length;
    const totalLoanAmount = repayments.reduce((sum, r) => sum + r.totalLoanAmount, 0);
    const totalPaid = repayments.reduce((sum, r) => sum + r.paidAmount, 0);
    const totalRemaining = repayments.reduce((sum, r) => sum + r.remainingAmount, 0);
    const overdueCount = repayments.filter((r) => r.isOverdue).length;
    const uniqueApplications = [...new Set(repayments.map(r => r.applicationNumber))];
    return { total, totalLoanAmount, totalPaid, totalRemaining, overdueCount, uniqueApplications };
  }, [repayments]);

  const getStatusBadge = (repayment: RepaymentItem) => {
    const status = repayment.status.toLowerCase();
    if (repayment.isOverdue) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    if (status === "active" || status.includes("active")) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    if (status.includes("completed") || status.includes("paid")) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800">
        {repayment.status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading repayment details...</p>
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
            onClick={() => navigate("/coop/loan-monitoring/tracking")}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Repayment Details</h1>
            <p className="text-gray-600">
              {borrowerInfo?.borrowerName ? (
                <>Repayments for {borrowerInfo.borrowerName}</>
              ) : (
                <>Repayments for Agent {agentId}</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Borrower Info Card */}
      {borrowerInfo?.borrowerName && (
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-cyan-900">
                <User className="w-5 h-5 mr-2" />
                Borrower Information
              </CardTitle>
              {repayments.length > 0 && repayments[0] && getStatusBadge(repayments[0])}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Borrower Name</p>
                <p className="text-lg font-semibold text-gray-900">{borrowerInfo.borrowerName}</p>
              </div>
              {repayments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Loan Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        ETB {stats.totalLoanAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                      <p className="text-xl font-bold text-emerald-600">
                        ETB {stats.totalPaid.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Remaining</p>
                      <p className="text-xl font-bold text-blue-600">
                        ETB {stats.totalRemaining.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Repayments</p>
                      <p className="text-xl font-bold text-cyan-600">
                        {repayments.length}
                      </p>
                    </div>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Repayments List */}
      {repayments.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {borrowerInfo?.applicationNumber 
                ? `No repayment found for application ${borrowerInfo.applicationNumber}.`
                : "No repayments found for this agent."}
            </p>
          </CardContent>
        </Card>
      )}

      {repayments.length > 0 && (
        <div className="space-y-4">
          {sortedRepayments.map((repayment) => {
            const isExpanded = expandedRepaymentId === repayment.id;
            const isHighlighted = borrowerInfo?.applicationNumber === repayment.applicationNumber;
            return (
              <Card
                key={repayment.id}
                className={`border-l-4 transition-all ${
                  isHighlighted 
                    ? 'border-l-blue-600 bg-blue-50/30' 
                    : 'border-l-cyan-500'
                } ${
                  isExpanded ? "shadow-lg" : "hover:shadow-md"
                }`}
              >
                {/* Summary Card - Always Visible */}
                <CardContent className="p-6">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => toggleRepayment(repayment.id)}
                  >
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {repayment.applicationNumber}
                        </h3>
                        {isHighlighted && (
                          <Badge className="bg-blue-600 text-white border-blue-700">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Repayment Progress</span>
                          <span className="font-semibold">{repayment.repaymentProgress.toFixed(2)}%</span>
                        </div>
                        <Progress value={repayment.repaymentProgress} className="h-2" />
                      </div>
                      <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Next Payment: {new Date(repayment.nextPaymentDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          {repayment.paidInstallments}/{repayment.totalInstallments} Installments
                        </div>
                        {repayment.isOverdue && (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {repayment.overdueDays} days overdue
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRepayment(repayment.id);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  {/* Detailed Information - Expandable */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                      {/* Loan Terms */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-600">Tenure</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-semibold">{repayment.tenureMonths} months</p>
                        </CardContent>
                      </Card>

                      {/* Interest Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Interest & Fees</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
                              <p className="text-lg font-semibold">{repayment.interestRate}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                              <p className="text-lg font-semibold">
                                ETB {repayment.totalInterestAmount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Paid Interest</p>
                              <p className="text-lg font-semibold text-emerald-600">
                                ETB {repayment.paidInterestAmount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Remaining Interest</p>
                              <p className="text-lg font-semibold text-blue-600">
                                ETB {repayment.remainingInterestAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payment Schedule */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Next Payment Date</p>
                              <p className="text-lg font-semibold flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(repayment.nextPaymentDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Next Payment Amount</p>
                              <p className="text-lg font-semibold">
                                ETB {repayment.nextPaymentAmount.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Due Date</p>
                              <p className="text-lg font-semibold flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(repayment.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Last Payment Date</p>
                              <p className="text-lg font-semibold">
                                {repayment.lastPaymentDate
                                  ? new Date(repayment.lastPaymentDate).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Penalties & Prepayment */}
                      {(repayment.penaltyAmount > 0 ||
                        repayment.isOverdue ||
                        repayment.prepaymentAllowed) && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Penalties & Prepayment</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {repayment.isOverdue && (
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                  <p className="text-sm text-red-600 mb-1">Overdue</p>
                                  <p className="text-lg font-semibold text-red-700">
                                    {repayment.overdueDays} days
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Penalty: ETB {repayment.penaltyAmount.toLocaleString()}
                                  </p>
                                </div>
                              )}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Penalty Rate</p>
                                <p className="text-lg font-semibold">{repayment.penaltyRate}%</p>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Prepayment Allowed</p>
                                <p className="text-lg font-semibold">
                                  {repayment.prepaymentAllowed ? "Yes" : "No"}
                                </p>
                                {repayment.prepaymentAllowed && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Penalty Rate: {repayment.prepaymentPenaltyRate}%
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Important Dates */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Dates</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Created At</p>
                              <p className="text-lg font-semibold">
                                {new Date(repayment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                              <p className="text-lg font-semibold">
                                {new Date(repayment.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            {repayment.completedAt && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Completed At</p>
                                <p className="text-lg font-semibold">
                                  {new Date(repayment.completedAt).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RepaymentDetailPage;
