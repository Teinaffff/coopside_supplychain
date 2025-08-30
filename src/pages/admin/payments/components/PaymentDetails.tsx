import {
    AlertTriangle,
    ArrowLeft,
    Building,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    Users,
    XCircle,
} from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../common/Loader";
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
import { Payment } from "../../../../constants/interface/admin/payment";
import { formatCurrency } from "../../../../lib/utils";
import { usePayments } from "../../hooks/use-payments";

// Status Icon Component
interface StatusIconProps {
  status: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "pending":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case "failed":
    case "cancelled":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-blue-500" />;
  }
};

// Info Field Component
interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
      {label}
    </span>
    <span className="text-sm text-gray-900 dark:text-slate-100">{value}</span>
  </div>
);

// Summary Card Component
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
  <Card className="p-4 text-center dark:bg-slate-800 dark:border-slate-700">
    <div className={`${colorClass} mb-2`}>{icon}</div>
    <div className="text-lg font-semibold text-gray-900 dark:text-slate-100">
      {value}
    </div>
    <div className="text-sm text-gray-500 dark:text-slate-400">{label}</div>
  </Card>
);

// Activity Item Component
interface ActivityItemProps {
  action: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, timestamp }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
        {action}
      </p>
      <p className="text-xs text-gray-500 dark:text-slate-400">{timestamp}</p>
    </div>
  </div>
);

// Status Button Component
interface StatusButtonProps {
  payment: Payment;
  isLoading: boolean;
}

const StatusButton: React.FC<StatusButtonProps> = ({ payment, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "processing":
        return "bg-blue-500 hover:bg-blue-600";
      case "failed":
        return "bg-red-500 hover:bg-red-600";
      case "cancelled":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Button
      size="sm"
      disabled={isLoading}
      className={`${getStatusColor(payment.status)} text-white`}
    >
      <StatusIcon status={payment.status} />
      <span className="ml-2">{payment.status}</span>
    </Button>
  );
};

// Error State Component
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
        Payment Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested payment could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Payments
      </Button>
    </div>
  </div>
);

const PaymentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { payments, isLoading } = usePayments({ isFetchPayments: true });
  const payment = payments?.find((p) => p?.id?.toString() === id);

  // Handler functions
  const handleBack = () => {
    navigate("/admin/payments");
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (!payment) {
    return <ErrorState onBack={handleBack} />;
  }

  // Mock data for demonstration
  const recentActivities = [
    { action: "Payment processed", timestamp: "2 hours ago" },
    { action: "Payment approved", timestamp: "1 day ago" },
    { action: "Payment initiated", timestamp: "2 days ago" },
  ];

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="px-5 pt-5 pb-10 dark:bg-slate-800 dark:border-slate-700">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Payments
      </Button>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Payment Summary Card */}
        <Card className="lg:col-span-1 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
              {payment.paymentId}
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
              {payment.paymentType}
            </p>
            <Badge
              variant={payment.status === "completed" ? "default" : "secondary"}
            >
              {payment.status}
            </Badge>
          </CardContent>
        </Card>

        {/* Payment Information Card */}
        <Card className="lg:col-span-2 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between dark:text-slate-100">
              <span>Payment Information</span>
              <div className="flex items-center space-x-2">
                <StatusButton
                  payment={payment as unknown as Payment}
                  isLoading={isLoading}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InfoField
                  label="Payer"
                  value={`${payment.payer.name} (${payment.payer.type})`}
                />
                <InfoField
                  label="Payee"
                  value={`${payment.payee.name} (${payment.payee.type})`}
                />
                <InfoField
                  label="Amount"
                  value={`${formatCurrency(payment.amount)} ${
                    payment.currency
                  }`}
                />
                <InfoField
                  label="Payment Method"
                  value={payment.paymentMethod}
                />
              </div>
              {/* Right Column */}
              <div className="space-y-4">
                <InfoField
                  label="Transaction ID"
                  value={payment.transactionId || "N/A"}
                />
                <InfoField
                  label="Reference"
                  value={payment.reference || "N/A"}
                />
                <InfoField
                  label="Payment Date"
                  value={formatDate(payment.paymentDate)}
                />
                <InfoField
                  label="Due Date"
                  value={formatDate(payment.dueDate)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
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
            value="transaction"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Transaction Details
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Summary Information */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField label="Payment ID" value={payment.paymentId} />
                  <InfoField label="Payment Type" value={payment.paymentType} />
                  <InfoField
                    label="Payer"
                    value={`${payment.payer.name} (${payment.payer.type})`}
                  />
                  <InfoField
                    label="Payee"
                    value={`${payment.payee.name} (${payment.payee.type})`}
                  />
                  <InfoField
                    label="Status"
                    value={
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {payment.status}
                      </Badge>
                    }
                  />
                  <InfoField
                    label="Related Entity"
                    value={`${payment.relatedEntity.type}: ${payment.relatedEntity.description}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <SummaryCard
                icon={<DollarSign className="w-8 h-8 mx-auto" />}
                value={`${formatCurrency(payment.amount)} ${payment.currency}`}
                label="Payment Amount"
                colorClass="text-cyan-600 dark:text-cyan-400"
              />
              <SummaryCard
                icon={<CreditCard className="w-8 h-8 mx-auto" />}
                value={`${formatCurrency(payment.fees.totalFees)} ${
                  payment.currency
                }`}
                label="Total Fees"
                colorClass="text-orange-600 dark:text-orange-400"
              />
              <SummaryCard
                icon={<Users className="w-8 h-8 mx-auto" />}
                value={payment.payer.type}
                label="Payer Type"
                colorClass="text-green-600 dark:text-green-400"
              />
              <SummaryCard
                icon={<Building className="w-8 h-8 mx-auto" />}
                value={payment.bankDetails.bankName}
                label="Bank"
                colorClass="text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
        </TabsContent>

        {/* Transaction Details Tab */}
        <TabsContent value="transaction">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bank Details */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Building className="w-5 h-5" />
                  <span>Bank Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Bank Name"
                    value={payment.bankDetails.bankName}
                  />
                  <InfoField
                    label="Account Number"
                    value={payment.bankDetails.accountNumber}
                  />
                  <InfoField
                    label="Branch Code"
                    value={payment.bankDetails.branchCode}
                  />
                  <InfoField
                    label="SWIFT Code"
                    value={payment.bankDetails.swiftCode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Breakdown */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <FileText className="w-5 h-5" />
                  <span>Payment Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payment.breakdown.principalAmount && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Principal Amount:</span>
                      <span>
                        {formatCurrency(payment.breakdown.principalAmount)}
                      </span>
                    </div>
                  )}
                  {payment.breakdown.interestAmount && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Interest Amount:</span>
                      <span>
                        {formatCurrency(payment.breakdown.interestAmount)}
                      </span>
                    </div>
                  )}
                  {payment.breakdown.penaltyAmount && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Penalty Amount:</span>
                      <span>
                        {formatCurrency(payment.breakdown.penaltyAmount)}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Transaction Fee:</span>
                      <span>{formatCurrency(payment.fees.transactionFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Processing Fee:</span>
                      <span>{formatCurrency(payment.fees.processingFee)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                      <span>Total Amount:</span>
                      <span>
                        {formatCurrency(payment.amount)} {payment.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    action={activity.action}
                    timestamp={activity.timestamp}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PaymentDetails;
