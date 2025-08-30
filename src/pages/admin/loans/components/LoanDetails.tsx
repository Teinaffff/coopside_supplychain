import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    CreditCard,
    DollarSign,
    FileText,
    History,
    Users,
    XCircle
} from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loansMockData, loanStatuses } from "../../../../common/data/data";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../../../common/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../../../common/ui/tabs";
import { formatCurrency, formatTime } from "../../../../lib/utils";
import OverlayCard from "../../components/OverlayCard";

// Reusable Error State Component
interface ErrorStateProps {
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onBack }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 dark:text-red-400 mb-4">
        <AlertTriangle className="w-12 h-12 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
        Loan Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested loan could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Loans
      </Button>
    </div>
  </div>
);

// Reusable Info Field Component
interface InfoFieldProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  className = "",
}) => (
  <div
    className={`flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg ${className}`}
  >
    <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
      {label}
    </span>
    <span className="text-sm text-gray-900 dark:text-slate-100">{value}</span>
  </div>
);

// Status Button Component
interface StatusButtonProps {
  loan: any;
  isLoading: boolean;
}

const StatusButton: React.FC<StatusButtonProps> = ({ loan, isLoading }) => {
  const getStatusButton = () => {
    switch (loan.status) {
      case "pending":
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </>
        );
      case "approved":
        return (
          <>
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </>
        );
      default:
        return (
          <>
            <FileText className="w-4 h-4 mr-1" />
            Review
          </>
        );
    }
  };

  return (
    <Button
      variant={loan.status === "approved" ? "destructive" : "default"}
      size="sm"
      disabled={isLoading}
    >
      {getStatusButton()}
    </Button>
  );
};

// Reusable Summary Card Component
interface SummaryCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  value,
  label,
  colorClass,
}) => (
  <Card className="dark:bg-slate-800 dark:border-slate-700">
    <CardContent className="p-4 text-center">
      <div className={`${colorClass} mb-2`}>{icon}</div>
      <div className={`text-lg font-bold ${colorClass}`}>{value}</div>
      <div className="text-xs text-gray-600 dark:text-slate-400">{label}</div>
    </CardContent>
  </Card>
);

const LoanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find loan by ID
  const loan = loansMockData.find((l) => l.id === id);

  // Handler functions
  const handleBack = () => {
    navigate("/admin/loans");
  };

  // Error state
  if (!loan) {
    return <ErrorState onBack={handleBack} />;
  }

  const statusConfig = loanStatuses.find((s) => s.value === loan.status);

  return (
    <Card className="px-5 pt-5 pb-10 dark:bg-slate-800 dark:border-slate-700">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Loans
      </Button>

      {/* Header Section - Enhanced with Beautiful Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Enhanced Profile Image Card */}
        <Card className="lg:col-span-1 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6 text-center">
            <OverlayCard
              imageUrl={undefined}
              altText={loan.borrower.name}
              title={loan.borrower.name}
              subtitle={`Loan ${loan.loanId}`}
              badgeText={loan.loanType}
              isActive={loan.status === "approved"}
            />
          </CardContent>
        </Card>

        {/* Loan Information Card */}
        <Card className="lg:col-span-2 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between dark:text-slate-100">
              <span>Loan Information</span>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`bg-${statusConfig?.color}-50 text-${statusConfig?.color}-700 border-${statusConfig?.color}-200`}
                >
                  {statusConfig?.label || loan.status}
                </Badge>
                <StatusButton loan={loan} isLoading={false} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InfoField label="Loan ID" value={loan.loanId} />
                <InfoField label="Loan Type" value={loan.loanType} />
                <InfoField label="Purpose" value={loan.purpose} />
                <InfoField label="Amount" value={formatCurrency(loan.amount)} />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <InfoField
                  label="Interest Rate"
                  value={
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {loan.interestRate}%
                    </span>
                  }
                />
                <InfoField label="Term" value={`${loan.term} months`} />
                <InfoField label="Currency" value={loan.currency} />
                <InfoField
                  label="Disbursement Date"
                  value={
                    loan.disbursementDate
                      ? formatTime(loan.disbursementDate).shortDate
                      : "Not disbursed"
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          icon={<DollarSign className="w-8 h-8 mx-auto" />}
          value={formatCurrency(loan.amount)}
          label="Loan Amount"
          colorClass="text-blue-600 dark:text-blue-400"
        />
        <SummaryCard
          icon={<CreditCard className="w-8 h-8 mx-auto" />}
          value={formatCurrency(loan.outstandingBalance)}
          label="Outstanding Balance"
          colorClass="text-red-600 dark:text-red-400"
        />
        <SummaryCard
          icon={<Calendar className="w-8 h-8 mx-auto" />}
          value={formatCurrency(loan.monthlyPayment)}
          label="Monthly Payment"
          colorClass="text-green-600 dark:text-green-400"
        />
        <SummaryCard
          icon={<FileText className="w-8 h-8 mx-auto" />}
          value={`${loan.interestRate}%`}
          label="Interest Rate"
          colorClass="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 dark:bg-slate-700">
          <TabsTrigger
            value="overview"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Documents
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Borrower Information */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <FileText className="w-5 h-5" />
                  <span>Borrower Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField label="Name" value={loan.borrower.name} />
                  <InfoField label="Type" value={loan.borrower.type} />
                  <InfoField label="Email" value={loan.borrower.email} />
                  <InfoField label="Phone" value={loan.borrower.phone} />
                </div>
              </CardContent>
            </Card>

            {/* Parties Information */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Users className="w-5 h-5" />
                  <span>Parties</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField label="Name" value={loan.lender.name} />
                  <InfoField label="Type" value={loan.lender.type} />
                  <InfoField label="Guarantor" value={loan.guarantor} />
                  <InfoField label="Collateral" value={loan.collateral} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <History className="w-5 h-5" />
                <span>Payment History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loan.paymentHistory.length > 0 ? (
                <div className="space-y-4">
                  {loan.paymentHistory.map((payment) => (
                    <div
                      key={payment.paymentId}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-slate-100">
                          Payment {payment.paymentId}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-300">
                          {formatTime(payment.paymentDate).shortDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-slate-100">
                          {formatCurrency(payment.amount)}
                        </p>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-slate-300">
                  No payments recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <FileText className="w-5 h-5" />
                <span>Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loan.documents.length > 0 ? (
                <div className="space-y-2">
                  {loan.documents.map((document, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-600 dark:text-slate-300" />
                        <span className="text-gray-900 dark:text-slate-100">
                          {document}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-slate-300">
                  No documents uploaded.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LoanDetails;
