import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Users,
  XCircle
} from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import coopImage from "../../../../assets/images/coop.png";
import { institutionsMockData } from "../../../../common/data/data";
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
import { Institution } from "../../../../constants/interface/admin/institution";
import OverlayCard from "../../components/OverlayCard";

// Function to fetch a single institution by ID
const fetchInstitutionById = async (
  institutionId: string
): Promise<Institution> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const institution = institutionsMockData.find(
    (institution) => institution.id.toString() === institutionId
  );
  if (!institution) {
    throw new Error(`Institution with ID ${institutionId} not found`);
  }
  return institution;
};

// Reusable Loading Component
const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading institution details...</p>
    </div>
  </div>
);

// Reusable Error State Component
interface ErrorStateProps {
  error: Error | null;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onBack }) => (
  <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 mb-4">
        <AlertTriangle className="w-12 h-12 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Institution Not Found
      </h2>
      <p className="text-gray-600 mb-4">
        {error instanceof Error
          ? error.message
          : "The requested institution could not be found."}
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Institutions
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
    className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg ${className}`}
  >
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className="text-sm text-gray-900">{value}</span>
  </div>
);

// Reusable Info Field with Start Alignment
interface InfoFieldStartProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const InfoFieldStart: React.FC<InfoFieldStartProps> = ({
  label,
  value,
  className = "",
}) => (
  <div
    className={`flex justify-between items-start p-3 bg-gray-50 rounded-lg ${className}`}
  >
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <div className="text-sm text-gray-900 text-right">{value}</div>
  </div>
);

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
  <Card>
    <CardContent className="p-4 text-center">
      <div className={`${colorClass} mb-2`}>{icon}</div>
      <div className={`text-lg font-bold ${colorClass}`}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </CardContent>
  </Card>
);

// Reusable Activity Item Component
interface ActivityItemProps {
  action: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, timestamp }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <div className="flex-1">
      <div className="text-sm font-medium">{action}</div>
      <div className="text-xs text-gray-500">{timestamp}</div>
    </div>
  </div>
);

// Agreement Status Component
interface AgreementStatusProps {
  label: string;
  status: boolean;
}

const AgreementStatus: React.FC<AgreementStatusProps> = ({ label, status }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <div className="flex items-center space-x-2">
      {status ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <span
        className={`text-sm font-medium ${
          status ? "text-green-600" : "text-red-600"
        }`}
      >
        {status ? "Agreed" : "Not Agreed"}
      </span>
    </div>
  </div>
);

const InstitutionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch institution data
  const {
    data: institution,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["institution", id],
    queryFn: () => fetchInstitutionById(id!),
    enabled: !!id,
  });

  // Handler functions
  const handleBack = () => {
    navigate("/admin/institutions");
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !institution) {
    return <ErrorState error={error} onBack={handleBack} />;
  }

  // Mock data for demonstration
  const recentActivities = [
    { action: "Institution profile updated", timestamp: "2 hours ago" },
    { action: "Onboarding status changed", timestamp: "1 day ago" },
    { action: "Institution registered", timestamp: "5 days ago" },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="px-5 pt-5 pb-10">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Institutions
      </Button>

      {/* Header Section - Enhanced with OverlayCard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Enhanced Profile Image Card using OverlayCard */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardContent className="p-6">
            <OverlayCard
              imageUrl={institution.logoUrl || coopImage}
              altText={institution.fullLegalName}
              title={institution.fullLegalName}
              subtitle={`TIN: ${institution.tin}`}
              badgeText={institution.institutionType}
              isActive={institution.onboardingStatus === "approved"}
              height="h-[280px]"
              className="w-full"
            />
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {institution.mainOfficeAddress}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Institution Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Institution Information</span>
              <Badge
                variant={
                  institution.onboardingStatus === "approved"
                    ? "default"
                    : "secondary"
                }
                className={
                  institution.onboardingStatus === "approved"
                    ? "bg-green-500"
                    : ""
                }
              >
                {institution.onboardingStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InfoField label="TIN Number" value={institution.tin} />
                <InfoField
                  label="Contact Email"
                  value={institution.contactEmail}
                />
                <InfoField
                  label="Contact Phone"
                  value={institution.contactPhone}
                />
                <InfoField
                  label="Business Sector"
                  value={institution.businessSector}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <InfoField
                  label="Year Established"
                  value={institution.yearOfEstablishment.toString()}
                />
                <InfoField
                  label="Business License"
                  value={institution.businessLicenseNumber}
                />
                <InfoField
                  label="VAT Certificate"
                  value={institution.vatRegistrationCertificate}
                />
                <InfoFieldStart
                  label="Main Office"
                  value={institution.mainOfficeAddress}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Institution Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>Institution Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField
                    label="Full Legal Name"
                    value={institution.fullLegalName}
                  />
                  <InfoField
                    label="Institution Type"
                    value={institution.institutionType}
                  />
                  <InfoField
                    label="Business Sector"
                    value={institution.businessSector}
                  />
                  <InfoField
                    label="Organizational Structure"
                    value={institution.organizationalStructure}
                  />
                  <InfoField
                    label="Establishment Proclamation"
                    value={institution.establishmentProclamation}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Institution Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <SummaryCard
                icon={<Users className="w-8 h-8 mx-auto" />}
                value={(
                  institution.permanentEmployees +
                  institution.contractualEmployees
                ).toString()}
                label="Total Employees"
                colorClass="text-blue-600"
              />
              <SummaryCard
                icon={<Building2 className="w-8 h-8 mx-auto" />}
                value={institution.totalBranches.toString()}
                label="Total Branches"
                colorClass="text-green-600"
              />
              <SummaryCard
                icon={<CreditCard className="w-8 h-8 mx-auto" />}
                value={formatCurrency(institution.currentCapital)}
                label="Current Capital"
                colorClass="text-purple-600"
              />
              <SummaryCard
                icon={<Package className="w-8 h-8 mx-auto" />}
                value={formatCurrency(institution.totalAssetValuation)}
                label="Total Assets"
                colorClass="text-orange-600"
              />
            </div>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Financial Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InfoField
                    label="Current Capital"
                    value={formatCurrency(institution.currentCapital)}
                  />
                  <InfoField
                    label="Total Asset Valuation"
                    value={formatCurrency(institution.totalAssetValuation)}
                  />
                  <InfoField label="TIN Number" value={institution.tin} />
                </div>
                <div className="space-y-4">
                  <InfoField
                    label="VAT Registration Certificate"
                    value={institution.vatRegistrationCertificate}
                  />
                  <InfoField
                    label="Business License Number"
                    value={institution.businessLicenseNumber}
                  />
                  <InfoField
                    label="Monthly Payroll Commitment"
                    value={institution.monthlyPayrollCommitment ? "Yes" : "No"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Employee Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <InfoField
                    label="Permanent Employees"
                    value={institution.permanentEmployees.toString()}
                  />
                  <InfoField
                    label="Contractual Employees"
                    value={institution.contractualEmployees.toString()}
                  />
                </div>
                <div className="space-y-4">
                  <InfoField
                    label="Total Employees"
                    value={(
                      institution.permanentEmployees +
                      institution.contractualEmployees
                    ).toString()}
                  />
                  <InfoField
                    label="Employee Consent Provided"
                    value={institution.employeeConsentProvided ? "Yes" : "No"}
                  />
                </div>
                <div className="space-y-4">
                  <InfoField
                    label="Monthly Payroll Commitment"
                    value={institution.monthlyPayrollCommitment ? "Yes" : "No"}
                  />
                  <InfoField
                    label="Termination Notification Agreement"
                    value={
                      institution.employeeTerminationNotificationAgreement
                        ? "Yes"
                        : "No"
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agreements Tab */}
        <TabsContent value="agreements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Agreement Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AgreementStatus
                  label="Employee Consent Provided"
                  status={institution.employeeConsentProvided}
                />
                <AgreementStatus
                  label="Monthly Payroll Commitment"
                  status={institution.monthlyPayrollCommitment}
                />
                <AgreementStatus
                  label="Employee Termination Notification"
                  status={institution.employeeTerminationNotificationAgreement}
                />
                <AgreementStatus
                  label="Outstanding Receivables Priority"
                  status={institution.outstandingReceivablesPriorityAgreement}
                />
                <AgreementStatus
                  label="Loan Repayment Deduction"
                  status={institution.loanRepaymentDeductionAgreement}
                />
                <AgreementStatus
                  label="Digital Channel Usage"
                  status={institution.digitalChannelUsageAgreement}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
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
                {institution.approvedAt && (
                  <ActivityItem
                    action={`Institution approved by user ${institution.approvedBy}`}
                    timestamp={new Date(
                      institution.approvedAt
                    ).toLocaleDateString()}
                  />
                )}
                {institution.createdAt && (
                  <ActivityItem
                    action="Institution created"
                    timestamp={new Date(
                      institution.createdAt
                    ).toLocaleDateString()}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default InstitutionDetails;
