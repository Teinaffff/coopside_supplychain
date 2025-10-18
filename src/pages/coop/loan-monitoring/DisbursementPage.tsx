import React, { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
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
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  AlertTriangle,
  User,
  Calendar as CalendarIcon,
  CreditCard,
  Activity
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";
import { useNavigate } from "react-router-dom";
import loanApplicationService, { LoanApplication } from "../../../services/loanApplicationService";
import { toast } from "react-hot-toast";

type DisbursementStatus = "pending" | "accepted" | "rejected";

interface DisbursementLoan extends LoanApplication {
  disbursement_status: DisbursementStatus;
  rejection_reason?: string;
  accepted_date?: string;
  repayment_schedule?: {
    installment: number;
    due_date: string;
    amount: number;
    status: "pending" | "paid" | "overdue";
  }[];
  disbursement_activities?: {
    date: string;
    activity: string;
    amount?: number;
    status: string;
  }[];
}

type FilterState = {
  status: string;
  loanType: string;
  tenure: string;
};

const DisbursementPage: React.FC = () => {
  const navigate = useNavigate();
  const [approvedLoans, setApprovedLoans] = useState<DisbursementLoan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    loanType: "all",
    tenure: "all",
  });
  const [selectedLoan, setSelectedLoan] = useState<DisbursementLoan | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data for approved loans with disbursement status
  const mockApprovedLoans: DisbursementLoan[] = [
    {
      applicationNumber: "LA-7A4FF322",
      loanType: "Goods Purchase Financing",
      status: "APPROVED",
      requestedAmount: 4300,
      approvedAmount: 4000,
      tenure: 12,
      products: 2,
      created: "2025-07-10T10:00:00Z",
      factoryId: "FAC-67890",
      agentId: "AG-12345",
      borrowerName: "Alice Smith",
      interestRate: 10,
      purpose: "Purchase steel pipes and cement bags for construction project.",
      documents: [],
      riskScore: 75,
      disbursement_status: "accepted",
      accepted_date: "2025-07-12T14:30:00Z",
      repayment_schedule: [
        { installment: 1, due_date: "2025-08-12", amount: 350, status: "paid" },
        { installment: 2, due_date: "2025-09-12", amount: 350, status: "paid" },
        { installment: 3, due_date: "2025-10-12", amount: 350, status: "pending" },
        { installment: 4, due_date: "2025-11-12", amount: 350, status: "pending" },
      ],
      disbursement_activities: [
        { date: "2025-07-12", activity: "Disbursement Accepted by Agent", amount: 4000, status: "completed" },
        { date: "2025-08-12", activity: "First Installment Paid", amount: 350, status: "completed" },
        { date: "2025-09-12", activity: "Second Installment Paid", amount: 350, status: "completed" },
      ],
    },
    {
      applicationNumber: "LA-9C6HH544",
      loanType: "Goods Purchase Financing",
      status: "APPROVED",
      requestedAmount: 7500,
      approvedAmount: 7000,
      tenure: 18,
      products: 3,
      created: "2025-07-08T09:15:00Z",
      factoryId: "FAC-44556",
      agentId: "AG-12345",
      borrowerName: "Charlie Brown",
      interestRate: 8,
      purpose: "Bulk purchase of raw materials.",
      documents: [],
      riskScore: 80,
      disbursement_status: "pending",
    },
    {
      applicationNumber: "LA-5AAE5E9B",
      loanType: "Equipment Financing",
      status: "APPROVED",
      requestedAmount: 15000,
      approvedAmount: 12000,
      tenure: 24,
      products: 1,
      created: "2025-07-09T14:30:00Z",
      factoryId: "FAC-11223",
      agentId: "AG-98765",
      borrowerName: "Bob Johnson",
      interestRate: 12,
      purpose: "Financing new agricultural machinery.",
      documents: [],
      riskScore: 85,
      disbursement_status: "rejected",
      rejection_reason: "Insufficient documentation provided. Please resubmit with complete financial statements and business registration documents.",
    },
  ];

  useEffect(() => {
    loadApprovedLoans();
  }, [filters, searchTerm]);

  const loadApprovedLoans = async () => {
    try {
      // Use the enriched data function that includes agent names
      console.log('Loading approved loans with agent data...');
      const allLoans = await loanApplicationService.getAllLoanApplicationsWithAgentData();
      console.log('All loans with agent data:', allLoans);
      const approved = allLoans.filter(loan => loan.status === "APPROVED");
      console.log('Approved loans:', approved);
      setApprovedLoans(approved.length > 0 ? approved.map(loan => ({ ...loan, disbursement_status: "pending" as DisbursementStatus })) : mockApprovedLoans);
    } catch (error) {
      console.error('Error loading approved loans:', error);
      toast.error('Failed to load approved loans. Using mock data.');
      setApprovedLoans(mockApprovedLoans);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (application: DisbursementLoan) => {
    setSelectedLoan(application);
    setShowDetails(true);
  };

  const exportToExcel = () => {
    try {
      const excelData = approvedLoans.map(loan => ({
        'Application Number': loan.applicationNumber,
        'Borrower Name': loan.borrowerName || 'N/A',
        'Loan Type': loan.loanType,
        'Requested Amount': loan.requestedAmount,
        'Approved Amount': loan.approvedAmount || 'N/A',
        'Interest Rate': loan.interestRate || 'N/A',
        'Tenure (Months)': loan.tenure,
        'Disbursement Status': loan.disbursement_status.toUpperCase(),
        'Rejection Reason': loan.rejection_reason || 'N/A',
        'Accepted Date': loan.accepted_date ? new Date(loan.accepted_date).toLocaleDateString() : 'N/A',
        'Created Date': new Date(loan.created).toLocaleDateString(),
        'Risk Score': loan.riskScore || 'N/A',
        'Purpose': loan.purpose || 'N/A'
      }));

      const headers = Object.keys(excelData[0] || {});
      const csvContent = [
        headers.join(','),
        ...excelData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `disbursement-status-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Disbursement data exported successfully!');
    } catch (error) {
      console.error('Error exporting disbursement data:', error);
      toast.error('Failed to export disbursement data.');
    }
  };

  const getDisbursementStatusBadge = (status: DisbursementStatus) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, color: "bg-orange-100 text-orange-800", icon: Clock },
      accepted: { variant: "default" as const, color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { variant: "destructive" as const, color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const columns: ColumnDef<DisbursementLoan>[] = useMemo(
    () => [
      {
        accessorKey: "applicationNumber",
        header: "Application No.",
        cell: ({ row }) => (
          <div className="text-blue-600 font-medium py-2">
            {row.getValue("applicationNumber")}
          </div>
        ),
      },
      {
        accessorKey: "borrowerName",
        header: "Borrower Name",
        cell: ({ row }) => (
          <div className="py-2">
            {row.original.borrowerName || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "loanType",
        header: "Loan Type",
        cell: ({ row }) => (
          <div className="py-2">
            <Badge variant="outline">{row.getValue("loanType")}</Badge>
          </div>
        ),
      },
      {
        accessorKey: "requestedAmount",
        header: "Requested Amount",
        cell: ({ row }) => (
          <div className="py-2 font-medium">
            ETB {row.getValue("requestedAmount")?.toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "approvedAmount",
        header: "Approved Amount",
        cell: ({ row }) => (
          <div className="py-2 font-medium">
            ETB {row.original.approvedAmount?.toLocaleString() || "N/A"}
          </div>
        ),
      },
      {
        accessorKey: "disbursement_status",
        header: "Disbursement Status",
        cell: ({ row }) => (
          <div className="py-2">
            {getDisbursementStatusBadge(row.getValue("disbursement_status"))}
          </div>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const disbursementStatus = row.original.disbursement_status;
          
          return (
            <div className="py-2">
              <Button
                size="sm"
                onClick={() => handleViewDetails(row.original)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const stats = useMemo(() => {
    const total = approvedLoans.length;
    const accepted = approvedLoans.filter(loan => loan.disbursement_status === "accepted").length;
    const pending = approvedLoans.filter(loan => loan.disbursement_status === "pending").length;
    const rejected = approvedLoans.filter(loan => loan.disbursement_status === "rejected").length;
    const totalValue = approvedLoans.reduce((sum, loan) => sum + (loan.approvedAmount || 0), 0);
    const acceptedValue = approvedLoans
      .filter(loan => loan.disbursement_status === "accepted")
      .reduce((sum, loan) => sum + (loan.approvedAmount || 0), 0);

    return { total, accepted, pending, rejected, totalValue, acceptedValue };
  }, [approvedLoans]);

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Disbursement Status ({stats.total})
          </h1>
          <p className="text-gray-600">Track agent disbursement decisions and loan activities</p>
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
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Ready for disbursement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Decision</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting agent decision
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">
              Accepted by agents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">
              Rejected by agents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ETB {stats.acceptedValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Value accepted by agents
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
                <SelectItem value="Goods Purchase Financing">Goods Purchase Financing</SelectItem>
                <SelectItem value="Equipment Financing">Equipment Financing</SelectItem>
                <SelectItem value="Working Capital Loan">Working Capital Loan</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Disbursement Status Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Disbursement Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <DataTable
            columns={columns}
            data={approvedLoans}
            searchKey="applicationNumber"
            searchPlaceholder="Search approved loans..."
            clickable={true}
            getSelectedRow={handleViewDetails}
          />
        </CardContent>
      </Card>

      {/* Loan Details Modal */}
      {showDetails && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Loan Details - {selectedLoan.applicationNumber}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>

              {selectedLoan.disbursement_status === "rejected" ? (
                // Rejected Loan - Show only rejection reason
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="flex items-center text-red-900">
                      <XCircle className="w-5 h-5 mr-2" />
                      Disbursement Rejected
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Rejection Reason:</h4>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                          {selectedLoan.rejection_reason || "No reason provided"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Borrower:</h4>
                          <p className="text-gray-900">{selectedLoan.borrowerName || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Approved Amount:</h4>
                          <p className="text-gray-900">ETB {selectedLoan.approvedAmount?.toLocaleString() || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : selectedLoan.disbursement_status === "accepted" ? (
                // Accepted Loan - Show detailed activities and repayment
                <div className="space-y-6">
                  {/* Loan Summary */}
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="flex items-center text-green-900">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Disbursement Accepted
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Borrower:</h4>
                          <p className="text-gray-900">{selectedLoan.borrowerName || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Approved Amount:</h4>
                          <p className="text-gray-900">ETB {selectedLoan.approvedAmount?.toLocaleString() || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Interest Rate:</h4>
                          <p className="text-gray-900">{selectedLoan.interestRate || "N/A"}%</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Accepted Date:</h4>
                          <p className="text-gray-900">
                            {selectedLoan.accepted_date ? new Date(selectedLoan.accepted_date).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Repayment Schedule */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Repayment Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedLoan.repayment_schedule?.map((installment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <span className="font-medium">Installment {installment.installment}</span>
                              <span className="text-gray-600">{installment.due_date}</span>
                              <span className="font-semibold">ETB {installment.amount.toLocaleString()}</span>
                            </div>
                            <Badge 
                              variant={installment.status === "paid" ? "default" : installment.status === "overdue" ? "destructive" : "secondary"}
                              className={
                                installment.status === "paid" ? "bg-green-100 text-green-800" :
                                installment.status === "overdue" ? "bg-red-100 text-red-800" :
                                "bg-orange-100 text-orange-800"
                              }
                            >
                              {installment.status.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Disbursement Activities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Disbursement Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedLoan.disbursement_activities?.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <CalendarIcon className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{activity.activity}</span>
                              {activity.amount && (
                                <span className="text-gray-600">ETB {activity.amount.toLocaleString()}</span>
                              )}
                            </div>
                            <Badge 
                              variant={activity.status === "completed" ? "default" : "secondary"}
                              className={activity.status === "completed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                            >
                              {activity.status.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // Pending Loan - Show basic info
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="bg-orange-50">
                    <CardTitle className="flex items-center text-orange-900">
                      <Clock className="w-5 h-5 mr-2" />
                      Pending Agent Decision
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Borrower:</h4>
                        <p className="text-gray-900">{selectedLoan.borrowerName || "N/A"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Approved Amount:</h4>
                        <p className="text-gray-900">ETB {selectedLoan.approvedAmount?.toLocaleString() || "N/A"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Interest Rate:</h4>
                        <p className="text-gray-900">{selectedLoan.interestRate || "N/A"}%</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Tenure:</h4>
                        <p className="text-gray-900">{selectedLoan.tenure} months</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Purpose:</h4>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLoan.purpose || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisbursementPage;