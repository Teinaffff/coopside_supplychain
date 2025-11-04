import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Input } from "../../../common/ui/input";
import { Button } from "../../../common/ui/button";
import { Badge } from "../../../common/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../common/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";
import {
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Percent,
  FileText,
  Search,
  ArrowLeft,
  Download,
  Eye,
} from "lucide-react";
import repaymentService, { RepaymentItem } from "../../../services/repaymentService";
import { toast } from "react-hot-toast";
import { Progress } from "../../../common/ui/progress";

const RepaymentsListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [repayments, setRepayments] = useState<RepaymentItem[]>([]);
  const [filteredRepayments, setFilteredRepayments] = useState<RepaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRepayment, setSelectedRepayment] = useState<RepaymentItem | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"loan" | "agent">("loan");
  const [searchValue, setSearchValue] = useState("");

  // Separate function to load repayments for agent (called from useEffect)
  const loadRepaymentsForAgent = useCallback(async (agentId: string) => {
    if (!agentId.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await repaymentService.getRepaymentsByAgent(agentId.trim());
      setRepayments(data);
      setFilteredRepayments(data);
      if (data.length > 0) {
        toast.success(`Loaded ${data.length} repayment${data.length !== 1 ? "s" : ""} for agent ${agentId}`);
      } else {
        toast.info(`No repayments found for agent ${agentId}`);
      }
    } catch (err: any) {
      console.error("Failed to load repayments", err);
      toast.error(err?.response?.data?.message || "Failed to load repayments");
      setRepayments([]);
      setFilteredRepayments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if navigating from Loan Status Tracking page with agentId
  useEffect(() => {
    const state = location.state as { agentId?: string; viewMode?: "loan" | "agent" } | undefined;
    if (state?.agentId && state?.viewMode) {
      setViewMode(state.viewMode);
      setSearchValue(state.agentId);
      // Auto-load repayments when coming from tracking page
      if (state.agentId) {
        loadRepaymentsForAgent(state.agentId);
      }
    }
  }, [location.state, loadRepaymentsForAgent]);

  const loadRepayments = async () => {
    if (!searchValue.trim()) {
      toast.error(`Enter an ${viewMode === "loan" ? "application number" : "agent ID"}`);
      return;
    }

    setIsLoading(true);
    try {
      let data: RepaymentItem[];
      if (viewMode === "loan") {
        data = await repaymentService.getRepaymentsByLoan(searchValue.trim());
      } else {
        data = await repaymentService.getRepaymentsByAgent(searchValue.trim());
      }
      setRepayments(data);
      setFilteredRepayments(data);
      toast.success(`Loaded ${data.length} repayment${data.length !== 1 ? "s" : ""}`);
    } catch (err: any) {
      console.error("Failed to load repayments", err);
      toast.error(err?.response?.data?.message || "Failed to load repayments");
      setRepayments([]);
      setFilteredRepayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = repayments;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.applicationNumber.toLowerCase().includes(term) ||
          r.status.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => {
        const status = r.status.toLowerCase();
        if (filterStatus === "active") return status === "active";
        if (filterStatus === "overdue") return r.isOverdue;
        if (filterStatus === "completed") return status.includes("completed") || status.includes("paid");
        return true;
      });
    }

    setFilteredRepayments(filtered);
  }, [repayments, searchTerm, filterStatus]);

  const handleViewDetails = (repayment: RepaymentItem) => {
    setSelectedRepayment(repayment);
    setShowDetailDialog(true);
  };

  const exportCSV = () => {
    try {
      if (filteredRepayments.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = [
        "Application Number",
        "Total Loan Amount",
        "Paid Amount",
        "Remaining Amount",
        "Progress (%)",
        "Status",
        "Next Payment Date",
        "Monthly Installment",
        "Is Overdue",
      ];

      const rows = filteredRepayments.map((r) => [
        r.applicationNumber,
        r.totalLoanAmount,
        r.paidAmount,
        r.remainingAmount,
        r.repaymentProgress,
        r.status,
        r.nextPaymentDate,
        r.monthlyInstallment,
        r.isOverdue ? "Yes" : "No",
      ]);

      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `repayments-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Exported CSV");
    } catch (e) {
      toast.error("Export failed");
    }
  };

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

  const stats = useMemo(() => {
    const total = filteredRepayments.length;
    const totalLoanAmount = filteredRepayments.reduce((sum, r) => sum + r.totalLoanAmount, 0);
    const totalPaid = filteredRepayments.reduce((sum, r) => sum + r.paidAmount, 0);
    const totalRemaining = filteredRepayments.reduce((sum, r) => sum + r.remainingAmount, 0);
    const overdueCount = filteredRepayments.filter((r) => r.isOverdue).length;
    return { total, totalLoanAmount, totalPaid, totalRemaining, overdueCount };
  }, [filteredRepayments]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/coop/loan-monitoring")}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Repayments</h1>
            <p className="text-gray-600">Manage and track loan repayments</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={exportCSV}
          disabled={filteredRepayments.length === 0}
          className="bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 hover:border-cyan-600"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Search and Filter Card */}
      <Card>
        <CardHeader>
          <CardTitle>Search Repayments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Select value={viewMode} onValueChange={(v: "loan" | "agent") => setViewMode(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loan">By Loan</SelectItem>
                  <SelectItem value="agent">By Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Enter ${viewMode === "loan" ? "application number" : "agent ID"}`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && loadRepayments()}
                className="pl-10"
              />
            </div>
            <Button
              onClick={loadRepayments}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {repayments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Repayments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loan Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ETB {stats.totalLoanAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                ETB {stats.totalPaid.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdueCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {repayments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-grow max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by application number or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Repayments List */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading repayments...</p>
          </div>
        </div>
      )}

      {!isLoading && repayments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No repayments found. Search for repayments to get started.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && repayments.length > 0 && filteredRepayments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No repayments match your filters.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && filteredRepayments.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {filteredRepayments.map((repayment) => (
            <Card
              key={repayment.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-cyan-500"
              onClick={() => handleViewDetails(repayment)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {repayment.applicationNumber}
                      </h3>
                      {getStatusBadge(repayment)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Loan</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ETB {repayment.totalLoanAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Paid Amount</p>
                        <p className="text-lg font-semibold text-emerald-600">
                          ETB {repayment.paidAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ETB {repayment.remainingAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Installment</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ETB {repayment.monthlyInstallment.toLocaleString()}
                        </p>
                      </div>
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
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(repayment);
                    }}
                    className="ml-4"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Repayment Details</DialogTitle>
            <DialogDescription>
              Complete repayment information for {selectedRepayment?.applicationNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedRepayment && (
            <div className="space-y-6">
              {/* Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Application Number
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{selectedRepayment.applicationNumber}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
                  </CardHeader>
                  <CardContent>{getStatusBadge(selectedRepayment)}</CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Tenure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{selectedRepayment.tenureMonths} months</p>
                  </CardContent>
                </Card>
              </div>

              {/* Amount Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Amount Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Loan Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        ETB {selectedRepayment.totalLoanAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Paid Amount</p>
                      <p className="text-xl font-bold text-emerald-600">
                        ETB {selectedRepayment.paidAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Remaining Amount</p>
                      <p className="text-xl font-bold text-blue-600">
                        ETB {selectedRepayment.remainingAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Monthly Installment</p>
                      <p className="text-xl font-bold text-cyan-600">
                        ETB {selectedRepayment.monthlyInstallment.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Repayment Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-lg font-semibold">
                        {selectedRepayment.repaymentProgress.toFixed(2)}%
                      </span>
                    </div>
                    <Progress value={selectedRepayment.repaymentProgress} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Paid Installments</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {selectedRepayment.paidInstallments}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Installments</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedRepayment.totalInstallments}
                        </p>
                      </div>
                    </div>
                  </div>
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
                      <p className="text-lg font-semibold">{selectedRepayment.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                      <p className="text-lg font-semibold">
                        ETB {selectedRepayment.totalInterestAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Paid Interest</p>
                      <p className="text-lg font-semibold text-emerald-600">
                        ETB {selectedRepayment.paidInterestAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Remaining Interest</p>
                      <p className="text-lg font-semibold text-blue-600">
                        ETB {selectedRepayment.remainingInterestAmount.toLocaleString()}
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
                        {new Date(selectedRepayment.nextPaymentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Next Payment Amount</p>
                      <p className="text-lg font-semibold">
                        ETB {selectedRepayment.nextPaymentAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Due Date</p>
                      <p className="text-lg font-semibold flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(selectedRepayment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Last Payment Date</p>
                      <p className="text-lg font-semibold">
                        {selectedRepayment.lastPaymentDate
                          ? new Date(selectedRepayment.lastPaymentDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Penalties & Prepayment */}
              {(selectedRepayment.penaltyAmount > 0 ||
                selectedRepayment.isOverdue ||
                selectedRepayment.prepaymentAllowed) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Penalties & Prepayment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedRepayment.isOverdue && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <p className="text-sm text-red-600 mb-1">Overdue</p>
                          <p className="text-lg font-semibold text-red-700">
                            {selectedRepayment.overdueDays} days
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Penalty: ETB {selectedRepayment.penaltyAmount.toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Penalty Rate</p>
                        <p className="text-lg font-semibold">{selectedRepayment.penaltyRate}%</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Prepayment Allowed</p>
                        <p className="text-lg font-semibold">
                          {selectedRepayment.prepaymentAllowed ? "Yes" : "No"}
                        </p>
                        {selectedRepayment.prepaymentAllowed && (
                          <p className="text-sm text-gray-600 mt-1">
                            Penalty Rate: {selectedRepayment.prepaymentPenaltyRate}%
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Dates */}
              <Card>
                <CardHeader>
                  <CardTitle>Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Created At</p>
                      <p className="text-lg font-semibold">
                        {new Date(selectedRepayment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                      <p className="text-lg font-semibold">
                        {new Date(selectedRepayment.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedRepayment.completedAt && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Completed At</p>
                        <p className="text-lg font-semibold">
                          {new Date(selectedRepayment.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RepaymentsListPage;

